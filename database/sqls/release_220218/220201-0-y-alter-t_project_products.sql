ALTER TABLE `t_project_products` 
ADD COLUMN `unit_m_kv_id` INT NULL COMMENT '単位区分' AFTER `qty`;

update t_project_products 
 set unit_m_kv_id = (select max(unit_m_kv_id) from t_project_product_estimate_details where t_project_product_id = t_project_products.id and is_product_row = 1 )   
 where exists ( select * from t_project_product_estimate_details where t_project_product_id = t_project_products.id )  ; 
 
