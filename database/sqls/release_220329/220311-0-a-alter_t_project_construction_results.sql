ALTER TABLE `t_project_construction_results` 
DROP FOREIGN KEY `fk_t_project_construction_results_t_project_construction_id`;
ALTER TABLE `t_project_construction_results` 
ADD COLUMN `t_project_delivery_id` INT NULL DEFAULT NULL AFTER `id`,
CHANGE COLUMN `t_project_construction_id` `t_project_construction_id` INT NULL COMMENT '物件施工id' ;
ALTER TABLE `t_project_construction_results` 
ADD CONSTRAINT `fk_t_project_construction_results_t_project_construction_id`
  FOREIGN KEY (`t_project_construction_id`)
  REFERENCES `t_project_constructions` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

UPDATE t_project_construction_results , t_project_deliveries
SET t_project_construction_results.t_project_delivery_id = t_project_deliveries.id
WHERE t_project_construction_results.t_project_construction_id= t_project_deliveries.bk_construction_id;


ALTER TABLE `t_project_construction_results` 
DROP FOREIGN KEY `fk_t_project_construction_results_t_project_construction_id`;
ALTER TABLE `t_project_construction_results` 
DROP INDEX `fk_t_project_construction_results_t_project_construction_id_idx` ;
;


ALTER TABLE `t_project_construction_results` 
CHANGE COLUMN `t_project_delivery_id` `t_project_delivery_id` INT NOT NULL ,
ADD INDEX `fk_t_project_construction_results_t_project_deli_id_idx` (`t_project_delivery_id` ASC);
;
ALTER TABLE `t_project_construction_results` 
ADD CONSTRAINT `fk_t_project_construction_results_t_project_deli_id`
  FOREIGN KEY (`t_project_delivery_id`)
  REFERENCES `t_project_deliveries` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
