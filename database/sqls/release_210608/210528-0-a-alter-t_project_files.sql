ALTER TABLE `t_project_files` 
ADD COLUMN `modified` DATETIME NULL DEFAULT NULL COMMENT 'ファイル最終更新日' AFTER `extension`;
