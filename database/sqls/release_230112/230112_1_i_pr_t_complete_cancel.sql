DROP procedure IF EXISTS pr_t_complete_cancel ;
DELIMITER $$

CREATE PROCEDURE pr_t_complete_cancel(
    OUT pResult             INT             , -- 結果[1:成功 0:失敗]
    OUT pMessage            VARCHAR(1024)   , -- メッセージ
        pMUserId            INT             , -- 担当者id
        pMBranchId          INT             , -- 拠点id
        pDealingMkvId       INT             , -- 取引区分[1010001:売 1010002:買]
        pCompleteDay        DATE            , -- 締処理日[2000/01/01...]
        pClosingDate        INT             , -- 締日[0, 5, 10 , 15, 20, 25, 31, 99...]
        pCustomerId         INT               -- 取引先id [省略可能 省略時はNULL]
)
    MODIFIES SQL DATA
    COMMENT '締解除処理'
MainRoutine:
BEGIN
    DECLARE cnt INT DEFAULT 0 ; -- 処理結果件数

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
    CALL pr_t_complete_check(pResult, pMessage, pMUserId, pMBranchId, pDealingMkvId, pCompleteDay, pClosingDate, pCustomerId, FALSE, FALSE) ;

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

    -- ② 締処理で作成した消費税データの削除
    IF pDealingMkvId = 1010001 THEN
        -- 売
        DELETE s                                                     
          FROM t_sales AS s                                          
          JOIN (/* 締処理・取引先 */                                 
                SELECT c.id AS t_complete_id                         
                  FROM t_completes AS c                              
                  JOIN m_customers AS m                              
                    ON c.m_customer_id   = m.id                      
                 WHERE c.complete_day    = pCompleteDay              
                   AND c.dealing_m_kv_id = pDealingMkvId             
                   AND c.m_branch_id     = pMBranchId                
                   AND c.deleted_at     IS NULL                      
                       /* 取引先の条件 */                            
                   AND m.id              = IFNULL(pCustomerId, m.id) 
                   AND m.closing_date    = pClosingDate              
                   AND m.dealing_m_kv_id = pDealingMkvId             
                   AND m.deleted_at     IS NULL                      
               ) AS q                                                
            ON s.t_complete_id = q.t_complete_id                     
         WHERE s.slip_m_kv_id = 1160003 ;                            
    ELSE
        -- 買
        DELETE s                                                     
          FROM t_p_invoices AS s                                     
          JOIN (/* 締処理・取引先 */                                 
                SELECT c.id AS t_complete_id                         
                  FROM t_completes AS c                              
                  JOIN m_customers AS m                              
                    ON c.m_customer_id   = m.id                      
                 WHERE c.complete_day    = pCompleteDay              
                   AND c.dealing_m_kv_id = pDealingMkvId             
                   AND c.m_branch_id     = pMBranchId                
                   AND c.deleted_at     IS NULL                      
                       /* 取引先の条件 */                            
                   AND m.id              = IFNULL(pCustomerId, m.id) 
                   AND m.closing_date    = pClosingDate              
                   AND m.dealing_m_kv_id = pDealingMkvId             
                   AND m.deleted_at     IS NULL                      
               ) AS q                                                
            ON s.t_complete_id = q.t_complete_id                     
         WHERE s.slip_m_kv_id = 1160003 ;                            
    END IF ;

    -- ③ 請求Idの初期化(売上・仕入)
    IF pDealingMkvId = 1010001 THEN
        -- 売
        UPDATE t_sales AS s                                          
          JOIN (/* 締処理・取引先 */                                 
                SELECT c.id AS t_complete_id                         
                  FROM t_completes AS c                              
                  JOIN m_customers AS m                              
                    ON c.m_customer_id   = m.id                      
                 WHERE c.complete_day    = pCompleteDay              
                   AND c.dealing_m_kv_id = pDealingMkvId             
                   AND c.m_branch_id     = pMBranchId                
                   AND c.deleted_at     IS NULL                      
                       /* 取引先の条件 */                            
                   AND m.id              = IFNULL(pCustomerId, m.id) 
                   AND m.closing_date    = pClosingDate              
                   AND m.dealing_m_kv_id = pDealingMkvId             
                   AND m.deleted_at     IS NULL                      
               ) AS q                                                
            ON s.t_complete_id = q.t_complete_id                     
           SET s.t_complete_id = 0 ;                                 
    ELSE
        -- 買
        UPDATE t_p_invoices AS s                                     
          JOIN (/* 締処理・取引先 */                                 
                SELECT c.id AS t_complete_id                         
                  FROM t_completes AS c                              
                  JOIN m_customers AS m                              
                    ON c.m_customer_id   = m.id                      
                 WHERE c.complete_day    = pCompleteDay              
                   AND c.dealing_m_kv_id = pDealingMkvId             
                   AND c.m_branch_id     = pMBranchId                
                   AND c.deleted_at     IS NULL                      
                       /* 取引先の条件 */                            
                   AND m.id              = IFNULL(pCustomerId, m.id) 
                   AND m.closing_date    = pClosingDate              
                   AND m.dealing_m_kv_id = pDealingMkvId             
                   AND m.deleted_at     IS NULL                      
               ) AS q                                                
            ON s.t_complete_id = q.t_complete_id                     
           SET s.t_complete_id = 0 ;                                 
    END IF ;

    -- ④ 請求Idの初期化(入金・支払)
    -- 売・買
    UPDATE t_complete_details AS d                               
      JOIN (/* 締処理・取引先 */                                 
            SELECT c.id AS t_complete_id                         
              FROM t_completes AS c                              
              JOIN m_customers AS m                              
                ON c.m_customer_id   = m.id                      
             WHERE c.complete_day    = pCompleteDay              
               AND c.dealing_m_kv_id = pDealingMkvId             
               AND c.m_branch_id     = pMBranchId                
               AND c.deleted_at     IS NULL                      
                   /* 取引先の条件 */                            
               AND m.id              = IFNULL(pCustomerId, m.id) 
               AND m.closing_date    = pClosingDate              
               AND m.dealing_m_kv_id = pDealingMkvId             
               AND m.deleted_at     IS NULL                      
           ) AS q                                                
        ON d.t_complete_id = q.t_complete_id                     
       SET d.t_complete_id = 0 ;                                 

    -- ⑤ 請求データの削除
    -- 売・買
    DELETE c                                             
      FROM t_completes AS c                              
      JOIN m_customers AS m                              
        ON c.m_customer_id   = m.id                      
     WHERE c.complete_day    = pCompleteDay              
       AND c.dealing_m_kv_id = pDealingMkvId             
       AND c.m_branch_id     = pMBranchId                
       AND c.deleted_at     IS NULL                      
           /* 取引先の条件 */                            
       AND m.id              = IFNULL(pCustomerId, m.id) 
       AND m.closing_date    = pClosingDate              
       AND m.dealing_m_kv_id = pDealingMkvId             
       AND m.deleted_at     IS NULL ;                    

    -- 処理された件数を表示
    SELECT ROW_COUNT() INTO cnt ;

    -- ⑥ Transaction終了
    COMMIT ;

    SET pMessage = CONCAT('締解除が行われました [', IF(pDealingMkvId = 1010001, '売', '買'), '][締対象日：', pCompleteDay, '][件数：', cnt, ']') ;
    SET pResult  = 1 ; -- [Success]

    -- Laravel(+PDO)でout引数を受け取れないのが判ったのでSELECT結果として返す
    SELECT pResult AS result, pMessage AS message ;

END$$

DELIMITER ;
