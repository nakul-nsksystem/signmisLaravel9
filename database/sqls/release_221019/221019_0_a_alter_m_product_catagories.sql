INSERT INTO `m_product_categories` (`id`, `order_no`, `cd`, `name`, `is_production`, `is_able_media_separate`, `is_able_media_separate_both_side`, `is_not_input_size_needed`, `is_board`, `is_delivery_needed`) VALUES ('65', '9999', 'c9999', '値引', '0', '0', '0', '1', '0', '0');
INSERT INTO `m_process_categories` (`id`, `order_no`, `cd`, `name`, `is_able_to_add`, `is_production`, `is_main_material`, `is_lami_material`, `num_of_use_m_production`) VALUES ('30', '9999', 'Discount', '値引', '0', '0', '0', '0', '1');
INSERT INTO `m_product_category_link_processes` (`id`, `m_product_category_id`, `m_process_category_id`, `is_default_on`, `is_required`) VALUES ('64', '65', '30', '1', '1');
INSERT INTO `m_processes` (`id`, `m_process_category_id`, `order_no`, `name`) VALUES ('61', '30', '1', '値引');
UPDATE `m_process_categories` SET `memo4project` = '商品数量にマイナスの値を入力し、値引額にはプラスの値を入力してください' WHERE (`id` = '30');
ALTER TABLE `m_product_categories` 
ADD COLUMN `permit_negative_qty` INT NULL DEFAULT 0 COMMENT '商品数量マイナスの数字許可　0:許可しない　1:許可する　2:マイナスの数字のみ許可(値引きなど)' AFTER `is_delivery_needed`,
ADD COLUMN `is_direction_sheet` TINYINT(0) NOT NULL DEFAULT 1 COMMENT '指示書pdfに表示する' AFTER `permit_negative_qty`,
CHANGE COLUMN `is_delivery_needed` `is_delivery_needed` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '納品と紐づけを行うフラグ' ;

UPDATE `m_product_categories` SET `permit_negative_qty` = '2' WHERE (`id` = '65');
UPDATE `m_product_categories` SET `is_direction_sheet` = '0' WHERE (`id` = '65');
UPDATE `m_product_categories` SET `is_direction_sheet` = '0' WHERE (`id` = '64');
UPDATE `m_product_categories` SET `is_direction_sheet` = '0' WHERE (`id` = '63');
