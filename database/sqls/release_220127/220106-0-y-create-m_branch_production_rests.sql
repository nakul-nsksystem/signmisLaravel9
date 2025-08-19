CREATE TABLE `m_branch_production_rests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `m_branch_id` INT NOT NULL COMMENT '拠点ID',
  `started_at` TIME NULL COMMENT '休憩開始時刻',
  `ended_at` TIME NULL COMMENT '休憩開始時刻',
  `memo` VARCHAR(256) NULL,
  `created_m_user_id` INT NOT NULL COMMENT '作成担当者',
  `updated_m_user_id` INT NOT NULL COMMENT '更新担当者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  INDEX `fk_m_branch_production_rests_m_branch_id_idx` (`m_branch_id` ASC) ,
  INDEX `fk_m_branch_production_rests_created_m_user_id_idx` (`created_m_user_id` ASC) ,
  INDEX `fk_m_branch_production_rests_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  CONSTRAINT `fk_m_branch_production_rests_m_branch_id`
    FOREIGN KEY (`m_branch_id`)
    REFERENCES `m_branches` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_m_branch_production_rests_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_m_branch_production_rests_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '拠点休憩時間設定';


ALTER TABLE `m_branch_production_rests` 
ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;
