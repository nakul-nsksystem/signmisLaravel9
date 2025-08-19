ALTER TABLE `m_users` 
ADD COLUMN `thumbnail_path` VARCHAR(512) NULL COMMENT 'サムネイルのパス' AFTER `control_level`;

