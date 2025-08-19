CREATE TABLE `t_production_result_stops` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `t_production_result_id` INT NOT NULL,
  `input_type_m_kv_id` INT NOT NULL COMMENT '入力タイプ',
  `reason_m_kv_id` INT NOT NULL COMMENT '理由区分',
  `started_at` DATETIME NULL COMMENT '開始日時',
  `ended_at` DATETIME NULL COMMENT '終了日時',
  `minutes` DECIMAL(15,4) NULL COMMENT '分数',
  `seconds` INT NULL COMMENT '秒数',
  `memo` VARCHAR(1024) NULL COMMENT '備考',
  `created_m_user_id` INT NOT NULL,
  `updated_m_user_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_production_result_stops_t_production_result_id_idx` (`t_production_result_id` ASC) ,
  INDEX `fk_t_production_result_stops_input_type_m_kv_id_idx` (`input_type_m_kv_id` ASC) ,
  INDEX `fk_t_production_result_stops_reason_m_kv_id_idx` (`reason_m_kv_id` ASC) ,
  INDEX `fk_t_production_result_stops_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  INDEX `fk_t_production_result_stops_created_m_user_id_idx` (`created_m_user_id` ASC) ,
  CONSTRAINT `fk_t_production_result_stops_t_production_result_id`
    FOREIGN KEY (`t_production_result_id`)
    REFERENCES `t_production_results` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_result_stops_input_type_m_kv_id`
    FOREIGN KEY (`input_type_m_kv_id`)
    REFERENCES `m_kvs` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_t_production_result_stops_reason_m_kv_id`
    FOREIGN KEY (`reason_m_kv_id`)
    REFERENCES `m_kvs` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_result_stops_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_result_stops_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '生産実績中断';
