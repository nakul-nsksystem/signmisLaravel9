DROP procedure IF EXISTS pr_t_complete_validation ;
DROP procedure IF EXISTS pr_t_complete_check ;

DELIMITER $$

CREATE PROCEDURE pr_t_complete_check(
    OUT pResult          INT             , -- 結果[1:チェックOK 0:チェックNG]
    OUT pMessage         VARCHAR(1024)   , -- メッセージ
        pMUserId         INT             , -- 担当者id
        pMBranchId       INT             , -- 拠点id
        pDealingMkvId    INT             , -- 取引区分[1010001:売 1010002:買]
        pCompleteDay     DATE            , -- 締処理日[2000/01/01...]
        pClosingDate     INT             , -- 締日[0, 5, 10 , 15, 20, 25, 31, 99...]
        pCustomerId      INT             , -- 取引先id [省略可能 省略時はNULL]
        pIsComplete      BOOLEAN         , -- 処理区分 [TRUE:締処理 FALSE:締解除]
        pIsResultMessage BOOLEAN           -- 処理区分 [TRUE:メッセージを表示する FALSE:表示しない] ストアド結果をSELECTで返す必要があるので制御してます
)
    READS SQL DATA
    COMMENT '締確認'

MainRoutine:
BEGIN
    DECLARE cnt         INT           DEFAULT 0    ; 
    DECLARE cntComplete VARCHAR(1024) DEFAULT NULL ; 

    -- 変数初期化
    SET pResult  = 0    ; 
    SET pMessage = NULL ; 

    -- 締対象データの件数を取得
    SELECT GROUP_CONCAT(c) INTO cntComplete                              
      FROM (/* 締処理日毎の件数を取得 */                                 
            SELECT CONCAT(' [', DATE_FORMAT(complete_day, '%Y-%m-%d'), '：', COUNT(*), '件]') AS c
              FROM (/* 締と取引先を結合 */                               
                    SELECT c.complete_day                                
                      FROM t_completes AS c                              
                      JOIN m_customers AS m                              
                        ON c.m_customer_id   = m.id                      
                     WHERE c.complete_day    > pCompleteDay              
                       AND c.dealing_m_kv_id = pDealingMkvId             
                       AND c.m_branch_id     = pMBranchId                
                           /* 取引先の条件 */                            
                       AND m.id              = IFNULL(pCustomerId, m.id) 
                       AND m.closing_date    = pClosingDate              
                       AND m.dealing_m_kv_id = pDealingMkvId             
                   ) AS t                                                
             GROUP BY complete_day                                       
             ORDER BY complete_day                                       
           ) AS t ;                                                      

    IF cntComplete IS NOT NULL THEN
        -- 締処理日以降にデータがある場合はNG
        SET pMessage = CONCAT('指定日以降に締データが存在します [', IF(pDealingMkvId = 1010001, '売', '買'), ']', cntComplete) ;

    ELSEIF NOT pIsComplete THEN
        -- 締解除の事前検査

        -- 締と取引先を結合
        SELECT COUNT(*) INTO cnt                             
          FROM t_completes AS c                              
          JOIN m_customers AS m                              
            ON c.m_customer_id   = m.id                      
         WHERE c.complete_day    = pCompleteDay              
           AND c.dealing_m_kv_id = pDealingMkvId             
           AND c.m_branch_id     = pMBranchId                
               /* 取引先の条件 */                            
           AND m.id              = IFNULL(pCustomerId, m.id) 
           AND m.closing_date    = pClosingDate              
           AND m.dealing_m_kv_id = pDealingMkvId ;           

        IF cnt = 0 THEN
            -- 解除するデータがない場合はNG
            SET pMessage = CONCAT('解除する締データは存在しません [', IF(pDealingMkvId = 1010001, '売', '買'), '][締対象日：', pCompleteDay, ']') ;
        END IF ;

    ELSE
        -- 締処理の事前検査
        IF pDealingMkvId = 1010001 THEN
            -- 締対象データの件数を取得(売)
            SELECT COUNT(*) INTO cnt                                                      
              FROM (/* 締対象の取引先件数を集計 */                                        
                    SELECT m_customer_id                                                  
                      FROM (/* 売上 */                                                    
                            SELECT m.id        AS m_customer_id  /* 取引先id */           
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
                            SELECT m.id               AS m_customer_id /* 取引先id */     
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
                            SELECT c.m_customer_id AS m_customer_id /* 取引先id */        
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
                                ON c.id = q.id                                            
                             WHERE c.grand_total != 0                                     
                           ) AS t1                                                        
                     GROUP BY m_customer_id                                               
                   ) AS t2 ;                                                              
        ELSE
            -- 締対象データの件数を取得(買)
            SELECT COUNT(*)INTO cnt                                                       
              FROM (/* 締対象の取引先件数を集計 */                                        
                    SELECT m_customer_id                                                  
                      FROM (/* 仕入 */                                                    
                            SELECT m.id         AS m_customer_id  /* 取引先id */          
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
                            SELECT m.id               AS m_customer_id /* 取引先id */     
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
                            SELECT c.m_customer_id AS m_customer_id /* 取引先id */        
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
                                ON c.id = q.id                                            
                             WHERE c.grand_total != 0                                     
                           ) AS t1                                                        
                     GROUP BY m_customer_id                                               
                   ) AS t2 ;                                                              
        END IF ;

        IF cnt = 0 THEN
            -- 締対象のデータがない場合はNG
            SET pMessage = CONCAT('締対象のデータは存在しませんでした [', IF(pDealingMkvId = 1010001, '売', '買'), '][締対象日：', pCompleteDay, ']') ;
        END IF ;

    END IF ;

    IF pMessage IS NOT NULL THEN
        -- Laravel(+PDO)でout引数を受け取れないのが判ったのでSELECT結果として返す
        SELECT pResult AS result, pMessage AS message ;
    ELSE
        SET pMessage = CONCAT(IF(pIsComplete, '締確認', '締解除の確認'), 'を行いました [', IF(pDealingMkvId = 1010001, '売', '買'), '][締対象日：', pCompleteDay, '][件数：', cnt, ']') ;
        SET pResult  = 1 ; -- [Success]

        IF pIsResultMessage THEN
            -- Laravel(+PDO)でout引数を受け取れないのが判ったのでSELECT結果として返す
            SELECT pResult AS result, pMessage AS message ;
        END IF ;
    END IF ;
END$$

DELIMITER ;
