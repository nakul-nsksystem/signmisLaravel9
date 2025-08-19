-- 仕入
ALTER TABLE t_p_invoices 
ADD COLUMN t_complete_id INT NULL COMMENT '売上・仕入締id' AFTER m_user_id,
ADD COLUMN accounting_date DATETIME NULL COMMENT '計上日' AFTER t_complete_id,
ADD COLUMN total_price_nomal DECIMAL(15,4) NULL COMMENT '仕入金額(通常税率)' AFTER total_price,
ADD COLUMN total_price_reduced_tax DECIMAL(15,4) NULL COMMENT '仕入金額(軽減税率)' AFTER total_price_nomal,
ADD COLUMN total_price_include DECIMAL(15,4) NULL COMMENT '仕入金額(非課税)' AFTER total_price_reduced_tax,
ADD COLUMN tax_nomal DECIMAL(15,4) NULL COMMENT '消費税(通常税率)' AFTER tax,
ADD COLUMN tax_reduced DECIMAL(15,4) NULL COMMENT '消費税(軽減税率)' AFTER tax_nomal,
CHANGE COLUMN total_price total_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '仕入合計金額' ,
ADD INDEX fk_t_p_invoices_t_complete_id (t_complete_id ASC) ;

UPDATE t_p_invoices SET t_complete_id = 0 WHERE ID >= 0 ;
ALTER TABLE t_p_invoices 
CHANGE COLUMN t_complete_id t_complete_id INT NOT NULL DEFAULT 0 COMMENT '売上・仕入締id' ;

ALTER TABLE t_p_invoices 
ADD CONSTRAINT fk_t_p_invoices_t_complete_id
  FOREIGN KEY (t_complete_id)
  REFERENCES t_completes (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

UPDATE t_p_invoices SET accounting_date = purchase_date WHERE ID >= 0 ;

ALTER TABLE t_p_invoices 
CHANGE COLUMN accounting_date accounting_date DATETIME NOT NULL COMMENT '計上日' ;

ALTER TABLE t_p_invoices 
ADD INDEX id_t_p_invoices_accounting_date (accounting_date ASC) ,
ADD INDEX id_t_p_invoices_purchase_date (purchase_date ASC) ;

UPDATE t_p_invoices SET 
total_price_nomal = 0,
total_price_reduced_tax = 0,
total_price_include = 0,
tax_nomal = 0,
tax_reduced = 0
WHERE id >= 0;


ALTER TABLE t_p_invoices 
CHANGE COLUMN total_price_nomal total_price_nomal DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '仕入金額(通常税率)' ,
CHANGE COLUMN total_price_reduced_tax total_price_reduced_tax DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '仕入金額(軽減税率)' ,
CHANGE COLUMN total_price_include total_price_include DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '仕入金額(非課税)' ,
CHANGE COLUMN tax_nomal tax_nomal DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '消費税(通常税率)' ,
CHANGE COLUMN tax_reduced tax_reduced DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '消費税(軽減税率)' ;


