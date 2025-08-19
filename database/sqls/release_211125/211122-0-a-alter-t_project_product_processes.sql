ALTER TABLE `t_project_product_processes` 
ADD COLUMN `display_order_02` VARCHAR(256) NULL DEFAULT NULL AFTER `display_order_01`,
ADD COLUMN `display_order_03` VARCHAR(256) NULL DEFAULT NULL AFTER `display_order_02`,
ADD COLUMN `display_order_04` VARCHAR(256) NULL DEFAULT NULL AFTER `display_order_03`,
ADD COLUMN `display_order_05` VARCHAR(256) NULL DEFAULT NULL AFTER `display_order_04`,
ADD COLUMN `display_order_06` VARCHAR(256) NULL DEFAULT NULL AFTER `display_order_05`;