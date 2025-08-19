-- 仕入

-- 表示順
ALTER TABLE t_p_invoice_details 
ADD COLUMN order_no INT NULL COMMENT '表示順' AFTER t_p_invoice_id ;
