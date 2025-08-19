ALTER TABLE `t_project_product_processes` 
ADD COLUMN `target_t_project_product_id` INT NULL COMMENT '貼りなどの対象商品ID' AFTER `is_ordered`;

ALTER TABLE `t_project_product_processes` 
ADD INDEX `fk_t_project_product_processes_target_t_project_product_id_idx` (`target_t_project_product_id` ASC) ;
;
ALTER TABLE `t_project_product_processes` 
ADD CONSTRAINT `fk_t_project_product_processes_target_t_project_product_id`
  FOREIGN KEY (`target_t_project_product_id`)
  REFERENCES `t_project_products` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
