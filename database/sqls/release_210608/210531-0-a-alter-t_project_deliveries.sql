ALTER TABLE `t_project_deliveries` 
ADD COLUMN `delivery_product_name` DATETIME NULL DEFAULT NULL COMMENT '納品物名称' AFTER `delivery_time`;
