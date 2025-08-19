ALTER TABLE `t_project_deliveries` 
ADD COLUMN `m_branch_id` INT NULL DEFAULT NULL COMMENT '発送拠点' AFTER `delivery_m_kv_id`,
ADD INDEX `fk_t_project_deliveries_m_branch_id_idx` (`m_branch_id` ASC) ;

ALTER TABLE `t_project_deliveries` 
ADD CONSTRAINT `fk_t_project_deliveries_m_branch_id`
  FOREIGN KEY (`m_branch_id`)
  REFERENCES `m_branches` (`id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;
