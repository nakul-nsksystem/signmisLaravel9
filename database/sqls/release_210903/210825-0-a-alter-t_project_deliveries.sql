ALTER TABLE `t_project_deliveries` 
ADD COLUMN `delivery_m_customer_id` INT NULL DEFAULT NULL COMMENT '納品先顧客id' AFTER `memo`,
ADD COLUMN `delivery_owner_m_customer_id` INT NULL DEFAULT NULL COMMENT '荷主顧客id' AFTER `delivery_customer_tel`,
ADD COLUMN `delivery_owner_user` VARCHAR(1024) NULL DEFAULT NULL AFTER `delivery_owner_address`;

