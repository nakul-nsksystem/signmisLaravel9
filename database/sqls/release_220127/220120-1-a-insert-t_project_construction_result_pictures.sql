ALTER TABLE `t_project_construction_result_pictures` 
ADD INDEX `fk_t_project_construction_result_pictures_created_m_user_id_idx` (`created_m_user_id` ASC) ,
ADD INDEX `fk_t_project_construction_result_pictures_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
ADD INDEX `fk_t_project_construction_result_pictures_t_project_constru_idx` (`t_project_construction_result_id` ASC) ;
;
ALTER TABLE `t_project_construction_result_pictures` 
ADD CONSTRAINT `fk_t_project_construction_result_pictures_created_m_user_id`
  FOREIGN KEY (`created_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ALTER TABLE `t_project_construction_result_pictures` 
ADD CONSTRAINT `fk_t_project_construction_result_pictures_updated_m_user_id`
  FOREIGN KEY (`updated_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_construction_result_pictures_construct_result_id`
  FOREIGN KEY (`t_project_construction_result_id`)
  REFERENCES `t_project_construction_results` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
