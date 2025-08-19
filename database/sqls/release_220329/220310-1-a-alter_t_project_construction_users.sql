ALTER TABLE `t_project_construction_users` 
DROP FOREIGN KEY `fk_t_project_construction_users_t_project_construction_id`;
ALTER TABLE `t_project_construction_users` 
ADD COLUMN `t_project_delivery_id` INT NULL AFTER `id`,
CHANGE COLUMN `t_project_construction_id` `t_project_construction_id` INT NULL ;
ALTER TABLE `t_project_construction_users` 
ADD CONSTRAINT `fk_t_project_construction_users_t_project_construction_id`
  FOREIGN KEY (`t_project_construction_id`)
  REFERENCES `t_project_constructions` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE `t_project_construction_users` 
DROP FOREIGN KEY `fk_t_project_construction_users_t_project_construction_id`;

ALTER TABLE `t_project_construction_users` 	
DROP INDEX `t_project_construction_id_idx` ;
;


UPDATE t_project_construction_users , t_project_deliveries
SET t_project_construction_users .t_project_delivery_id = t_project_deliveries.id
WHERE t_project_construction_users .t_project_construction_id= t_project_deliveries.bk_construction_id;



ALTER TABLE `t_project_construction_users` 
ADD INDEX `fk_t_project_construction_users_t_project_delivery_id_idx` (`t_project_delivery_id` ASC);
;

ALTER TABLE `t_project_construction_users` 
CHANGE COLUMN `t_project_delivery_id` `t_project_delivery_id` INT NOT NULL ;
ALTER TABLE `t_project_construction_users` 
ADD CONSTRAINT `fk_t_project_construction_users_t_project_delivery_id`
  FOREIGN KEY (`t_project_delivery_id`)
  REFERENCES `t_project_deliveries` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

