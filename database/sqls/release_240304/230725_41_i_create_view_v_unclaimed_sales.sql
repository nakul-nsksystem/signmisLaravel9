-- ビュー：未請求一覧表
CREATE OR REPLACE VIEW v_unclaimed_sales AS

WITH
/* 最終請求 */
q_last_complets AS (
    SELECT MAX(id) AS id /* 請求id */
      FROM t_completes AS c
     WHERE dealing_m_kv_id = 1010001 /* 売           */
       AND id              > 0       /* 通常請求のみ */
     GROUP BY m_branch_id, m_customer_id
) ,

/* 最終請求額が0以外の請求 */
q_complets AS (
    SELECT c.m_branch_id   AS m_branch_id   , /* 拠点id   */
           c.m_customer_id AS m_customer_id , /* 取引先id */
           c.complete_day  AS target_date   , /* 対象日   */
           c.complete_day  AS complete_day  , /* 請求日   */
           c.grand_total   AS grand_total     /* 請求額   */
      FROM t_completes          AS c
     INNER JOIN q_last_complets AS q ON c.id = q.id
     WHERE c.grand_total <> 0 /* 請求金額0以外 */
) ,

/* 結合用 */
q_body AS (
    /* 売上 */
    SELECT id                     AS slip_id         , /* 売上id   */
           m_branch_id            AS m_branch_id     , /* 拠点id   */
           m_customer_id          AS m_customer_id   , /* 取引先id */
           accounting_date        AS target_date     , /* 対象日   */
           accounting_date        AS accounting_date , /* 売上日   */
           total_price            AS total_price     , /* 売上額   */
           NULL                   AS payment_day     , /* 入金日   */
           NULL                   AS payment_price   , /* 入金額   */
           NULL                   AS complete_day    , /* 請求日   */
           NULL                   AS grand_total       /* 請求額   */
      FROM t_sales
     WHERE deleted_at    IS NULL /* 論理削除 */
       AND t_complete_id  = 0    /* 未請求   */

    /* 入金 */
     UNION ALL
    SELECT NULL                   AS slip_id         , /* 売上id   */
           m_branch_id            AS m_branch_id     , /* 拠点id   */
           m_customer_id          AS m_customer_id   , /* 取引先id */
           payment_day            AS target_date     , /* 対象日   */
           NULL                   AS accounting_date , /* 売上日   */
           NULL                   AS total_price     , /* 売上額   */
           payment_day            AS payment_day     , /* 入金日   */
           payment_price          AS payment_price   , /* 入金額   */
           NULL                   AS complete_day    , /* 請求日   */
           NULL                   AS grand_total       /* 請求額   */
      FROM t_complete_details
     WHERE deleted_at      IS NULL    /* 論理削除 */
       AND dealing_m_kv_id  = 1010001 /* 売       */
       AND t_complete_id    = 0       /* 未請求   */

    /* 請求 */
     UNION ALL
    SELECT NULL                                   AS slip_id         , /* 売上id   */
           m_branch_id                            AS m_branch_id     , /* 拠点id   */
           m_customer_id                          AS m_customer_id   , /* 取引先id */
           DATE_ADD(complete_day, INTERVAL 1 DAY) AS target_date     , /* 対象日   */ /* 請求日の翌日にして次回対象に変換 */
           NULL                                   AS accounting_date , /* 売上日   */
           NULL                                   AS total_price     , /* 売上額   */
           NULL                                   AS payment_day     , /* 入金日   */
           NULL                                   AS payment_price   , /* 入金額   */
           complete_day                           AS complete_day    , /* 請求日   */
           grand_total                            AS grand_total       /* 請求額   */
      FROM q_complets
)

/* 本体 */
SELECT br.id                                         AS m_branch_id             , /* 拠点id     */
       br.cd                                         AS m_branch_cd             , /* 拠点cd     */
       IFNULL(br.short_name, br.name)                AS m_branch_name           , /* 拠点名     */
       cu.id                                         AS m_customer_id           , /* 取引先id   */
       cu.cd                                         AS m_customer_cd           , /* 取引先cd   */
       IFNULL(cu.short_name, cu.name)                AS m_customer_name         , /* 取引先名   */
       cu.closing_date                               AS m_customer_closing_date , /* 取引先締日 */
       us.full_name                                  AS m_user_name             , /* 担当者名   */
       NEXT_DUE_DATE(q.target_date, cu.closing_date) AS period                  , /* 対象請求日 */
       COUNT(q.slip_id)                              AS slip_cnt                , /* 売上伝票数 */
       MAX(q.accounting_date)                        AS accounting_date         , /* 最終売上日 */
       SUM(q.total_price    )                        AS total_price             , /* 売上額     */
       MAX(q.payment_day    )                        AS payment_day             , /* 最終入金日 */
       SUM(q.payment_price  )                        AS payment_price           , /* 入金額     */
       MAX(q.complete_day    )                       AS complete_day            , /* 最終請求日 */
       SUM(q.grand_total  )                          AS grand_total               /* 請求額     */

  FROM q_body           AS q
 INNER JOIN m_branches  AS br /* 拠点   */ ON q.m_branch_id      = br.id 
 INNER JOIN m_customers AS cu /* 取引先 */ ON q.m_customer_id    = cu.id 
 INNER JOIN m_users     AS us /* 担当者 */ ON cu.sales_m_user_id = us.id 

 GROUP BY m_branch_id   , m_branch_cd   , m_branch_name   ,
          cu.id         , m_customer_cd , m_customer_name , m_customer_closing_date ,
          m_user_name   , period

 ORDER BY m_branch_cd, m_customer_closing_date, m_customer_cd, period
;
