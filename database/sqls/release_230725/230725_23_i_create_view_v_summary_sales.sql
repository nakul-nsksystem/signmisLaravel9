-- ビュー：売上集計表
CREATE OR REPLACE VIEW v_summary_sales AS

WITH
/* 入金対象の請求idを集計 */
q_complete_details AS (
    SELECT target_t_complete_id                                                    AS target_t_complete_id , /* 対象請求id */
           SUM(CASE WHEN payment_m_kv_id <> 1150008 THEN payment_price ELSE 0 END) AS payment_price        , /* 入金額     */
           SUM(CASE WHEN payment_m_kv_id  = 1150008 THEN payment_price ELSE 0 END) AS commission             /* 手数料     */
      FROM t_complete_details
     WHERE dealing_m_kv_id  = 1010001 /* 対象：売 */
       AND deleted_at      IS NULL
     GROUP BY target_t_complete_id
)

/* 本体 */
SELECT br.id                                        AS m_branch_id     , /* 拠点id     */ 
       br.cd                                        AS m_branch_cd     , /* 拠点cd     */ 
       IFNULL(br.short_name, br.name)               AS m_branch_name   , /* 拠点名     */ 
       us.id                                        AS m_user_id       , /* 担当者id   */ 
       us.cd                                        AS m_user_cd       , /* 担当者cd   */ 
       us.full_name                                 AS m_user_name     , /* 担当者名   */ 
       cu.id                                        AS m_customer_id   , /* 取引先id   */ 
       cu.cd                                        AS m_customer_cd   , /* 取引先cd   */ 
       IFNULL(cu.short_name, cu.name)               AS m_customer_name , /* 取引先名   */ 
       DATE_FORMAT(c.complete_day, '%Y-%m')         AS grouping_column , /* 対象月     */ /* 対象月をグルーピング */
       MAX(c.complete_day       )                   AS complete_day    , /* 請求日     */ 
       DUE_DATE(MAX(complete_day), cu.payment_date) AS due_date        , /* 入金予定日 */ 
       SUM(c.total_price        )                   AS total_price     , /* 売上額     */ 
       SUM(c.total_price + c.tax)                   AS sub_total       , /* 売上合計   */ 
       SUM(p.payment_price      )                   AS payment_price   , /* 入金額     */ 
       SUM(p.commission         )                   AS commission      , /* 手数料     */ 
       NULL                                         AS blank             /* 備考       */ 

  FROM t_completes             AS c  /* 請求締 */ 
  LEFT JOIN q_complete_details AS p  /* 入金   */ ON c.id               = p.target_t_complete_id
 INNER JOIN m_branches         AS br /* 拠点   */ ON c.m_branch_id      = br.id 
 INNER JOIN m_customers        AS cu /* 取引先 */ ON c.m_customer_id    = cu.id 
 INNER JOIN m_users            AS us /* 担当者 */ ON cu.sales_m_user_id = us.id 

 WHERE c.dealing_m_kv_id  = 1010001 /* 売                       */
   AND c.total_price     <> 0       /* 指定月の売上がある取引先 */

 GROUP BY m_branch_id   , m_branch_cd   , m_branch_name   ,
          m_user_id     , m_user_cd     , m_user_name     ,
          m_customer_id , m_customer_cd , m_customer_name , cu.payment_date ,
          grouping_column

 ORDER BY m_branch_cd, m_user_cd, m_customer_cd
;
