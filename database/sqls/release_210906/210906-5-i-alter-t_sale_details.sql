-- 売上明細
ALTER TABLE t_sale_details 
CHANGE COLUMN t_project_product_id t_project_product_id INT NULL DEFAULT NULL COMMENT '物件商品id' ;

