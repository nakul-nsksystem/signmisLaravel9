-- 仕入明細

-- 仕入区分追加
ALTER TABLE t_p_invoice_details 
ADD COLUMN purchase_m_kv_id INT NULL COMMENT '仕入区分' AFTER accounts_title_m_kv_id,
ADD INDEX fk_t_p_invoice_details_purchase_m_kv_id (purchase_m_kv_id ASC) VISIBLE;
;

UPDATE t_p_invoice_details SET purchase_m_kv_id = 1205001 ;

ALTER TABLE t_p_invoice_details 
CHANGE COLUMN purchase_m_kv_id purchase_m_kv_id INT NOT NULL COMMENT '仕入区分' ;

ALTER TABLE t_p_invoice_details 
ADD CONSTRAINT fk_t_p_invoice_details_purchase_m_kv_id
  FOREIGN KEY (purchase_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
