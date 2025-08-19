-- 売上
ALTER TABLE t_sales 
ADD COLUMN total_price_nomal DECIMAL(15,4) NULL COMMENT '売上金額(通常税率)' AFTER total_price,
ADD COLUMN total_price_reduced_tax DECIMAL(15,4) NULL COMMENT '売上金額(軽減税率)' AFTER total_price_nomal,
ADD COLUMN total_price_include DECIMAL(15,4) NULL COMMENT '売上金額(非課税)' AFTER total_price_reduced_tax,
ADD COLUMN tax_nomal DECIMAL(15,4) NULL COMMENT '消費税(通常税率)' AFTER tax,
ADD COLUMN tax_reduced DECIMAL(15,4) NULL COMMENT '消費税(軽減税率)' AFTER tax_nomal,
CHANGE COLUMN total_price total_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '売上合計金額' ;

ALTER TABLE t_sales 
ADD INDEX id_t_sales_accounting_date (accounting_date ASC) ,
ADD INDEX id_t_sales_shipped_at (shipped_at ASC) ;

UPDATE t_sales SET 
total_price_nomal = 0,
total_price_reduced_tax = 0,
total_price_include = 0,
tax_nomal = 0,
tax_reduced = 0
WHERE id >= 0;

ALTER TABLE t_sales 
CHANGE COLUMN total_price_nomal total_price_nomal DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '売上金額(通常税率)' ,
CHANGE COLUMN total_price_reduced_tax total_price_reduced_tax DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '売上金額(軽減税率)' ,
CHANGE COLUMN total_price_include total_price_include DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '売上金額(非課税)' ,
CHANGE COLUMN tax_nomal tax_nomal DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '消費税(通常税率)' ,
CHANGE COLUMN tax_reduced tax_reduced DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '消費税(軽減税率)' ;

