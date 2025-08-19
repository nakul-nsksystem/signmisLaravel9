ALTER TABLE `t_projects` 
ADD COLUMN `construction_fee` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '納品・施工代' AFTER `delivery_fee`;
