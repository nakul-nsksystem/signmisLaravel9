ALTER TABLE `m_process_categories` 
ADD COLUMN `is_lami_material` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_main_material`;

update m_process_categories 
   set is_lami_material = 1 
where id = 3 ; 