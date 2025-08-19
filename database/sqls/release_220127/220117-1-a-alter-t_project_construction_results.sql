ALTER TABLE `t_project_construction_results` 
ADD INDEX `fk_t_project_construction_results_t_project_construction_id_idx` (`t_project_construction_id` ASC) ,
ADD INDEX `fk_t_project_construction_results_created_m_user_id_idx` (`created_m_user_id` ASC) ,
ADD INDEX `fk_t_project_construction_results_updated_m_user_id_idx` (`updated_m_user_id` ASC) ;
;
ALTER TABLE `t_project_construction_results` 
ADD CONSTRAINT `fk_t_project_construction_results_t_project_construction_id`
  FOREIGN KEY (`t_project_construction_id`)
  REFERENCES `t_project_constructions` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_construction_results_created_m_user_id`
  FOREIGN KEY (`created_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_construction_results_updated_m_user_id`
  FOREIGN KEY (`updated_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;