ALTER TABLE `t_production_results` 
ADD COLUMN `m_production_id` INT NULL COMMENT '生産先ID' AFTER `id`;

ALTER TABLE `t_production_results` 
ADD INDEX `fk_t_production_results_m_production_id_idx` (`m_production_id` ASC) ;

ALTER TABLE `t_production_results` 
ADD CONSTRAINT `fk_t_production_results_m_production_id`
  FOREIGN KEY (`m_production_id`)
  REFERENCES `m_productions` (`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
