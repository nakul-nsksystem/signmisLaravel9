ALTER TABLE `t_production_day_groups` 
DROP COLUMN `uid`,
ADD COLUMN `target` VARCHAR(256) NULL COMMENT 'グルーピングの対象' AFTER `level`;
