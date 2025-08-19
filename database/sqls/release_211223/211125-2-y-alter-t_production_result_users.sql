ALTER TABLE `t_production_result_users` 
ADD INDEX `fk_t_production_result_users_t_production_result_id_idx` (`t_production_result_id` ASC) ;

ALTER TABLE `t_production_result_users` 
ADD CONSTRAINT `fk_t_production_result_users_t_production_result_id`
  FOREIGN KEY (`t_production_result_id`)
  REFERENCES `t_production_results` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


ALTER TABLE `t_production_result_users` 
DROP FOREIGN KEY `t_production_result_users_created_m_user_id`,
DROP FOREIGN KEY `t_production_result_users_m_user_id`;
ALTER TABLE `t_production_result_users` 
ADD INDEX `fk_t_production_result_users_t_production_result_id_idx` (`t_production_result_id` ASC) ;

ALTER TABLE `t_production_result_users` 
ADD CONSTRAINT `fk_t_production_result_users_created_m_user_id`
  FOREIGN KEY (`created_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_production_result_users_m_user_id`
  FOREIGN KEY (`m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
