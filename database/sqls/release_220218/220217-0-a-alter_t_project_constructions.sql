ALTER TABLE `t_project_constructions` 
ADD COLUMN `construction_belongings` VARCHAR(1024) NULL DEFAULT NULL COMMENT '施工持ち物' AFTER `is_holiday_work`;