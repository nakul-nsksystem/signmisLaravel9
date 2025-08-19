ALTER TABLE `t_project_products` 
ADD COLUMN `estimate_detail` VARCHAR(1024) NULL DEFAULT NULL COMMENT '見積書記載明細行' AFTER `total_hour_for_production`,
ADD COLUMN `estimate_unit_m_kv_id` INT NULL DEFAULT NULL COMMENT '見積書記載単位' AFTER `estimate_detail`;
