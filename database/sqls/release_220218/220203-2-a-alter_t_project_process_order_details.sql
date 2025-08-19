ALTER TABLE `t_project_product_process_order_details` 
DROP FOREIGN KEY `fk_t_p_order_detail_link_processes_t_p_order_detail_id`,
DROP FOREIGN KEY `fk_t_p_order_detail_link_processes_t_project_product_process_id`;
ALTER TABLE `t_project_product_process_order_details` 
ADD CONSTRAINT `fk_t_p_order_detail_link_processes_t_p_order_detail_id`
  FOREIGN KEY (`t_p_order_detail_id`)
  REFERENCES `t_p_order_details` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_p_order_detail_link_processes_t_project_product_process_id`
  FOREIGN KEY (`t_project_product_process_id`)
  REFERENCES `t_project_product_processes` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;