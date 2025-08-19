ALTER TABLE `t_production_day_groups` 
ADD COLUMN `title` VARCHAR(256) NULL COMMENT 'タイトル' AFTER `key`;

ALTER TABLE `t_production_day_groups` 
ADD COLUMN `deleted_at` DATETIME NULL COMMENT '削除日' AFTER `updated_at`;

