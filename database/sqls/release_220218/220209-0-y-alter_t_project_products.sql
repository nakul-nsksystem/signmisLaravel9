ALTER TABLE `t_project_products` 
ADD COLUMN `operator_m_user_id` INT NULL COMMENT 'オペレータ担当' AFTER `sales_completed_at`;

ALTER TABLE `t_project_products` 
ADD INDEX `fk_t_project_products_operator_m_user_id_idx` (`operator_m_user_id` ASC) ;

ALTER TABLE `t_project_products` 
ADD CONSTRAINT `fk_t_project_products_operator_m_user_id`
  FOREIGN KEY (`operator_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;


