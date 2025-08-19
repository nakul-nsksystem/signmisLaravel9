-- 仕入明細
ALTER TABLE t_p_invoice_details 
ADD COLUMN tax_m_kv_id INT NULL COMMENT '税区分' AFTER tax,
ADD COLUMN tax_rate DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '税率' AFTER tax_m_kv_id,
ADD INDEX fk_t_p_invoice_details_tax_m_kv_id (tax_m_kv_id ASC) ;

UPDATE t_p_invoice_details SET tax_m_kv_id = 1170001 WHERE ID >= 0 ;
ALTER TABLE t_p_invoice_details 
CHANGE COLUMN tax_m_kv_id tax_m_kv_id INT NOT NULL COMMENT '税区分' ;

ALTER TABLE t_p_invoice_details 
ADD CONSTRAINT fk_t_p_invoice_details_tax_m_kv_id
  FOREIGN KEY (tax_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

