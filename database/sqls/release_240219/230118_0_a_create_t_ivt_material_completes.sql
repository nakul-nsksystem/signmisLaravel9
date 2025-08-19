CREATE TABLE `t_ivt_material_completes` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `m_material_detail_id` INT NOT NULL COMMENT '材料明細id',
  `t_ivt_material_id` INT NOT NULL COMMENT '材料在庫id',
  `qty` INT NULL DEFAULT 0 COMMENT '残数',
  `total_price` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '合計金額',
  `completed_at` DATETIME NOT NULL COMMENT '締実行日',
  `created_m_user_id` INT NOT NULL COMMENT '作成者id',
  `updated_m_user_id` INT NOT NULL COMMENT '更新者id',
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_ivt_material_completes_created_m_user_id_idx` (`created_m_user_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_material_completes_updated_m_user_id_idx` (`updated_m_user_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_material_completes_m_material_detail_id_idx` (`m_material_detail_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_material_completes_t_ivt_material_id_idx` (`t_ivt_material_id` ASC) VISIBLE,
  CONSTRAINT `fk_t_ivt_material_completes_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_material_completes_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_material_completes_m_material_detail_id`
    FOREIGN KEY (`m_material_detail_id`)
    REFERENCES `m_material_details` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_material_completes_t_ivt_material_id`
    FOREIGN KEY (`t_ivt_material_id`)
    REFERENCES `t_ivt_materials` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = '材料在庫締';
