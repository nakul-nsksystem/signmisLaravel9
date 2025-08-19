ALTER TABLE `t_project_product_processes` 
ADD COLUMN `process_mater` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '加工メーター数' AFTER `is_customer_provide`,
ADD COLUMN `total_process_mater` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '総加工メーター数' AFTER `process_mater`;
