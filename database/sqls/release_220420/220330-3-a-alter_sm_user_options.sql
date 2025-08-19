ALTER TABLE `sm_user_options` 
ADD INDEX `fk_sm_user_options_key_m_kv_id_idx` (`key_m_kv_id` ASC) ;

ALTER TABLE `sm_user_options` 
ADD CONSTRAINT `fk_sm_user_options_key_m_kv_id`
  FOREIGN KEY (`key_m_kv_id`)
  REFERENCES `m_kvs` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
