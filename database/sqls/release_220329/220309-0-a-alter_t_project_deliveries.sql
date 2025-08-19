ALTER TABLE `t_project_deliveries` 
ADD COLUMN `is_night_work` TINYINT(1) NULL DEFAULT 0 COMMENT '夜間施工フラグ' AFTER `num_of_boxes`,
ADD COLUMN `is_holiday_work` TINYINT(1) NULL DEFAULT 0 COMMENT '休日施工フラグ' AFTER `is_night_work` , 
ADD COLUMN `construction_belongings` VARCHAR(1024) NULL DEFAULT NULL AFTER `is_holiday_work` , 
ADD COLUMN `construction_start_time` TIME NULL DEFAULT NULL COMMENT '施工開始時間' AFTER `num_of_boxes`,
ADD COLUMN `construction_end_time` TIME NULL DEFAULT NULL COMMENT '施工完了時間' AFTER `construction_start_time`,
ADD COLUMN `bk_construction_id` INT NULL DEFAULT NULL AFTER `deleted_at`;

