CREATE TABLE `m_customer_infos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `m_customer_id` INT NOT NULL,
  `category_m_kv_id` INT NOT NULL COMMENT 'カテゴリ',
  `title` VARCHAR(1024) NOT NULL COMMENT 'タイトル',
  `value` VARCHAR(1024) NULL COMMENT '値',
  `created_m_user_id` INT NOT NULL COMMENT '作成担当者',
  `updated_m_user_id` INT NOT NULL COMMENT '更新担当者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  INDEX `fk_m_customer_infos_m_customer_id_idx` (`m_customer_id` ASC) ,
  INDEX `fk_m_customer_infos_category_m_kv_id_idx` (`category_m_kv_id` ASC) ,
  INDEX `fk_m_customer_infos_updated_m_user_id_idx` (`updated_m_user_id` ASC) ,
  INDEX `fk_m_customer_infos_created_m_user_id_idx` (`created_m_user_id` ASC) ,
  CONSTRAINT `fk_m_customer_infos_m_customer_id`
    FOREIGN KEY (`m_customer_id`)
    REFERENCES `m_customers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_m_customer_infos_category_m_kv_id`
    FOREIGN KEY (`category_m_kv_id`)
    REFERENCES `m_kvs` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_m_customer_infos_created_m_user_id`
    FOREIGN KEY (`created_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_m_customer_infos_updated_m_user_id`
    FOREIGN KEY (`updated_m_user_id`)
    REFERENCES `m_users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
COMMENT = '顧客付加情報マスター';
