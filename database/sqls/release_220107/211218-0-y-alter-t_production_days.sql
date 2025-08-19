ALTER TABLE `t_production_days` 
ADD COLUMN `process_category_m_kv_id` INT NOT NULL AFTER `day`;

ALTER TABLE `t_production_days` 
ADD INDEX `fk_t_production_days_process_category_m_kv_id_idx` (`process_category_m_kv_id` ASC) ;

ALTER TABLE `t_production_days` 
ADD CONSTRAINT `fk_t_production_days_process_category_m_kv_id`
  FOREIGN KEY (`process_category_m_kv_id`)
  REFERENCES `m_kvs` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;


ALTER TABLE `t_production_days` 
DROP FOREIGN KEY `fk_t_production_days_`;
ALTER TABLE `t_production_days` 
ADD INDEX `fk_t_production_days_process_category_m_kv_id_idx` (`process_category_m_kv_id` ASC) ;

ALTER TABLE `t_production_days` 
ADD CONSTRAINT `fk_t_production_days_m_production_id`
  FOREIGN KEY (`m_production_id`)
  REFERENCES `m_productions` (`id`)
  ON UPDATE CASCADE ; 

ALTER TABLE `t_production_days` 
ADD INDEX `fk_t_production_days_m_production_id_idx` (`m_production_id` ASC) ;

ALTER TABLE `t_production_days` 
ADD UNIQUE INDEX `idx_t_production_day_unique` (`m_production_id` ASC, `day` ASC, `process_category_m_kv_id` ASC) ;


