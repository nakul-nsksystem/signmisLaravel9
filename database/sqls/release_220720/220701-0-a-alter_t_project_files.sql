ALTER TABLE `t_project_files` 
CHANGE COLUMN `base64_thumbnail` `base64_thumbnail_willdrop` MEDIUMTEXT  NULL DEFAULT NULL COMMENT 'サムネイル(削除予定)' ;
