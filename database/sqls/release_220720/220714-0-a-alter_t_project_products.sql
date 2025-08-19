ALTER TABLE `t_project_products` 
ADD COLUMN `uid` INT NULL DEFAULT NULL COMMENT '保存前リレーション定義用ユニークid' AFTER `id`,
ADD COLUMN `is_partical_delivery` TINYINT(1) NULL DEFAULT 0 COMMENT '分納フラグ' AFTER `t_project_file_uid`;
