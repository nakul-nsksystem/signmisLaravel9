CREATE TABLE `m_customer_persons` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `m_customer_id` INT NOT NULL COMMENT '取引先id',
  `name` VARCHAR(1024) NULL DEFAULT NULL COMMENT '担当者名',
  `email` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'email',
  `position` VARCHAR(1024) NULL DEFAULT NULL COMMENT '役職',
  `memo` VARCHAR(1024) NULL DEFAULT NULL COMMENT '備考',
  `created_m_user_id` INT NOT NULL COMMENT '作成者id',
  `updated_m_user_id` INT NOT NULL COMMENT '更新者id',
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  INDEX `fk_m_customer_persons_m_customer_id_idx` (`m_customer_id` ASC) ,
  CONSTRAINT `fk_m_customer_persons_m_customer_id`
    FOREIGN KEY (`m_customer_id`)
    REFERENCES `m_customers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = '取引先担当者';

