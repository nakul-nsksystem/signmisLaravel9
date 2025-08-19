ALTER TABLE `t_project_deliveries` 
CHANGE COLUMN `delivery_at` `delivery_at` DATETIME NULL DEFAULT NULL COMMENT '納期（発送日）' ;
