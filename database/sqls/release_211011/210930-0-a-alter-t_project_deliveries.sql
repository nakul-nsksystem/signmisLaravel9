ALTER TABLE `t_project_deliveries` 
ADD COLUMN `arrival_at` DATETIME NULL DEFAULT NULL COMMENT '着日' AFTER `delivery_time`,
ADD COLUMN `arrival_time` VARCHAR(1024) NULL DEFAULT NULL COMMENT '着日時刻' AFTER `arrival_at`;