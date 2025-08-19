ALTER TABLE `t_project_files` 
ADD COLUMN `thumbnailpath` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'サムネイル用パス' AFTER `modified`,
ADD COLUMN `src_thumbnailpath` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'サムネイル保存先パス' AFTER `thumbnailpath`;