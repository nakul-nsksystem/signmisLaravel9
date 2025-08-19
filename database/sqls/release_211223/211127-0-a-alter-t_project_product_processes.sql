ALTER TABLE `t_project_product_processes` 
CHANGE COLUMN `display_order_01` `display_order_01` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '物件発注連動用カラム1' ,
CHANGE COLUMN `display_order_02` `display_order_02` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '物件発注連動用カラム2' ,
CHANGE COLUMN `display_order_03` `display_order_03` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '物件発注連動用カラム3' ,
CHANGE COLUMN `display_order_04` `display_order_04` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '物件発注連動用カラム4' ,
CHANGE COLUMN `display_order_05` `display_order_05` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '物件発注連動用カラム5' ,
CHANGE COLUMN `display_order_06` `display_order_06` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '物件発注連動用カラム6' ;