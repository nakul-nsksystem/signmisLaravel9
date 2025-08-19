CREATE TABLE `t_project_delivery_product_links` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_delivery_id` INT NOT NULL COMMENT '納品id',
  `t_project_product_id` INT NOT NULL COMMENT '商品id',
  `qty` INT NULL COMMENT '納品数量',
  `created_m_user_id` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_t_project_delivery_product_links_delivery_id_idx` (`t_project_delivery_id` ASC) ,
  INDEX `fk_t_project_delivery_product_links_product_id_idx` (`t_project_product_id` ASC) ,
  UNIQUE INDEX `t_project_delivery_product_links_unique` (`t_project_delivery_id` ASC, `t_project_product_id` ASC) ,
  CONSTRAINT `fk_t_project_delivery_product_links_delivery_id`
    FOREIGN KEY (`t_project_delivery_id`)
    REFERENCES `t_project_deliveries` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_delivery_product_links_product_id`
    FOREIGN KEY (`t_project_product_id`)
    REFERENCES `t_project_products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = '物件納品商品リンク';
