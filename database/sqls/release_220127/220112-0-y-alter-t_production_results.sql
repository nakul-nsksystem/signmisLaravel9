ALTER TABLE `t_production_results` 
DROP FOREIGN KEY `fk_t_production_results_t_production_process_plans_id`;
ALTER TABLE `t_production_results` 
DROP INDEX `fk_t_production_results_t_production_process_plans_id_idx` ;



ALTER TABLE `t_production_results` 
CHANGE COLUMN `t_production_process_plans_id` `t_project_product_process_id` INT NULL DEFAULT NULL COMMENT '物件工程ID' ;


ALTER TABLE `t_production_results` 
ADD INDEX `fk_t_production_results_t_project_product_process_id_idx` (`t_project_product_process_id` ASC) ;

ALTER TABLE `t_production_results` 
ADD CONSTRAINT `fk_t_production_results_t_project_product_process_id`
  FOREIGN KEY (`t_project_product_process_id`)
  REFERENCES `t_project_product_processes` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
