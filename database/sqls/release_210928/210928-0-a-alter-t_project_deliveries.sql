ALTER TABLE `t_project_deliveries` 
ADD COLUMN `delivery_customer_zip` VARCHAR(1024) NULL DEFAULT NULL COMMENT '納品先郵便番号' AFTER `delivery_customer_address`,
ADD COLUMN `delivery_owner_zip` VARCHAR(1024) NULL DEFAULT NULL COMMENT '荷主郵便番号' AFTER `delivery_owner_address`;