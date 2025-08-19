CREATE TABLE `sm_options` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key_m_kv_id` INT NOT NULL,
  `value` VARCHAR(1024) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_sm_options_key_m_kv_id_idx` (`key_m_kv_id` ASC) ,
  CONSTRAINT `fk_sm_options_key_m_kv_id`
    FOREIGN KEY (`key_m_kv_id`)
    REFERENCES `m_kvs` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = 'システムオプション設定';

ALTER TABLE `sm_options` 
CHANGE COLUMN `created_at` `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `updated_at` `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;
