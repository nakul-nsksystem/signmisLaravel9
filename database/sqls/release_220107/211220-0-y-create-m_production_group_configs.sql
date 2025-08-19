CREATE TABLE `m_production_group_configs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `process_category_m_kv_id` INT NOT NULL COMMENT '加工カテゴリー',
  `default_group_target_01` VARCHAR(45) NULL COMMENT 'デフォルトグループ条件1',
  `default_group_target_02` VARCHAR(45) NULL COMMENT 'デフォルトグループ条件2',
  `default_group_target_03` VARCHAR(45) NULL COMMENT 'デフォルトグループ条件3',
  `default_group_target_04` VARCHAR(45) NULL COMMENT 'デフォルトグループ条件4',
  `default_group_target_05` VARCHAR(45) NULL COMMENT 'デフォルトグループ条件5',
  `updated_m_user_id` INT NOT NULL COMMENT '更新担当者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  INDEX `fk_m_production_group_configs_process_category_m_kv_id_idx` (`process_category_m_kv_id` ASC) ,
  INDEX `fk_m_production_group_configs_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  CONSTRAINT `fk_m_production_group_configs_process_category_m_kv_id`
    FOREIGN KEY (`process_category_m_kv_id`)
    REFERENCES `m_kvs` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_m_production_group_configs_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '生産計画グルーピング設定';

ALTER TABLE `m_production_group_configs` 
ADD COLUMN `m_branch_id` INT NOT NULL COMMENT '拠点ID' AFTER `id`,
ADD INDEX `fk_m_production_group_configs_m_branch_id_idx` (`m_branch_id` ASC) ;

ALTER TABLE `m_production_group_configs` 
ADD CONSTRAINT `fk_m_production_group_configs_m_branch_id`
  FOREIGN KEY (`m_branch_id`)
  REFERENCES `m_branches` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `m_production_group_configs` 
CHANGE COLUMN `default_group_target_01` `group_target_01` VARCHAR(45) NULL DEFAULT NULL COMMENT 'デフォルトグループ条件1' ,
CHANGE COLUMN `default_group_target_02` `group_target_02` VARCHAR(45) NULL DEFAULT NULL COMMENT 'デフォルトグループ条件2' ,
CHANGE COLUMN `default_group_target_03` `group_target_03` VARCHAR(45) NULL DEFAULT NULL COMMENT 'デフォルトグループ条件3' ,
CHANGE COLUMN `default_group_target_04` `group_target_04` VARCHAR(45) NULL DEFAULT NULL COMMENT 'デフォルトグループ条件4' ,
CHANGE COLUMN `default_group_target_05` `group_target_05` VARCHAR(45) NULL DEFAULT NULL COMMENT 'デフォルトグループ条件5' ; 
