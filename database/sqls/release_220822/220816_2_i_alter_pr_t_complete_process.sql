DROP procedure IF EXISTS pr_t_complete_process ;

DELIMITER $$

CREATE PROCEDURE pr_t_complete_process(
    OUT pResult         INT             , -- 結果[1:成功 0:失敗]
    OUT pMessage        VARCHAR(1024)   , -- メッセージ
        pMUserId        INT             , -- 担当者id
        pMBranchId      INT             , -- 拠点id
        pDealingMkvId   INT             , -- 取引区分[1010001:売 1010002:買]
        pCompleteDay    DATE            , -- 締処理日[2000/01/01...]
        pClosingDate    INT             , -- 締日[0, 5, 10 , 15, 20, 25, 31, 99...]
        pCustomerId     INT               -- 取引先id [省略可能 省略時はNULL]
)
    MODIFIES SQL DATA
    COMMENT '締処理'

MainRoutine:
BEGIN
    DECLARE cnt INT DEFAULT 0 ; -- 処理結果件数
    DECLARE t_complete_id INT DEFAULT 0 ; -- 取引先指定時に追加された請求締id

    -- 処理する例外ハンドラを指定
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
    BEGIN
        -- エラー内容を診断情報に生成
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT ;

        -- エラー内容を呼び出し元に戻す
        SET pMessage = CONCAT('SQL Error[', IFNULL(@sqlstate, ''), ':', IFNULL(@errno, ''), '] ' , IFNULL(@text, '')) ;
        SET pResult  = 0 ;
        SELECT pResult AS result, pMessage AS message ;

        ROLLBACK ;
    END ;

    -- 変数初期化
    SET pResult  = 0    ; 
    SET pMessage = NULL ; 

    -- 締確認
    CALL pr_t_complete_check(pResult, pMessage, pMUserId, pMBranchId, pDealingMkvId, pCompleteDay, pClosingDate, pCustomerId, TRUE, FALSE) ;

    IF pResult != 1 THEN
        -- 締確認 NGなので処理を抜ける
        LEAVE MainRoutine ;
    END IF ;

    -- ① Transaction開始
    START TRANSACTION ;

    -- 動的SQLでテーブル名のみ変更(t_sales <-> t_p_invoices)したいが
    -- Ver5.6時点では動的SQLが複数行対応してない、実行計画(Explain)が最適化されてないと使い勝手がまだわるいのでIF文で切り分けて静的SQLで実行しています
    -- Ver8からWith句・Window関数が使えるのでもう少し単純なSQLに変換できるのですが現状これでいきます
    -- 修正する際は売・買のSQLを両方変更してください

    -- ② 消費税データ作成
    --    取引先の締区分が請求時 & 商品が外税(通常10%・軽減8%) 端数は取引先の消費税端数区分で計算
    IF pDealingMkvId = 1010001 THEN
        -- 売
        INSERT INTO t_sales 
                    (m_branch_id, m_customer_id, accounting_m_customer_id, m_user_id, slip_m_kv_id, accounting_date,   shipped_at, tax, tax_normal, tax_reduced, created_m_user_id, updated_m_user_id)  
             SELECT   pMBranchId, m_customer_id,            m_customer_id,  pMUserId,      1160003,    pCompleteDay, pCompleteDay, tax, tax_normal, tax_reduced,          pMUserId,          pMUserId   
               FROM (/* 金額集計に対して消費税の集計と端数処理 */                                                                                                                                       
                     SELECT m_customer_id,                                                                                                                                                              
                            SUM(IF(tax_m_kv_id IN(1170001, 1170002), ROUNDING(total_price * (tax_rate * 0.01), tax_fraction_m_kv_id), 0)) AS tax         , /* 税合計        */                          
                            SUM(IF(tax_m_kv_id  = 1170001          , ROUNDING(total_price * (tax_rate * 0.01), tax_fraction_m_kv_id), 0)) AS tax_normal  , /* 通常税率(10%) */                          
                            SUM(IF(tax_m_kv_id  =          1170002 , ROUNDING(total_price * (tax_rate * 0.01), tax_fraction_m_kv_id), 0)) AS tax_reduced   /* 軽減税率( 8%) */                          
                       FROM (/* 新旧消費税区分毎に金額集計 */                                               
                             SELECT m.id                   AS m_customer_id         ,                       
                                    m.tax_fraction_m_kv_id AS tax_fraction_m_kv_id  ,                       
                                    d.tax_m_kv_id          AS tax_m_kv_id           ,                       
                                    d.tax_rate             AS tax_rate              ,                       
                                    SUM(d.total_price)     AS total_price                                   
                               FROM t_sales        AS s                                                     
                               JOIN t_sale_details AS d                                                     
                               JOIN m_customers    AS m                                                     
                                 ON (                                                                       
                                     s.id = d.t_sale_id                                                     
                                     AND                                                                    
                                     s.accounting_m_customer_id = m.id                                      
                                    )                                                                       
                              WHERE s.t_complete_id    = 0                                                  
                                AND m.account_m_kv_id  = 1060003                                            
                                AND s.accounting_date <= pCompleteDay                                       
                                AND d.tax_m_kv_id     IN (1170001, 1170002)                                 
                                AND s.m_branch_id      = pMBranchId                                         
                                    /* 取引先の条件 */                                                      
                                AND m.id               = IFNULL(pCustomerId, m.id)                          
                                AND m.closing_date     = pClosingDate                                       
                                AND m.dealing_m_kv_id  = pDealingMkvId                                      
                              GROUP BY m.id, m.tax_fraction_m_kv_id, d.tax_m_kv_id, d.tax_rate              
                            ) t                                                                             
                      GROUP BY m_customer_id                                                                
                    ) t ;                                                                                   
    ELSE
        -- 買
        INSERT INTO t_p_invoices 
                    (m_branch_id, supplier_m_customer_id, m_user_id, slip_m_kv_id, accounting_date, purchase_date, tax, tax_normal, tax_reduced, created_m_user_id, updated_m_user_id)  
             SELECT   pMBranchId,          m_customer_id,  pMUserId,      1160003,    pCompleteDay,  pCompleteDay, tax, tax_normal, tax_reduced,          pMUserId,          pMUserId   
               FROM (/* 金額集計に対して消費税の集計と端数処理 */                                                                                                                       
                     SELECT m_customer_id,                                                                                                                                              
                            SUM(IF(tax_m_kv_id IN(1170001, 1170002), ROUNDING(total_price * (tax_rate * 0.01), tax_fraction_m_kv_id), 0)) AS tax         , /* 税合計        */          
                            SUM(IF(tax_m_kv_id  = 1170001          , ROUNDING(total_price * (tax_rate * 0.01), tax_fraction_m_kv_id), 0)) AS tax_normal  , /* 通常税率(10%) */          
                            SUM(IF(tax_m_kv_id  =          1170002 , ROUNDING(total_price * (tax_rate * 0.01), tax_fraction_m_kv_id), 0)) AS tax_reduced   /* 軽減税率( 8%) */          
                       FROM (/* 新旧消費税区分毎に金額集計 */                                               
                             SELECT m.id                   AS m_customer_id         ,                       
                                    m.tax_fraction_m_kv_id AS tax_fraction_m_kv_id  ,                       
                                    d.tax_m_kv_id          AS tax_m_kv_id           ,                       
                                    d.tax_rate             AS tax_rate              ,                       
                                    SUM(d.total_price)     AS total_price                                   
                               FROM t_p_invoices        AS s                                                
                               JOIN t_p_invoice_details AS d                                                
                               JOIN m_customers         AS m                                                
                                 ON (                                                                       
                                     s.id = d.t_p_invoice_id                                                
                                     AND                                                                    
                                     s.supplier_m_customer_id = m.id                                        
                                    )                                                                       
                              WHERE s.t_complete_id    = 0                                                  
                                AND m.account_m_kv_id  = 1060003                                            
                                AND s.accounting_date <= pCompleteDay                                       
                                AND d.tax_m_kv_id     IN (1170001, 1170002)                                 
                                AND s.m_branch_id      = pMBranchId                                         
                                    /* 取引先の条件 */                                                      
                                AND m.id               = IFNULL(pCustomerId, m.id)                          
                                AND m.closing_date     = pClosingDate                                       
                                AND m.dealing_m_kv_id  = pDealingMkvId                                      
                              GROUP BY m.id, m.tax_fraction_m_kv_id, d.tax_m_kv_id, d.tax_rate              
                            ) t                                                                             
                      GROUP BY m_customer_id                                                                
                    ) t ;                                                                                   
    END IF ;

    -- ③ 請求データ作成
    IF pDealingMkvId = 1010001 THEN
        -- 売
        INSERT INTO t_completes 
                    (m_branch_id, m_customer_id, dealing_m_kv_id, complete_day, carry_over, total_price, total_price_normal, total_price_reduced, tax, tax_normal, tax_reduced, payment_price, grand_total, created_m_user_id, updated_m_user_id)  
             SELECT   pMBranchId, m_customer_id,   pDealingMkvId, pCompleteDay, carry_over, total_price, total_price_normal, total_price_reduced, tax, tax_normal, tax_reduced, payment_price, grand_total,          pMUserId,          pMUserId   
               FROM (/* 締データを作成する為に集計 */                                                                                                                                            
                     SELECT m_customer_id                                                      AS m_customer_id       , /* 取引先id                */                                            
                            SUM(carry_over         )                                           AS carry_over          , /* 前回繰越金額            */                                            
                            SUM(total_price        )                                           AS total_price         , /* 売上/仕入合計金額       */                                            
                            SUM(total_price_normal )                                           AS total_price_normal  , /* 売上/仕入金額(通常税率) */                                            
                            SUM(total_price_reduced)                                           AS total_price_reduced , /* 売上/仕入金額(軽減税率) */                                            
                            SUM(tax                )                                           AS tax                 , /* 消費税                  */                                            
                            SUM(tax_normal         )                                           AS tax_normal          , /* 消費税(通常税率)        */                                            
                            SUM(tax_reduced        )                                           AS tax_reduced         , /* 消費税(軽減税率)        */                                            
                            SUM(payment_price      )                                           AS payment_price       , /* 入金/支払金額           */                                            
                            SUM(carry_over) + SUM(total_price) + SUM(tax) - SUM(payment_price) AS grand_total           /* 請求金額 = 前回繰越金額 + 売上・仕入金額 + 消費税 - 入金・支払金額 */ 
                       FROM (/* 売上・消費税 */                                                                                                           
                             SELECT m.id                                                           AS m_customer_id       , /* 取引先id                */ 
                                    CONVERT(0, DECIMAL(15, 4))                                     AS carry_over          , /* 前回繰越金額            */ 
                                    ROUNDING(SUM(s.total_price        ), m.price_fraction_m_kv_id) AS total_price         , /* 売上/仕入合計金額       */ 
                                    ROUNDING(SUM(s.total_price_normal ), m.price_fraction_m_kv_id) AS total_price_normal  , /* 売上/仕入金額(通常税率) */ 
                                    ROUNDING(SUM(s.total_price_reduced), m.price_fraction_m_kv_id) AS total_price_reduced , /* 売上/仕入金額(軽減税率) */ 
                                    ROUNDING(SUM(s.tax                ),   m.tax_fraction_m_kv_id) AS tax                 , /* 消費税                  */ 
                                    ROUNDING(SUM(s.tax_normal         ),   m.tax_fraction_m_kv_id) AS tax_normal          , /* 消費税(通常税率)        */ 
                                    ROUNDING(SUM(s.tax_reduced        ),   m.tax_fraction_m_kv_id) AS tax_reduced         , /* 消費税(軽減税率)        */ 
                                    CONVERT(0, DECIMAL(15, 4))                                     AS payment_price         /* 入金/支払金額           */ 
                               FROM t_sales     AS s                                                            
                               JOIN m_customers AS m                                                            
                                 ON s.accounting_m_customer_id = m.id                                           
                              WHERE s.t_complete_id    = 0                                                      
                                AND s.accounting_date <= pCompleteDay                                           
                                AND s.m_branch_id      = pMBranchId                                             
                                    /* 取引先の条件 */                                                          
                                AND m.id               = IFNULL(pCustomerId, m.id)                              
                                AND m.closing_date     = pClosingDate                                           
                                AND m.dealing_m_kv_id  = pDealingMkvId                                          
                              GROUP BY m.id                                                                     

                             /* 入金 */                                                                         
                             UNION ALL                                                                          
                             SELECT m.id                 AS m_customer_id       , /* 取引先id                */ 
                                    0                    AS carry_over          , /* 前回繰越金額            */ 
                                    0                    AS total_price         , /* 売上/仕入合計金額       */ 
                                    0                    AS total_price_normal  , /* 売上/仕入金額(通常税率) */ 
                                    0                    AS total_price_reduced , /* 売上/仕入金額(軽減税率) */ 
                                    0                    AS tax                 , /* 消費税                  */ 
                                    0                    AS tax_normal          , /* 消費税(通常税率)        */ 
                                    0                    AS tax_reduced         , /* 消費税(軽減税率)        */ 
                                    SUM(c.payment_price) AS payment_price         /* 入金/支払金額           */ 
                               FROM t_complete_details AS c                                                     
                               JOIN m_customers        AS m                                                     
                                 ON c.m_customer_id    = m.id                                                   
                              WHERE c.t_complete_id    = 0                                                      
                                AND c.dealing_m_kv_id  = pDealingMkvId                                          
                                AND c.payment_day     <= pCompleteDay                                           
                                AND c.m_branch_id      = pMBranchId                                             
                                    /* 取引先の条件 */                                                          
                                AND m.id               = IFNULL(pCustomerId, m.id)                              
                                AND m.closing_date     = pClosingDate                                           
                                AND m.dealing_m_kv_id  = pDealingMkvId                                          
                              GROUP BY m.id                                                                     

                             /* 繰越 */                                                                         
                             UNION ALL                                                                          
                             SELECT c.m_customer_id      AS m_customer_id       , /* 取引先id                */ 
                                    c.grand_total        AS carry_over          , /* 前回繰越金額            */ 
                                    0                    AS total_price         , /* 売上/仕入合計金額       */ 
                                    0                    AS total_price_normal  , /* 売上/仕入金額(通常税率) */ 
                                    0                    AS total_price_reduced , /* 売上/仕入金額(軽減税率) */ 
                                    0                    AS tax                 , /* 消費税                  */ 
                                    0                    AS tax_normal          , /* 消費税(通常税率)        */ 
                                    0                    AS tax_reduced         , /* 消費税(軽減税率)        */ 
                                    0                    AS payment_price         /* 入金/支払金額           */ 
                               FROM t_completes AS c                                                            
                               JOIN (/* 取引先毎の前回請求id */                                                 
                                     SELECT MAX(c.id) AS id                                                     
                                       FROM t_completes AS c                                                    
                                       JOIN m_customers AS m                                                    
                                         ON c.m_customer_id    = m.id                                           
                                      WHERE c.dealing_m_kv_id  = pDealingMkvId                                  
                                        AND c.m_branch_id      = pMBranchId                                     
                                            /* 取引先の条件 */                                                  
                                        AND m.id               = IFNULL(pCustomerId, m.id)                      
                                        AND m.closing_date     = pClosingDate                                   
                                        AND m.dealing_m_kv_id  = pDealingMkvId                                  
                                      GROUP BY m.id                                                             
                                            /* 締処理日以降の請求データは対象外 */                              
                                     HAVING MAX(c.complete_day) < pCompleteDay                                  
                                    ) AS q                                                                      
                                 ON c.id           = q.id                                                       
                              WHERE c.grand_total != 0                                                          
                            ) AS t1             
                      GROUP BY m_customer_id    
                    ) AS t2                     
               JOIN m_customers AS m            
                 ON t2.m_customer_id = m.id     
              ORDER BY m.cd ;                   
    ELSE
        -- 買
        INSERT INTO t_completes 
                    (m_branch_id, m_customer_id, dealing_m_kv_id, complete_day, carry_over, total_price, total_price_normal, total_price_reduced, tax, tax_normal, tax_reduced, payment_price, grand_total, created_m_user_id, updated_m_user_id)  
             SELECT   pMBranchId, m_customer_id,   pDealingMkvId, pCompleteDay, carry_over, total_price, total_price_normal, total_price_reduced, tax, tax_normal, tax_reduced, payment_price, grand_total,          pMUserId,          pMUserId   
               FROM (/* 締データを作成する為に集計 */                                                                                                                                            
                     SELECT m_customer_id                                                      AS m_customer_id       , /* 取引先id                */                                            
                            SUM(carry_over         )                                           AS carry_over          , /* 前回繰越金額            */                                            
                            SUM(total_price        )                                           AS total_price         , /* 売上/仕入合計金額       */                                            
                            SUM(total_price_normal )                                           AS total_price_normal  , /* 売上/仕入金額(通常税率) */                                            
                            SUM(total_price_reduced)                                           AS total_price_reduced , /* 売上/仕入金額(軽減税率) */                                            
                            SUM(tax                )                                           AS tax                 , /* 消費税                  */                                            
                            SUM(tax_normal         )                                           AS tax_normal          , /* 消費税(通常税率)        */                                            
                            SUM(tax_reduced        )                                           AS tax_reduced         , /* 消費税(軽減税率)        */                                            
                            SUM(payment_price      )                                           AS payment_price       , /* 入金/支払金額           */                                            
                            SUM(carry_over) + SUM(total_price) + SUM(tax) - SUM(payment_price) AS grand_total           /* 請求金額 = 前回繰越金額 + 売上・仕入金額 + 消費税 - 入金・支払金額 */ 
                       FROM (/* 仕入・消費税 */                                                                                                           
                             SELECT m.id                                                           AS m_customer_id       , /* 取引先id                */ 
                                    CONVERT(0, DECIMAL(15, 4))                                     AS carry_over          , /* 前回繰越金額            */ 
                                    ROUNDING(SUM(s.total_price        ), m.price_fraction_m_kv_id) AS total_price         , /* 売上/仕入合計金額       */ 
                                    ROUNDING(SUM(s.total_price_normal ), m.price_fraction_m_kv_id) AS total_price_normal  , /* 売上/仕入金額(通常税率) */ 
                                    ROUNDING(SUM(s.total_price_reduced), m.price_fraction_m_kv_id) AS total_price_reduced , /* 売上/仕入金額(軽減税率) */ 
                                    ROUNDING(SUM(s.tax                ),   m.tax_fraction_m_kv_id) AS tax                 , /* 消費税                  */ 
                                    ROUNDING(SUM(s.tax_normal         ),   m.tax_fraction_m_kv_id) AS tax_normal          , /* 消費税(通常税率)        */ 
                                    ROUNDING(SUM(s.tax_reduced        ),   m.tax_fraction_m_kv_id) AS tax_reduced         , /* 消費税(軽減税率)        */ 
                                    CONVERT(0, DECIMAL(15, 4))                                     AS payment_price         /* 入金/支払金額           */ 
                               FROM t_p_invoices AS s                                                           
                               JOIN m_customers  AS m                                                           
                                 ON s.supplier_m_customer_id = m.id                                             
                              WHERE s.t_complete_id    = 0                                                      
                                AND s.accounting_date <= pCompleteDay                                           
                                AND s.m_branch_id      = pMBranchId                                             
                                    /* 取引先の条件 */                                                          
                                AND m.id               = IFNULL(pCustomerId, m.id)                              
                                AND m.closing_date     = pClosingDate                                           
                                AND m.dealing_m_kv_id  = pDealingMkvId                                          
                              GROUP BY m.id                                                                     

                             /* 支払 */                                                                         
                             UNION ALL                                                                          
                             SELECT m.id                 AS m_customer_id       , /* 取引先id                */ 
                                    0                    AS carry_over          , /* 前回繰越金額            */ 
                                    0                    AS total_price         , /* 売上/仕入合計金額       */ 
                                    0                    AS total_price_normal  , /* 売上/仕入金額(通常税率) */ 
                                    0                    AS total_price_reduced , /* 売上/仕入金額(軽減税率) */ 
                                    0                    AS tax                 , /* 消費税                  */ 
                                    0                    AS tax_normal          , /* 消費税(通常税率)        */ 
                                    0                    AS tax_reduced         , /* 消費税(軽減税率)        */ 
                                    SUM(c.payment_price) AS payment_price         /* 入金/支払金額           */ 
                               FROM t_complete_details AS c                                                     
                               JOIN m_customers        AS m                                                     
                                 ON c.m_customer_id    = m.id                                                   
                              WHERE c.t_complete_id    = 0                                                      
                                AND c.dealing_m_kv_id  = pDealingMkvId                                          
                                AND c.payment_day     <= pCompleteDay                                           
                                AND c.m_branch_id      = pMBranchId                                             
                                    /* 取引先の条件 */                                                          
                                AND m.id               = IFNULL(pCustomerId, m.id)                              
                                AND m.closing_date     = pClosingDate                                           
                                AND m.dealing_m_kv_id  = pDealingMkvId                                          
                              GROUP BY m.id                                                                     

                             /* 繰越 */                                                                         
                             UNION ALL                                                                          
                             SELECT c.m_customer_id      AS m_customer_id       , /* 取引先id                */ 
                                    c.grand_total        AS carry_over          , /* 前回繰越金額            */ 
                                    0                    AS total_price         , /* 売上/仕入合計金額       */ 
                                    0                    AS total_price_normal  , /* 売上/仕入金額(通常税率) */ 
                                    0                    AS total_price_reduced , /* 売上/仕入金額(軽減税率) */ 
                                    0                    AS tax                 , /* 消費税                  */ 
                                    0                    AS tax_normal          , /* 消費税(通常税率)        */ 
                                    0                    AS tax_reduced         , /* 消費税(軽減税率)        */ 
                                    0                    AS payment_price         /* 入金/支払金額           */ 
                               FROM t_completes AS c                                                            
                               JOIN (/* 取引先毎の前回請求id */                                                 
                                     SELECT MAX(c.id) AS id                                                     
                                       FROM t_completes AS c                                                    
                                       JOIN m_customers AS m                                                    
                                         ON c.m_customer_id    = m.id                                           
                                      WHERE c.dealing_m_kv_id  = pDealingMkvId                                  
                                        AND c.complete_day     < pCompleteDay                                   
                                        AND c.m_branch_id      = pMBranchId                                     
                                            /* 取引先の条件 */                                                  
                                        AND m.id               = IFNULL(pCustomerId, m.id)                      
                                        AND m.closing_date     = pClosingDate                                   
                                        AND m.dealing_m_kv_id  = pDealingMkvId                                  
                                      GROUP BY m.id                                                             
                                            /* 締処理日以降の請求データは対象外 */                              
                                     HAVING MAX(c.complete_day) < pCompleteDay                                  
                                    ) AS q                                                                      
                                 ON c.id           = q.id                                                       
                              WHERE c.grand_total != 0                                                          
                            ) AS t1             
                      GROUP BY m_customer_id    
                    ) AS t2                     
               JOIN m_customers AS m            
                 ON t2.m_customer_id = m.id     
              ORDER BY m.cd ;                   
    END IF ;

    -- 処理された件数を表示
    SELECT ROW_COUNT() INTO cnt ;
    IF pCustomerId IS NOT NULL THEN
        -- 取引先1件のみの場合は請求idを表示
        SELECT LAST_INSERT_ID()  INTO t_complete_id ;
    END IF ;

    -- ④ 売上・仕入の更新(請求Idを付番)
    IF pDealingMkvId = 1010001 THEN
        -- 売
        UPDATE t_sales      AS s                                                        
          JOIN m_customers  AS m                                                        
            ON s.accounting_m_customer_id = m.id                                        
           SET s.t_complete_id = (/* 売上締 */                                          
                                  SELECT c.id                                           
                                    FROM t_completes AS c                               
                                   WHERE c.m_customer_id   = s.accounting_m_customer_id 
                                     AND c.dealing_m_kv_id = pDealingMkvId              
                                     AND c.complete_day    = pCompleteDay               
                                 )                                                      
         WHERE s.t_complete_id    = 0                                                   
           AND s.accounting_date <= pCompleteDay                                        
           AND s.m_branch_id      = pMBranchId                                          
               /* 取引先の条件 */                                                       
           AND m.id               = IFNULL(pCustomerId, m.id)                           
           AND m.closing_date     = pClosingDate                                        
           AND m.dealing_m_kv_id  = pDealingMkvId ;                                     
    ELSE
        -- 買
        UPDATE t_p_invoices AS s                                                        
          JOIN m_customers  AS m                                                        
            ON s.supplier_m_customer_id = m.id                                          
           SET s.t_complete_id = (/* 仕入締 */                                          
                                  SELECT c.id                                           
                                    FROM t_completes AS c                               
                                   WHERE c.m_customer_id   = s.supplier_m_customer_id   
                                     AND c.dealing_m_kv_id = pDealingMkvId              
                                     AND c.complete_day    = pCompleteDay               
                                 )                                                      
         WHERE s.t_complete_id    = 0                                                   
           AND s.accounting_date <= pCompleteDay                                        
           AND s.m_branch_id      = pMBranchId                                          
               /* 取引先の条件 */                                                       
           AND m.id               = IFNULL(pCustomerId, m.id)                           
           AND m.closing_date     = pClosingDate                                        
           AND m.dealing_m_kv_id  = pDealingMkvId ;                                     
    END IF ;

    -- ⑤ 入金・支払データの更新(請求Idを付番)
    -- 売・買
    UPDATE t_complete_details AS d                                       
      JOIN m_customers        AS m                                       
        ON d.m_customer_id = m.id                                        
       SET d.t_complete_id = (/* 売上・仕入締 */                         
                              SELECT c.id                                
                                FROM t_completes AS c                    
                               WHERE c.m_customer_id   = d.m_customer_id 
                                 AND c.dealing_m_kv_id = pDealingMkvId   
                                 AND c.complete_day    = pCompleteDay    
                             )                                           
     WHERE d.t_complete_id    = 0                                        
       AND d.payment_day     <= pCompleteDay                             
       AND d.m_branch_id      = pMBranchId                               
           /* 取引先の条件 */                                            
       AND m.id               = IFNULL(pCustomerId, m.id)                
       AND m.closing_date     = pClosingDate                             
       AND m.dealing_m_kv_id  = pDealingMkvId ;                          

    -- ⑥ Transaction終了
    COMMIT ;

    SET pMessage = CONCAT('締処理が完了しました [', IF(pDealingMkvId = 1010001, '売', '買'), '][締対象日：', pCompleteDay, ']') ;
    SET pResult  = 1 ; -- [Success]

    -- Laravel(+PDO)でout引数を受け取れないのが判ったのでSELECT結果として返す
    SELECT pResult AS result, pMessage AS message, t_complete_id AS t_complete_id;

END$$

DELIMITER ;
