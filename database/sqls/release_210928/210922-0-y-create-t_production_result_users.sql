CREATE TABLE `_signmis`.`t_production_result_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `t_production_result_id` INT NOT NULL COMMENT '生産実績ID',
  `m_user_id` INT NOT NULL COMMENT '担当者ID',
  `created_m_user_id` INT NOT NULL COMMENT '作成担当者',
  `created_at` DATETIME NOT NULL COMMENT '作成日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_production_users_t_production_result_id_idx` (`t_production_result_id` ASC) VISIBLE,
  INDEX `fk_t_production_users__m_user_id_idx` (`m_user_id` ASC) VISIBLE,
  INDEX `fk_t_production_users__created_m_user_id_idx` (`created_m_user_id` ASC) VISIBLE,
  CONSTRAINT `t_production_result_users_t_production_result_id`
    FOREIGN KEY (`t_production_result_id`)
    REFERENCES `_signmis`.`t_production_results` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `t_production_result_users_m_user_id`
    FOREIGN KEY (`m_user_id`)
    REFERENCES `_signmis`.`m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `t_production_result_users_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `_signmis`.`m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '生産実績担当者';
