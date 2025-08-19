ALTER TABLE `m_product_categories` 
ADD COLUMN `is_able_media_separate` TINYINT(1) NULL DEFAULT 0 COMMENT 'メディアの分割が可能か 1:可能' AFTER `material_category_m_kv_id`;

UPDATE `m_product_categories` SET `is_able_media_separate`='1' WHERE (`id` in (1,2,3,4,26)) ; 
UPDATE `m_product_categories` SET `is_able_media_separate`='0' WHERE (`id` in (5,21,59)) ; 
