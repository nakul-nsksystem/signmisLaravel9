ALTER TABLE `t_p_order_details` 
ADD COLUMN `t_project_product_process_id` INT NULL DEFAULT NULL COMMENT '物件商品工程id' AFTER `t_project_id`,
ADD INDEX `fk_t_p_order_details_t_project_product_process_id_idx` (`t_project_product_process_id` ASC) ;

ALTER TABLE `t_p_order_details` 
ADD CONSTRAINT `fk_t_p_order_details_t_project_product_process_id`
  FOREIGN KEY (`t_project_product_process_id`)
  REFERENCES `t_project_product_processes` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;