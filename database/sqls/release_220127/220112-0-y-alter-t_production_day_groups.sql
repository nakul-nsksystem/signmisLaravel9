ALTER TABLE `t_production_day_groups` 
ADD COLUMN `planed_production_at` DATETIME NULL COMMENT '生産予定日時' AFTER `parent_t_production_day_group_id`;
