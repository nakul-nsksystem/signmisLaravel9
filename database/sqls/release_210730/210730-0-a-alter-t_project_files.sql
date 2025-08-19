ALTER TABLE `t_project_files` 
DROP COLUMN `src_filename`,
ADD COLUMN `parent_id` INT NULL DEFAULT NULL COMMENT 'フォルダーid' AFTER `uid`,
ADD COLUMN `is_folder` TINYINT(1) NULL DEFAULT 0 COMMENT 'フォルダーorファイル' AFTER `parent_id`,
ADD COLUMN `file_dir` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'ディレクトリ' AFTER `filepath`;

CHANGE COLUMN `thumbnailpath` `base64_thumbnail` TEXT NULL DEFAULT NULL COMMENT 'サムネイル' ;