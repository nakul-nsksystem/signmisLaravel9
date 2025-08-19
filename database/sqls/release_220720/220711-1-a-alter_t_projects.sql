ALTER TABLE `t_projects` 
ADD COLUMN `m_customer_person_id` INT NULL COMMENT '顧客担当者id' AFTER `m_customer_id`,
ADD COLUMN `is_input_customer_user` TINYINT(1) NULL DEFAULT 0 COMMENT '顧客担当者入力フラグ' AFTER `m_customer_person_id`,
ADD INDEX `fk_t_projects_m_customer_person_id_idx` (`m_customer_person_id` ASC) ;

ALTER TABLE `t_projects` 
ADD CONSTRAINT `fk_t_projects_m_customer_person_id`
  FOREIGN KEY (`m_customer_person_id`)
  REFERENCES `m_customer_persons` (`id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;


UPDATE `t_projects` SET `is_input_customer_user` = 1 ;