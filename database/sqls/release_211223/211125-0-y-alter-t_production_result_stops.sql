ALTER TABLE `t_production_result_stops` 
DROP FOREIGN KEY `fk_t_production_result_stops_t_production_result_id`;

ALTER TABLE `t_production_result_stops` 
DROP INDEX `fk_t_production_result_stops_t_production_result_id_idx` ;