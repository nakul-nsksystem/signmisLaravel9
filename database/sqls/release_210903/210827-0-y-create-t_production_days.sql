CREATE TABLE `t_production_days` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `m_production_id` INT NOT NULL COMMENT '生産先ID',
  `day` DATETIME NOT NULL COMMENT '生産予定日',
  `planed_start_at` TIME NULL COMMENT '開始予定時刻',
  `planed_end_at` TIME NULL COMMENT '終了予定時刻',
  `created_m_user_id` INT NULL COMMENT '作成担当者',
  `updated_m_user_id` INT NULL COMMENT '更新担当者',
  `created_at` DATETIME NOT NULL DEFAULT  CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NOT NULL DEFAULT  CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_production_days_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  INDEX `fk_t_production_days_created_m_user_id_idx` (`created_m_user_id` ASC) ,
  INDEX `fk_t_production_days__idx` (`m_production_id` ASC) ,
  CONSTRAINT `fk_t_production_days_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_production_days_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_production_days_`
    FOREIGN KEY (`m_production_id`)
    REFERENCES `m_productions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
COMMENT = '生産計画 日付';
