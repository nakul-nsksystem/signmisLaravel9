ALTER TABLE `t_project_product_estimate_details` 
ADD COLUMN `order_no` INT NULL DEFAULT NULL COMMENT '表示順' AFTER `t_project_product_id`,
ADD COLUMN `price` DECIMAL(15,4) NULL DEFAULT 0 AFTER `unit_m_kv_id`,
ADD COLUMN `total_price` DECIMAL(15,4) NULL DEFAULT 0 AFTER `price`,
ADD COLUMN `is_product_row` TINYINT(1) NULL DEFAULT 0 COMMENT '商品概要行か詳細説明行かの判定' AFTER `total_price`;
