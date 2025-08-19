-- ビュー：請求一覧表
CREATE OR REPLACE VIEW v_detail_purchases AS

SELECT br.id                                    AS m_branch_id           ,/*拠点id*/
       br.cd                                    AS m_branch_cd           ,/*拠点cd*/
       IFNULL(br.short_name, br.name)           AS m_branch_name         ,/*拠点名*/
       i.purchase_date                          AS purchase_date         ,/*仕入日*/
       invoice_ds.t_p_invoice_id                AS t_p_invoice_id        ,/*仕入伝票No*/
       invoice_ds.id                            AS t_p_invoice_detail_id ,/*仕入明細No*/
       cu.id                                    AS m_customer_id         ,/*取引先id*/
       cu.cd                                    AS m_customer_cd         ,/*取引先cd*/
       IFNULL(cu.short_name, cu.name)           AS m_customer_name       ,/*取引先名*/
       invoice_ds.material_name                 AS material_name         ,/*材料名*/
       zero2emp(invoice_ds.material_size_x)     AS material_size_x       ,/*材料幅*/
       zero2emp(invoice_ds.material_size_y)     AS material_size_y       ,/*材料流れ*/
       zero2emp(invoice_ds.capacity)            AS capacity              ,/*容量*/
       zero2emp(md.contents_qty)                AS contents_qty          ,/*入数*/
       invoice_ds.qty                           AS qty                   ,/*数量*/
       k.kv_name                                AS unit_m_kv_name        ,/*単位*/
       invoice_ds.price                         AS price                 ,/*単価*/
       invoice_ds.total_price                   AS total_price           ,/*金額*/
       u.full_name                              AS m_user_name           ,/*仕入担当者*/
       i.slip_memo                              AS invoice_memo          ,/*摘要*/
       invoice_ds.slip_memo                     AS slip_memo              /*備考*/

  FROM t_p_invoice_details AS invoice_ds
INNER JOIN t_p_invoices      AS i  ON invoice_ds.t_p_invoice_id       = i.id /*仕入伝票*/
INNER JOIN m_branches        AS br ON i.m_branch_id                   = br.id/*拠点*/
INNER JOIN m_customers       AS cu ON i.supplier_m_customer_id        = cu.id/*取引先*/
INNER JOIN m_users           AS u  ON i.m_user_id                     = u.id /*担当者*/
INNER JOIN m_kvs             AS k  ON invoice_ds.unit_m_kv_id         = k.id /*区分*/
LEFT JOIN m_material_details AS md ON invoice_ds.m_material_detail_id = md.id/*材料明細*/

WHERE invoice_ds.purchase_m_kv_id != 1205005 /*記入用区分を除く*/
ORDER BY br.cd , cu.cd , i.purchase_date ,i.id ,invoice_ds.order_no
;
