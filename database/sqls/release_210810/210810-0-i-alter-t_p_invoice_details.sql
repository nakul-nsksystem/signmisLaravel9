-- 仕入明細 発注明細id追加

ALTER TABLE t_p_invoice_details 
ADD COLUMN t_p_order_detail_id INT NULL COMMENT '発注明細id' AFTER t_p_invoice_id,
ADD INDEX fk_t_p_invoice_details_t_p_order_detail_id (t_p_order_detail_id ASC) ;


ALTER TABLE t_p_invoice_details 
ADD CONSTRAINT fk_t_p_invoice_details_t_p_order_detail_id
  FOREIGN KEY (t_p_order_detail_id)
  REFERENCES t_p_order_details (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT
;
