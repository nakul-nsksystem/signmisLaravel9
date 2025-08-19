-- 請求
ALTER TABLE t_completes 
CHANGE COLUMN carry_over carry_over DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '前回繰越金額' ,
CHANGE COLUMN price_total total_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '売上/仕入合計金額' ,
CHANGE COLUMN price_total_nomal total_price_nomal DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '売上/仕入金額(通常税率)' ,
CHANGE COLUMN price_total_reduced_tax total_price_reduced_tax DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '売上/仕入金額(軽減税率)' ,
CHANGE COLUMN price_total_include total_price_include DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '売上/仕入金額(非課税)' ,
CHANGE COLUMN tax tax DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '消費税' ,
CHANGE COLUMN tax_nomal tax_nomal DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '消費税(通常税率)' ,
CHANGE COLUMN tax_reduced tax_reduced DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '消費税(軽減税率)' ,
CHANGE COLUMN payment_price payment_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '入金/支払金額' ,
CHANGE COLUMN grand_total grand_total DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '請求金額' ;
