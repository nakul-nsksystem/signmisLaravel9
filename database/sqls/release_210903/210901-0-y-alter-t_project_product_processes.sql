ALTER TABLE `t_project_product_processes` 
ADD COLUMN `is_order_needed` TINYINT(1) NULL DEFAULT 0 AFTER `m_process_category_id`;
