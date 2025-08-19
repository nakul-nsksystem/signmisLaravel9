ALTER TABLE `m_productions` 
ADD COLUMN `thumbnail_path` VARCHAR(512) NULL COMMENT 'サムネイルのパス' AFTER `varnish_ink_cost_per_sqm`;

