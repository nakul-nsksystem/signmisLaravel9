
ALTER TABLE `t_production_result_users` 
DROP FOREIGN KEY `t_production_result_users_t_production_result_id`;
ALTER TABLE `t_production_result_users` 
DROP INDEX `fk_t_production_users_t_production_result_id_idx` ;
