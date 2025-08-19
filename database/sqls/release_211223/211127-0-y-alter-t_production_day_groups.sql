ALTER TABLE `t_production_day_groups` 
DROP FOREIGN KEY `fk_t_production_day_groups_t_production_day_id`;
ALTER TABLE `t_production_day_groups` 
CHANGE COLUMN `t_production_day_id` `t_production_day_id` INT NULL ;
ALTER TABLE `t_production_day_groups` 
ADD CONSTRAINT `fk_t_production_day_groups_t_production_day_id`
  FOREIGN KEY (`t_production_day_id`)
  REFERENCES `t_production_days` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
