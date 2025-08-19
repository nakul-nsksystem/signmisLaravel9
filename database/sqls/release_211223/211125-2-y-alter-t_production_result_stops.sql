ALTER TABLE `t_production_result_stops` 
ADD INDEX `fk_t_production_result_stops_t_production_result_id_idx` (`t_production_result_id` ASC) ;

ALTER TABLE `t_production_result_stops` 
ADD CONSTRAINT `fk_t_production_result_stops_t_production_result_id`
  FOREIGN KEY (`t_production_result_id`)
  REFERENCES `t_production_results` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
