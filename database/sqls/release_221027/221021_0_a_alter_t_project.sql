ALTER TABLE `t_projects` 
ADD COLUMN `ss_order_id` VARCHAR(190) NULL DEFAULT NULL COMMENT 'スマートショップ注文id' AFTER `cd`,
ADD UNIQUE INDEX `ss_order_id_UNIQUE` (`ss_order_id` ASC) VISIBLE,
ADD COLUMN `ss_order_cd` VARCHAR(190) NULL DEFAULT NULL COMMENT 'スマートショップ注文番号' AFTER `ss_order_id`,
ADD UNIQUE INDEX `ss_order_cd_UNIQUE` (`ss_order_cd` ASC) VISIBLE;

