ALTER TABLE `t_project_products` 
ADD COLUMN `sales_completed_at` DATETIME NULL COMMENT '売上完了日' AFTER `delivery_date`;
