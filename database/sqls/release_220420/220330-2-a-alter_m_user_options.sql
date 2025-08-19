ALTER TABLE `m_user_options` 
ADD INDEX `fk_m_user_options_m_user_id_idx` (`m_user_id` ASC) ,
ADD INDEX `fk_m_user_options_sm_option_id_idx` (`sm_user_option_id` ASC) ;

ALTER TABLE `m_user_options` 
ADD CONSTRAINT `fk_m_user_options_m_user_id`
  FOREIGN KEY (`m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_m_user_options_sm_option_id`
  FOREIGN KEY (`sm_user_option_id`)
  REFERENCES `sm_user_options` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;