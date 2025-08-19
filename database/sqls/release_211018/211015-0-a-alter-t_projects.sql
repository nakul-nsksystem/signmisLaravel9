ALTER TABLE `t_projects` 
ADD COLUMN `estimate_no` VARCHAR(1024) NULL DEFAULT NULL COMMENT '見積No' AFTER `memo`,
ADD COLUMN `estimate_delivery_date` VARCHAR(1024) NULL DEFAULT NULL COMMENT '見積書記載納期' AFTER `estimate_no`,
ADD COLUMN `estimate_delivery_address` VARCHAR(1024) NULL DEFAULT NULL COMMENT '見積書記載受渡場所' AFTER `estimate_delivery_date`,
ADD COLUMN `estimate_condition` VARCHAR(1024) NULL DEFAULT NULL COMMENT '見積書記載取引方法' AFTER `estimate_delivery_address`,
ADD COLUMN `estimate_term` VARCHAR(1024) NULL DEFAULT NULL COMMENT '見積書記載有効期限' AFTER `estimate_condition`,
ADD COLUMN `estimate_memo` VARCHAR(1024) NULL DEFAULT NULL COMMENT '見積書記載備考' AFTER `estimate_term`;