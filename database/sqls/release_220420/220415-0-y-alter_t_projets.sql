ALTER TABLE `t_projects` 
ADD COLUMN `is_order_lost` TINYINT(1) NULL DEFAULT 0 COMMENT 'Is失注' AFTER `sales_m_user_id`;
