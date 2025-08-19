CREATE TABLE `t_production_process_plans` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `t_project_product_process_id` INT NOT NULL,
  `t_production_day_group_id` INT NOT NULL,
  `order_no` INT NOT NULL COMMENT '順序',
  `created_m_user_id` INT NULL COMMENT '作成担当者',
  `updated_m_user_id` INT NULL COMMENT '更新担当者',
  `created_at` DATETIME NULL COMMENT '作成日',
  `updated_at` DATETIME NULL COMMENT '更新日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_production_process_plans_t_project_product_process_id_idx` (`t_project_product_process_id` ASC) ,
  INDEX `fk_t_production_process_plans_t_production_day_group_id_idx` (`t_production_day_group_id` ASC) ,
  INDEX `fk_t_production_process_plans_created_m_user_id_idx` (`created_m_user_id` ASC) ,
  INDEX `fk_t_production_process_plans_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  CONSTRAINT `fk_t_production_process_plans_t_project_product_process_id`
    FOREIGN KEY (`t_project_product_process_id`)
    REFERENCES `t_project_product_processes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_process_plans_t_production_day_group_id`
    FOREIGN KEY (`t_production_day_group_id`)
    REFERENCES `t_production_day_groups` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_process_plans_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_process_plans_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '生産計画 工程グループ';
