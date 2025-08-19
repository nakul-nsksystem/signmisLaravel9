ALTER TABLE `t_project_deliveries` 
ADD COLUMN `reuse_t_project_delivery_id` INT NULL DEFAULT NULL COMMENT '再利用元納品id' AFTER `delivery_m_kv_id`,
ADD COLUMN `is_reuse` TINYINT(1) NULL DEFAULT 0 COMMENT '履歴として使用するかのフラグ' AFTER `reuse_t_project_delivery_id`;


ALTER TABLE `t_project_deliveries` 
ADD INDEX `fk_t_project_deliveries_reuse_t_project_delivery_id_idx` (`reuse_t_project_delivery_id` ASC) ;
;
ALTER TABLE `t_project_deliveries` 
ADD CONSTRAINT `fk_t_project_deliveries_reuse_t_project_delivery_id`
  FOREIGN KEY (`reuse_t_project_delivery_id`)
  REFERENCES `t_project_deliveries` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;