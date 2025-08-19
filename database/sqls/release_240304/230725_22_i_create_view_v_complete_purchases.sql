-- ビュー：仕入締一覧表
CREATE OR REPLACE VIEW v_complete_purchases AS

WITH
/* 支払対象の請求idを集計 */
q_payment_summary AS (
    SELECT target_t_complete_id AS target_t_complete_id , /* 対象請求id */ 
           SUM(payment_price)   AS payment_price          /* 支払合計   */ 
      FROM t_complete_details
     WHERE deleted_at IS NULL
       AND dealing_m_kv_id       = 1010002 /* 買 */
       AND target_t_complete_id IS NOT NULL
     GROUP BY target_t_complete_id
)

SELECT br.id                                              AS m_branch_id             , /* 拠点id     */
       br.cd                                              AS m_branch_cd             , /* 拠点cd     */
       IFNULL(br.short_name, br.name)                     AS m_branch_name           , /* 拠点名     */
       kv.id                                              AS accounts_title_m_kv_id  , /* 勘定科目id */
       kv.g_01                                            AS accounts_title_cd       , /* 勘定科目cd */
       kv.kv_name                                         AS accounts_title_name     , /* 勘定科目名 */
       cu.id                                              AS m_customer_id           , /* 仕入先id   */
       cu.cd                                              AS m_customer_cd           , /* 仕入先cd   */
       IFNULL(cu.short_name, cu.name)                     AS m_customer_name         , /* 仕入先名   */
       cu.closing_date                                    AS m_customer_closing_date , /* 仕入先締日 */
       cu.data_linkage_cd                                 AS data_linkage_cd         , /* 連携CD     */
       c.id                                               AS t_complete_id           , /* 仕入締id   */
       c.complete_day                                     AS complete_day            , /* 仕入締日   */
       c.carry_over                                       AS carry_over              , /* 前回仕入締 */
       c.payment_price                                    AS payment_price           , /* 支払額     */
       c.carry_over - c.payment_price                     AS balance                 , /* 繰越       */
       c.total_price                                      AS total_price             , /* 仕入額     */
       c.tax                                              AS tax                     , /* 消費税     */
       c.total_price + c.tax                              AS sub_total               , /* 仕入合計   */
       c.grand_total                                      AS grand_total             , /* 今回仕入締 */
       c.total_price + c.tax - IFNULL(p.payment_price, 0) AS uncollected             , /* 未払残     */
       DUE_DATE(c.complete_day, cu.payment_date)          AS due_date                , /* 入金予定日 */
       cu.sales_management_memo                           AS sales_management_memo     /* 備考       */

  FROM t_completes            AS c  /* 仕入締   */
  LEFT JOIN q_payment_summary AS p  /* 支払集計 */ ON c.id                      = p.target_t_complete_id
 INNER JOIN m_branches        AS br /* 拠点     */ ON c.m_branch_id             = br.id
 INNER JOIN m_customers       AS cu /* 取引先   */ ON c.m_customer_id           = cu.id
 INNER JOIN m_kvs             AS kv /* 勘定科目 */ ON cu.accounts_title_m_kv_id = kv.id

 WHERE c.dealing_m_kv_id = 1010002 /* 買 */

 ORDER BY m_branch_cd, m_customer_cd, complete_day
;
