ALTER TABLE `m_product_categories` 
ADD COLUMN `is_production` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '生産管理対象 0:非対象 1:対象' AFTER `material_category_m_kv_id`;

UPDATE m_product_categories 
  SET is_production = 1 
WHERE id IN (1,2,4,21,26,59)  ; 