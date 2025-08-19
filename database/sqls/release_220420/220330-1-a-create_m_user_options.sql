CREATE TABLE `m_user_options` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `m_user_id` INT NOT NULL,
  `sm_user_option_id` INT NOT NULL,
  `name` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'オプション名称(ユーザーが名づけ)',
  `value` VARCHAR(1024) NULL DEFAULT NULL COMMENT '設定値',
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`))
COMMENT = 'ユーザー個別設定';
