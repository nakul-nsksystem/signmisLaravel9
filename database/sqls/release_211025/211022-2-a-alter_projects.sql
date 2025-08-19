ALTER TABLE `t_projects` 
ADD COLUMN `estimate_date` DATETIME NULL DEFAULT NULL COMMENT '見積日' AFTER `estimate_no`;
