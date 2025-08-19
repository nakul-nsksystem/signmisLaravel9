ALTER TABLE `t_project_construction_result_pictures` 
ADD COLUMN `src_thumbnailpath` VARCHAR(255) NULL DEFAULT NULL COMMENT 'サムネイルファイルストレージパス' AFTER `filepath`;
