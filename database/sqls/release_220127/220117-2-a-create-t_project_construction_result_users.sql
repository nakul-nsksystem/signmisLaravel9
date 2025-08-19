CREATE TABLE `t_project_construction_result_users` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_construction_result_id` INT NOT NULL COMMENT '物件施工実績id',
  `m_user_id` INT NULL DEFAULT NULL COMMENT '施工担当者ID',
  `out_source_m_customer_id` INT NULL DEFAULT NULL COMMENT '外注先ID',
  `out_source_person_name` VARCHAR(255) NULL DEFAULT NULL COMMENT '外注先担当者',
  `out_source_m_branch_id` INT NULL DEFAULT NULL COMMENT '外注先拠点ID',
  `num_of_out_source_people` INT NULL DEFAULT NULL COMMENT '外注先人数',  
  `out_source_price` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '外注先単価',
  `out_source_total_price` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '外注先金額',
  
  `created_m_user_id` INT NOT NULL COMMENT '作成者id',
  `updated_m_user_id` INT NOT NULL COMMENT '更新者id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',

  PRIMARY KEY (`id`))

COMMENT = '物件施工実績担当者';