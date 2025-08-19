ALTER TABLE `m_product_categories` 
ADD COLUMN `is_delivery_needed` TINYINT(1) NULL DEFAULT 0 COMMENT '納品と紐づけを行うフラグ' AFTER `is_board`;

UPDATE `m_product_categories` SET `is_delivery_needed` = '1' WHERE (`id` = '1');
UPDATE `m_product_categories` SET `is_delivery_needed` = '1' WHERE (`id` = '2');
UPDATE `m_product_categories` SET `is_delivery_needed` = '1' WHERE (`id` = '3');
UPDATE `m_product_categories` SET `is_delivery_needed` = '1' WHERE (`id` = '4');
UPDATE `m_product_categories` SET `is_delivery_needed` = '1' WHERE (`id` = '5');
UPDATE `m_product_categories` SET `is_delivery_needed` = '1' WHERE (`id` = '21');
UPDATE `m_product_categories` SET `is_delivery_needed` = '1' WHERE (`id` = '26');
