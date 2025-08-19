ALTER TABLE `t_production_results` 
DROP FOREIGN KEY `t_production_results_updated_m_user_id`;
ALTER TABLE `t_production_results` 
ADD COLUMN `t_production_day_group_id` INT NULL AFTER `id`,
ADD INDEX `fk_t_production_results_t_production_day_group_id_idx` (`t_production_day_group_id` ASC) ;

ALTER TABLE `t_production_results` 
ADD CONSTRAINT `fk_t_production_results_updated_m_user_id`
  FOREIGN KEY (`updated_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_production_results_t_production_day_group_id`
  FOREIGN KEY (`t_production_day_group_id`)
  REFERENCES `t_production_day_groups` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
