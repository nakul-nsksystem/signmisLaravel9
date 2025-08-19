ALTER TABLE `t_project_product_processes` 
ADD COLUMN `display_order_01` VARCHAR(256) NULL DEFAULT NULL AFTER `display_prod_09`,
ADD COLUMN `order_supplier_m_customer_id` INT NULL DEFAULT NULL COMMENT '発注先Id'  AFTER `display_order_01` ;