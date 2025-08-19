ALTER TABLE `m_customers` 
ADD COLUMN `mailing_type_m_kv_id` INT NULL DEFAULT NULL COMMENT '請求書検収書郵送区分' AFTER `accounts_title_m_kv_id`,
ADD INDEX `fk_m_customers_mailng_type_m_kv_id_idx` (`mailing_type_m_kv_id` ASC) VISIBLE;
ALTER TABLE `m_customers` 
ADD CONSTRAINT `fk_m_customers_mailng_type_m_kv_id`
  FOREIGN KEY (`mailing_type_m_kv_id`)
  REFERENCES `m_kvs` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
