CREATE TABLE `t_production_day_groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `t_production_day_id` INT NOT NULL,
  `parent_t_production_day_group_id` INT NULL COMMENT '親のID',
  `level` INT NOT NULL DEFAULT 0 COMMENT '階層',
  `key` VARCHAR(256) NULL COMMENT 'グループキー',
  `group_no` INT NULL COMMENT '同一キーのグループNo',
  `order_no` INT NULL COMMENT 'グループの並び',
  `uid` VARCHAR(256) NULL COMMENT 'グループ uid',
  `created_m_user_id` INT NOT NULL COMMENT '作成担当者',
  `updated_m_user_id` INT NOT NULL COMMENT '更新担当者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_production_day_groups_created_m_userid_idx` (`created_m_user_id` ASC) ,
  INDEX `fk_t_production_day_groups_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  INDEX `fk_t_production_day_groups_t_production_day_id_idx` (`t_production_day_id` ASC) ,
  CONSTRAINT `fk_t_production_day_groups_created_m_userid`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_day_groups_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_production_day_groups_t_production_day_id`
    FOREIGN KEY (`t_production_day_id`)
    REFERENCES `t_production_days` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = '生産計画グループ';

ALTER TABLE `t_production_day_groups` 
ADD INDEX `fk_t_production_day_groups_parent_id_idx` (`parent_t_production_day_group_id` ASC) ;

ALTER TABLE `t_production_day_groups` 
ADD CONSTRAINT `fk_t_production_day_groups_parent_id`
  FOREIGN KEY (`parent_t_production_day_group_id`)
  REFERENCES `t_production_day_groups` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
