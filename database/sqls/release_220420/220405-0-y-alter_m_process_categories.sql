ALTER TABLE `m_process_categories` 
ADD COLUMN `production_color` VARCHAR(45) NULL COMMENT '生産管理画面での文字色' AFTER `is_production`;
