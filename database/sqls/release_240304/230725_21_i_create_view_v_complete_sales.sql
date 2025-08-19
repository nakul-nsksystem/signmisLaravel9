-- ビュー：請求一覧表
CREATE OR REPLACE VIEW v_complete_sales AS

WITH
/* 入金対象の請求idを集計 */
q_payment_summary AS (
    SELECT target_t_complete_id AS target_t_complete_id , /* 対象請求id */ 
           SUM(payment_price)   AS payment_price          /* 入金合計   */ 
      FROM t_complete_details
     WHERE deleted_at IS NULL
       AND dealing_m_kv_id       = 1010001 /* 売 */
       AND target_t_complete_id IS NOT NULL
     GROUP BY target_t_complete_id
)

SELECT br.id                                              AS m_branch_id             , /* 拠点id     */
       br.cd                                              AS m_branch_cd             , /* 拠点cd     */
       IFNULL(br.short_name, br.name)                     AS m_branch_name           , /* 拠点名     */
       cu.id                                              AS m_customer_id           , /* 取引先id   */
       cu.cd                                              AS m_customer_cd           , /* 取引先cd   */
       IFNULL(cu.short_name, cu.name)                     AS m_customer_name         , /* 取引先名   */
       cu.closing_date                                    AS m_customer_closing_date , /* 取引先締日 */
       cu.data_linkage_cd                                 AS data_linkage_cd         , /* 連携CD     */
       c.id                                               AS t_complete_id           , /* 請求id     */
       c.complete_day                                     AS complete_day            , /* 請求日     */
       c.carry_over                                       AS carry_over              , /* 前回請求   */
       c.payment_price                                    AS payment_price           , /* 入金額     */
       c.carry_over - c.payment_price                     AS balance                 , /* 繰越       */
       c.total_price                                      AS total_price             , /* 売上額     */
       c.tax                                              AS tax                     , /* 消費税     */
       c.total_price + c.tax                              AS sub_total               , /* 売上合計   */
       c.grand_total                                      AS grand_total             , /* 今回請求   */
       c.total_price + c.tax - IFNULL(p.payment_price, 0) AS uncollected             , /* 未収残     */
       DUE_DATE(c.complete_day, cu.payment_date)          AS due_date                , /* 入金予定日 */
       cu.sales_management_memo                           AS sales_management_memo     /* 備考       */

  FROM t_completes            AS c  /* 請求締   */
  LEFT JOIN q_payment_summary AS p  /* 入金集計 */ ON c.id            = p.target_t_complete_id
 INNER JOIN m_branches        AS br /* 拠点     */ ON c.m_branch_id   = br.id
 INNER JOIN m_customers       AS cu /* 取引先   */ ON c.m_customer_id = cu.id

 WHERE c.dealing_m_kv_id = 1010001 /* 売 */

 ORDER BY m_branch_cd, m_customer_cd, complete_day
;
