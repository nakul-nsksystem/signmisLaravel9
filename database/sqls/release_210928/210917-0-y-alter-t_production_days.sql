

ALTER TABLE `t_production_days` 
ADD COLUMN `sort_target_01` VARCHAR(256) NULL AFTER `planed_end_at`,
ADD COLUMN `sort_target_02` VARCHAR(256) NULL AFTER `sort_target_01`,
ADD COLUMN `sort_target_03` VARCHAR(256) NULL AFTER `sort_target_02`,
ADD COLUMN `sort_target_04` VARCHAR(256) NULL AFTER `sort_target_03`,
ADD COLUMN `sort_target_05` VARCHAR(256) NULL AFTER `sort_target_04`;
