CREATE TABLE `t_project_construction_result_pictures` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_construction_result_id` INT NOT NULL COMMENT '物件施工実績id',
  `filename` VARCHAR(255) NULL DEFAULT NULL COMMENT 'ファイル名',
  `filepath` VARCHAR(255) NULL DEFAULT NULL COMMENT 'ファイルパス',
  `memo` VARCHAR(1024) NULL DEFAULT NULL COMMENT '備考',
  `created_m_user_id` INT NOT NULL COMMENT '作成者id',
  `updated_m_user_id` INT NOT NULL COMMENT '更新者id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日',

  PRIMARY KEY (`id`))

COMMENT = '物件施工実績写真';