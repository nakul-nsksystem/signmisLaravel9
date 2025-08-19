-- 売上
ALTER TABLE t_sales COMMENT = '売上' ;

ALTER TABLE t_sales 
DROP COLUMN tax_rate_reduced,
DROP COLUMN tax_rate_nomal,
DROP COLUMN price_total_include,
DROP COLUMN price_total_reduced,
DROP COLUMN price_total_nomal,
CHANGE COLUMN m_branch_id m_branch_id INT NOT NULL COMMENT '拠点id' AFTER id,
CHANGE COLUMN m_customer_id m_customer_id INT NOT NULL COMMENT '取引先id' AFTER m_branch_id,
CHANGE COLUMN accounting_m_customer_id accounting_m_customer_id INT NOT NULL COMMENT '請求先id' AFTER m_customer_id,
CHANGE COLUMN delivery_destination_m_customer_id delivery_destination_m_customer_id INT NULL DEFAULT NULL COMMENT '納品先id' AFTER accounting_m_customer_id,
CHANGE COLUMN shipper_m_customer_id shipper_m_customer_id INT NULL DEFAULT NULL COMMENT '荷主元id' AFTER delivery_destination_m_customer_id,
CHANGE COLUMN m_user_id m_user_id INT NOT NULL COMMENT '担当者id' AFTER shipper_m_customer_id,
CHANGE COLUMN delivery_note_serial_no delivery_note_serial_no INT NULL DEFAULT NULL COMMENT '納品書連番' ,
CHANGE COLUMN accounted_day accounting_date  DATETIME NOT NULL COMMENT '計上日' ,
CHANGE COLUMN shipped_at shipped_at DATETIME NOT NULL COMMENT '出荷日' 
;

ALTER TABLE t_sale_details 
DROP FOREIGN KEY fk_t_sale_details_reduced_tax_rate_m_kv_id,
DROP FOREIGN KEY fk_t_sale_details_price_calc_m_kv_id,
DROP FOREIGN KEY fk_t_sale_details_fsc_m_kv_id,
DROP FOREIGN KEY fk_t_sale_details_deposit_ship_m_kv_id
;

ALTER TABLE t_sale_details 
DROP COLUMN deposit_ship_m_kv_id,
DROP COLUMN fsc_m_kv_id,
DROP COLUMN reduced_tax_rate_m_kv_id,
DROP COLUMN tax_rate_reduced,
DROP COLUMN tax_rate_nomal,
DROP COLUMN price_total_include,
DROP COLUMN price_total_reduced_tax,
DROP COLUMN price_total_nomal,
DROP COLUMN price_calc_m_kv_id,
DROP COLUMN order_no,
CHANGE COLUMN tax tax DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '消費税' AFTER price_total,
CHANGE COLUMN tax_m_kv_id tax_m_kv_id INT NOT NULL COMMENT '税区分' AFTER tax,
CHANGE COLUMN t_product_id t_product_id INT NULL DEFAULT NULL COMMENT '物件id' AFTER product_height,
CHANGE COLUMN shipped_qty shipped_qty DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '出荷数' ,
DROP INDEX fk_t_sale_details_reduced_tax_rate_m_kv_id ,
DROP INDEX fk_t_sale_details_price_calc_m_kv_id ,
DROP INDEX fk_t_sale_details_fsc_m_kv_id ,
DROP INDEX fk_t_sale_details_deposit_ship_m_kv_id
;

ALTER TABLE t_sale_details 
CHANGE COLUMN t_product_id t_project_id INT NULL DEFAULT NULL COMMENT '物件id' ,
ADD INDEX fk_t_sale_details_t_project_id (t_project_id ASC) ;
;

ALTER TABLE t_sale_details 
ADD CONSTRAINT fk_t_sale_details_t_project_id
  FOREIGN KEY (t_project_id)
  REFERENCES t_projects (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT
;

ALTER TABLE t_sale_details 
CHANGE COLUMN m_product_id m_product_id INT NULL DEFAULT NULL COMMENT '製品id',
CHANGE COLUMN product_width product_size_x DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '製品サイズX' ,
CHANGE COLUMN product_height product_size_y DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '製品サイズY' 
;

ALTER TABLE t_sale_details 
ADD COLUMN unit_m_kv_id INT NOT NULL COMMENT '単位' AFTER shipped_qty,
ADD INDEX fk_t_sale_details_unit_m_kv_id (unit_m_kv_id ASC) ;
;

ALTER TABLE t_sale_details 
ADD CONSTRAINT fk_t_sale_details_unit_m_kv_id
  FOREIGN KEY (unit_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

