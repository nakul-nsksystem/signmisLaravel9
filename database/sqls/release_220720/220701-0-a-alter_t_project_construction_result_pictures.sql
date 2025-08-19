ALTER TABLE `t_project_construction_result_pictures` 
CHANGE COLUMN `base64_preview` `base64_preview_willdrop` TEXT  NULL DEFAULT NULL COMMENT 'プレビューbase64(削除予定)' ;
