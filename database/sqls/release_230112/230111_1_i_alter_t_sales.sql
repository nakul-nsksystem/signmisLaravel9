-- 売上

-- 表示順
ALTER TABLE t_sale_details 
ADD COLUMN order_no INT NULL COMMENT '表示順' AFTER t_sale_id ;
