ALTER TABLE `t_ivt_materials` 
ADD COLUMN `supplier_m_customer_id` INT NOT NULL AFTER `m_branch_id`,
ADD INDEX `fk_t_ivt_materials_supplier_m_customer_id_idx` (`supplier_m_customer_id` ASC) VISIBLE;
ALTER TABLE `t_ivt_materials` 
ADD CONSTRAINT `fk_t_ivt_materials_supplier_m_customer_id`
  FOREIGN KEY (`supplier_m_customer_id`)
  REFERENCES `m_customers` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
