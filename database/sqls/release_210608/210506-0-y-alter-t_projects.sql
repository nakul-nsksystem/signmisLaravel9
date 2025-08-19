ALTER TABLE `t_projects` 
ADD COLUMN `construction_fee` DECIMAL(15,4) NULL DEFAULT 0 AFTER `orderd_m_user_id`,
CHANGE COLUMN `devlivery_fee` `devlivery_fee` DECIMAL(15,4) NULL DEFAULT '0' COMMENT '送料' ,
CHANGE COLUMN `other_fee` `other_fee` DECIMAL(15,4) NULL DEFAULT '0' COMMENT 'その他費用' ;

ALTER TABLE `t_projects` 
CHANGE COLUMN `construction_fee` `construction_fee` DECIMAL(15,4) NULL DEFAULT '0.0000' COMMENT '施工費' ;
