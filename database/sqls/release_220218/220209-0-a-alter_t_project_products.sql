ALTER TABLE `t_project_products` 
ADD COLUMN `is_not_display_size_in_estimate` TINYINT(1) NULL DEFAULT 0 COMMENT '見積り寸法非表示フラグ' AFTER `size_extend_r`;