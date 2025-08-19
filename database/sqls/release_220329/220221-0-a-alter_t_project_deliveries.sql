ALTER TABLE `t_project_deliveries` 
ADD COLUMN `invoice_no` VARCHAR(256) NULL DEFAULT NULL COMMENT '送り状番号' AFTER `delivery_owner_tel`,
ADD COLUMN `delivery_completed_at` DATETIME NULL DEFAULT NULL COMMENT '納品完了日' AFTER `invoice_no`,
ADD COLUMN `delivery_completed_m_user_id` INT NULL DEFAULT NULL COMMENT '納品完了担当者' AFTER `delivery_completed_at`,
ADD COLUMN `mail_sent_at` DATETIME NULL DEFAULT NULL COMMENT 'メール送信日' AFTER `delivery_completed_m_user_id`;

ALTER TABLE `t_project_deliveries` 
ADD INDEX `fk_t_project_deliveries_created_m_user_id_idx` (`created_m_user_id` ASC) ,
ADD INDEX `fk_t_project_deliveries_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
ADD INDEX `fk_t_project_deliveries_completed_m_user_id_idx` (`delivery_completed_m_user_id` ASC) ;
;

ALTER TABLE `t_project_deliveries` 
ADD CONSTRAINT `fk_t_project_deliveries_created_m_user_id`
  FOREIGN KEY (`created_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_deliveries_updated_m_user_id`
  FOREIGN KEY (`updated_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_t_project_deliveries_completed_m_user_id`
  FOREIGN KEY (`delivery_completed_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
	