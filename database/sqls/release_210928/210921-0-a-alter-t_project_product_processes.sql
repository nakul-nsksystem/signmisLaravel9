ALTER TABLE `t_project_product_processes` 
ADD COLUMN `is_use_stocked` TINYINT(1) NULL DEFAULT 0 COMMENT '在庫使用' AFTER `is_ordered`;
