CREATE TABLE `t_ivt_materials` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `m_branch_id` INT NOT NULL COMMENT '拠点id',
  `m_material_detail_id` INT NOT NULL COMMENT '材料明細id',
  `t_p_invoice_detail_id` INT NULL DEFAULT NULL COMMENT '仕入明細id',
  `t_p_order_detail_id` INT NULL DEFAULT NULL COMMENT '発注明細id',
  `ivt_m_kv_id` INT NOT NULL COMMENT '仕入区分（入出庫棚卸）',
  `conducted_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '実施日',
  `qty` INT NULL DEFAULT 0 COMMENT '数量',
  `price` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '単価',
  `total_price` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '金額',
  `lot_no` VARCHAR(512) NULL DEFAULT NULL COMMENT 'ロットNo',
  `memo` VARCHAR(1024) NULL DEFAULT NULL COMMENT '備考',
  `created_m_user_id` INT NOT NULL COMMENT '作成者id',
  `updated_m_user_id` INT NOT NULL COMMENT '更新者id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  INDEX `fk_t_ivt_materials_m_branch_id_idx` (`m_branch_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_materials_m_material_detail_id_idx` (`m_material_detail_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_materials_t_p_invoice_detail_id_idx` (`t_p_invoice_detail_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_materials_ivt_m_kv_id_idx` (`ivt_m_kv_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_materials_created_m_user_id_idx` (`created_m_user_id` ASC) VISIBLE,
  INDEX `fk_t_ivt_materials_updated_m_user_id_idx` (`updated_m_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_t_ivt_materials_m_branch_id`
    FOREIGN KEY (`m_branch_id`)
    REFERENCES `m_branches` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_materials_m_material_detail_id`
    FOREIGN KEY (`m_material_detail_id`)
    REFERENCES `m_material_details` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_materials_t_p_invoice_detail_id`
    FOREIGN KEY (`t_p_invoice_detail_id`)
    REFERENCES `t_p_invoice_details` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_materials_ivt_m_kv_id`
    FOREIGN KEY (`ivt_m_kv_id`)
    REFERENCES `m_kvs` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_materials_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_ivt_materials_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '材料在庫';
