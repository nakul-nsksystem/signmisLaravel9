ALTER TABLE `t_project_construction_results` 
DROP COLUMN `cost;


ALTER TABLE `t_project_construction_result_pictures` 
ADD COLUMN `base64_preview` TEXT NULL DEFAULT NULL COMMENT 'プレビュー用画像' AFTER `filepath`;
