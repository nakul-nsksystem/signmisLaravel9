CREATE TABLE `t_production_results` (
  `id` INT NOT NULL,
  `t_project_product_process_id` INT NOT NULL COMMENT '物件工程ID',
  `started_at` DATETIME NULL COMMENT '開始日時',
  `ended_at` DATETIME NULL COMMENT '終了日時',
  `minutes` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '稼働分数',
  `seconds` INT NULL DEFAULT 0 COMMENT '稼働秒数',
  `qty` INT NULL DEFAULT 0 COMMENT '出来上がり数',
  `loss_qty` INT NULL DEFAULT 0 COMMENT 'ロス数',
  `created_m_user_id` INT NOT NULL COMMENT '作成担当者',
  `updated_m_user_id` INT NOT NULL COMMENT '更新担当者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_production_results_t_project_product_process_id_idx` (`t_project_product_process_id` ASC) ,
  INDEX `fk_t_production_results_created_m_userid_idx` (`created_m_user_id` ASC) ,
  INDEX `t_production_results_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  CONSTRAINT `fk_t_production_results_t_project_product_process_id`
    FOREIGN KEY (`t_project_product_process_id`)
    REFERENCES `t_project_product_processes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_results_created_m_userid`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `t_production_results_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '生産実績';

ALTER TABLE `t_production_results` 
ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;

