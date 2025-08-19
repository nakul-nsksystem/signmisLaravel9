-- ビュー：売上明細表
CREATE OR REPLACE VIEW v_detail_sales AS

SELECT br.id                          AS m_branch_id       ,/*拠点id*/
       br.cd                          AS m_branch_cd       ,/*拠点CD*/
       IFNULL(br.short_name, br.name) AS m_branch_name     ,/*拠点名*/
       s.accounting_date              AS accounting_date   ,/*売上日*/
       sale_ds.t_sale_id              AS t_sale_id         ,/*伝票No*/
       sale_ds.id                     AS t_sale_detail_id  ,/*明細No*/
       cu.id                          AS m_customer_id     ,/*取引先id*/
       cu.cd                          AS m_customer_cd     ,/*取引先CD*/
       IFNULL(cu.short_name, cu.name) AS m_customer_name   ,/*取引先名*/
       sale_ds.product_name           AS product_name      ,/*品名*/
       sale_ds.qty                    AS qty               ,/*数量*/
       k.kv_name                      AS unit_m_kv_name    ,/*単位*/
       sale_ds.price                  AS price             ,/*単価*/
       sale_ds.total_price            AS total_price       ,/*金額*/
       pr.cd                          AS t_project_cd      ,/*物件CD*/
       u.id                           AS m_user_id         ,/*自社担当者id*/
       u.full_name                    AS m_user_name       ,/*自社担当者*/
       sale_ds.customer_order_no      AS customer_order_no ,/*客先注文No*/
       s.contact                      AS contact           ,/*客先担当者*/
       s.slip_memo                    AS sale_memo         ,/*摘要*/
       sale_ds.slip_memo              AS slip_memo          /*備考*/

  FROM t_sale_details AS sale_ds
INNER JOIN t_sales     AS s  ON sale_ds.t_sale_id    = s.id  /*売上伝票*/
INNER JOIN m_branches  AS br ON s.m_branch_id        = br.id /*拠点*/
INNER JOIN m_customers AS cu ON s.m_customer_id      = cu.id /*取引先*/
INNER JOIN m_users     AS u  ON s.m_user_id          = u.id  /*自社担当*/
INNER JOIN m_kvs       AS k  ON sale_ds.unit_m_kv_id = k.id  /*単位区分*/
 LEFT JOIN t_projects  AS pr ON sale_ds.t_project_id = pr.id /*物件*/

WHERE sale_ds.ship_m_kv_id != 1200005 /*記入用区分を除く*/
AND sale_ds.deleted_at IS NULL 
ORDER BY br.cd , cu.cd , s.accounting_date ,s.id ,sale_ds.order_no
;
