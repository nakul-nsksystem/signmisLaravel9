ALTER TABLE `m_process_categories` 
ADD COLUMN `is_main_material` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'メイン材料 ' AFTER `is_production`;


update m_process_categories
  set is_main_material = 1 
  where id in (6,24)  ; 