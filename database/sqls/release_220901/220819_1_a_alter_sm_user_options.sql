ALTER TABLE `sm_user_options` 
ADD COLUMN `target_sm_user_option_id` INT NULL DEFAULT NULL COMMENT '参照先sm_user_option_id' AFTER `option_05`;

ALTER TABLE `sm_user_options` 
ADD INDEX `fk_sm_user_options_target_sm_user_option_id_idx` (`target_sm_user_option_id` ASC) ;
ALTER TABLE `sm_user_options` 
ADD CONSTRAINT `fk_sm_user_options_target_sm_user_option_id`
  FOREIGN KEY (`target_sm_user_option_id`)
  REFERENCES `sm_user_options` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
INSERT INTO `sm_user_options` (`id`, `key_m_kv_id`, `order_no`, `name`, `application`, `default_value`, `is_user_editable`, `option_01`, `target_sm_user_option_id`) VALUES ('10', '8020001', '10', '物件検索条件', 't_project', '0', '1', 'boolean', '151');
UPDATE `sm_user_options` SET `option_01` = 'string' WHERE (`id` = '151');


