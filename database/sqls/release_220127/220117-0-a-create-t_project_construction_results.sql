CREATE TABLE `t_project_construction_results` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_construction_id` INT NOT NULL COMMENT '物件施工id',
  `result_start_time` TIME NOT NULL COMMENT '実開始時間',
  `result_end_time` TIME NOT NULL COMMENT '実終了時間',
  `cost` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '経費',
  `memo` VARCHAR(1024) NULL DEFAULT NULL COMMENT '備考',
  `created_m_user_id` INT NOT NULL COMMENT '作成者id',
  `updated_m_user_id` INT NOT NULL COMMENT '更新者id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`))

COMMENT = '物件施工実績';
