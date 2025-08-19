ALTER TABLE `t_projects` 
ADD COLUMN `po_project_name` VARCHAR(1024) NULL DEFAULT NULL COMMENT '発注用物件名' AFTER `name`;
