ALTER TABLE `m_delivery_destinations` 
ADD COLUMN `is_owner` TINYINT(1) NULL DEFAULT 0 COMMENT '荷主フラグ' AFTER `delivery_destination_m_customer_id` ;