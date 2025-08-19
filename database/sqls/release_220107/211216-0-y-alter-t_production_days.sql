ALTER TABLE `t_production_days` 
CHANGE COLUMN `sort_target_01` `group_target_01` VARCHAR(256) NULL DEFAULT NULL ,
CHANGE COLUMN `sort_target_02` `group_target_02` VARCHAR(256) NULL DEFAULT NULL ,
CHANGE COLUMN `sort_target_03` `group_target_03` VARCHAR(256) NULL DEFAULT NULL ,
CHANGE COLUMN `sort_target_04` `group_target_04` VARCHAR(256) NULL DEFAULT NULL ,
CHANGE COLUMN `sort_target_05` `group_target_05` VARCHAR(256) NULL DEFAULT NULL ;
