ALTER TABLE `m_process_categories` 
ADD COLUMN `is_production` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '生産管理対象 0:未対象 1:対象' AFTER `memo4project`,
ADD COLUMN `production_m_kv_id` INT NULL COMMENT '生産管理カテゴリー' AFTER `is_production`;
