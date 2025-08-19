CREATE TABLE `t_project_construction_result_costs` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_construction_result_id` INT NOT NULL COMMENT '施工実績id',
  `cost_name` VARCHAR(255) NULL DEFAULT NULL COMMENT '内訳',
  `value` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '金額',
  `created_m_user_id` INT NOT NULL COMMENT '作成者id',
  `updated_m_user_id` INT NOT NULL COMMENT '更新者id',
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_project_construction_result_costs_construct_result_id_idx` (`t_project_construction_result_id` ASC) ,
  INDEX `fk_t_project_construction_result_costs_created_m_user_id_idx` (`created_m_user_id` ASC) ,
  INDEX `fk_t_project_construction_result_costs_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  CONSTRAINT `fk_t_project_construction_result_costs_construct_result_id`
    FOREIGN KEY (`t_project_construction_result_id`)
    REFERENCES `t_project_construction_results` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_construction_result_costs_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_project_construction_result_costs_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)

COMMENT = '物件実績経費';