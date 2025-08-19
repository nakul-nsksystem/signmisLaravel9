-- ビュー：入金明細表
CREATE OR REPLACE VIEW v_payment_sales AS

SELECT br.id                                                AS m_branch_id             , /* 拠点id       */
       br.cd                                                AS m_branch_cd             , /* 拠点cd       */
       IFNULL(br.short_name, br.name)                       AS m_branch_name           , /* 拠点名       */
       p.payment_day                                        AS payment_day             , /* 入金日       */
       cu.id                                                AS m_customer_id           , /* 取引先id     */
       cu.cd                                                AS m_customer_cd           , /* 取引先cd     */
       IFNULL(cu.short_name, cu.name)                       AS m_customer_name         , /* 取引先名     */
       MOD(cu.payment_date, 100)                            AS m_customer_payment_date , /* 取引先支払日 */
       p.id                                                 AS t_complete_details_id   , /* 入金id       */
       p.payment_price                                      AS payment_price           , /* 入金額       */
       /* 入金日で集計 */
       SUM(p.payment_price) 
       OVER (PARTITION BY p.t_complete_id, p.m_customer_id 
             ORDER BY p.payment_day, p.m_customer_id, p.id) AS payment_total           , /* 入金合計     */
       p.payment_m_kv_id                                    AS payment_m_kv_id         , /* 入金区分id   */
       k1.kv_name                                           AS payment_name            , /* 入金区分名   */
       c.complete_day                                       AS complete_day            , /* 対象請求日   */
       DUE_DATE(c.complete_day, cu.payment_date)            AS due_date                , /* 入金予定日   */
       c.total_price + c.tax                                AS sub_total               , /* 売上合計     */
       p.memo                                               AS payment_memo            , /* 入金備考     */
       cu.sales_management_memo                             AS sales_management_memo     /* 販売管理備考 */

  FROM t_complete_details AS p  /* 請求締明細 */
  LEFT JOIN t_completes   AS c  /* 請求締     */ ON p.target_t_complete_id = c.id
 INNER JOIN m_branches    AS br /* 拠点       */ ON p.m_branch_id          = br.id
 INNER JOIN m_customers   AS cu /* 取引先     */ ON p.m_customer_id        = cu.id
 INNER JOIN m_kvs         AS k1 /* 入金区分   */ ON p.payment_m_kv_id      = k1.id

 WHERE p.dealing_m_kv_id  = 1010001 /* 売       */
   AND p.deleted_at      IS NULL    /* 論理削除 */

 ORDER BY m_branch_cd, payment_day, m_customer_cd, t_complete_details_id
;
