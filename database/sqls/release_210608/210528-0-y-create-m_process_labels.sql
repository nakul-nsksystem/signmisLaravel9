DROP TABLE IF EXISTS `m_process_labels`;
CREATE TABLE `m_process_labels` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `m_process_category_id` INT NOT NULL,
  `order_no` INT NULL,
  `is_computed_name` VARCHAR(256) NULL COMMENT '使用フラグに該当するComputed名',
  `prefix` VARCHAR(256) NULL COMMENT '接頭辞',
  `postfix` VARCHAR(256) NULL COMMENT '接尾辞',
  `formula` VARCHAR(256) NULL COMMENT '計算式',
  `target_column` VARCHAR(256) NULL COMMENT '書き込み対象のカラム名',
  `memo` VARCHAR(256) NULL,
  `created_at` VARCHAR(256) NULL DEFAULT 'CURRENT_TIMESTAMP',
  `updated_at` VARCHAR(256) NULL DEFAULT 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  PRIMARY KEY (`id`),
  INDEX `fk_m_process_labels_m_process_category_id_idx` (`m_process_category_id` ASC) ,
  CONSTRAINT `fk_m_process_labels_m_process_category_id`
    FOREIGN KEY (`m_process_category_id`)
    REFERENCES `m_process_categories` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
    ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci 
COMMENT = '工程の表示ラベル設定';
