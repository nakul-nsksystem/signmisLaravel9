CREATE TABLE `t_project_product_estimate_details` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_product_id` INT NOT NULL COMMENT '物件商品id',
  `content` VARCHAR(1024) NULL DEFAULT NULL COMMENT '内容',
  `qty` INT NULL DEFAULT 0 COMMENT '数量',
  `unit_m_kv_id` INT NULL DEFAULT NULL COMMENT '単位kv_id',
  `created_m_user_id` INT NOT NULL,
  `updated_m_user_id` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `t_project_product_estimate_details_t_project_product_id_idx` (`t_project_product_id` ASC),
  CONSTRAINT `t_project_product_estimate_details_t_project_product_id`
    FOREIGN KEY (`t_project_product_id`)
    REFERENCES `t_project_products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = '物件見積り明細行';
