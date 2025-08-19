ALTER TABLE `m_customers` 
ADD COLUMN `accounts_title_m_kv_id` INT NULL DEFAULT NULL COMMENT '勘定区分' AFTER `delivery_format_m_kv_id`;
