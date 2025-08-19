ALTER TABLE `t_project_construction_result_users` 
ADD INDEX `fk_t_project_construction_result_users_created_m_user_id_idx` (`created_m_user_id` ASC) ,
ADD INDEX `fk_t_project_construction_result_users_m_user_id_idx` (`m_user_id` ASC) ,
ADD INDEX `fk_t_project_construction_result_users_out_source_m_branch__idx` (`out_source_m_branch_id` ASC) ,
ADD INDEX `fk_t_project_construction_result_users_out_source_m_custome_idx` (`out_source_m_customer_id` ASC) ,
ADD INDEX `fk_t_project_construction_result_users_t_project_constructi_idx` (`t_project_construction_result_id` ASC) ;
;
ALTER TABLE `t_project_construction_result_users` 
ADD CONSTRAINT `fk_t_project_construction_result_users_created_m_user_id`
  FOREIGN KEY (`created_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_construction_result_users_m_user_id`
  FOREIGN KEY (`m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_construction_result_users_out_source_m_branch_id`
  FOREIGN KEY (`out_source_m_branch_id`)
  REFERENCES `m_branches` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_construction_result_users_out_source_m_customer_id`
  FOREIGN KEY (`out_source_m_customer_id`)
  REFERENCES `m_customers` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_construction_result_users_construction_result_id`
  FOREIGN KEY (`t_project_construction_result_id`)
  REFERENCES `t_project_construction_results` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
