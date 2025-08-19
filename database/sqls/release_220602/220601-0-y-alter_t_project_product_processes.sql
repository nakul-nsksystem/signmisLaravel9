
ALTER TABLE `t_project_product_processes` 
ADD COLUMN `custom_sqm` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT 'カスタム㎡数　0の場合、商品の㎡数を使用 両面などで使用' AFTER `total_process_mater`,
ADD COLUMN `total_custom_sqm` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '合計カスタム㎡数　0の場合、商品の㎡数を使用 両面などで使用' AFTER `custom_sqm`;
