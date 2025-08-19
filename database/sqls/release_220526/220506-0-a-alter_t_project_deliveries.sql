ALTER TABLE `t_project_deliveries` 
DROP FOREIGN KEY `fk_t_project_deliveries_delivery_m_kv_id`;
ALTER TABLE `t_project_deliveries` 
ADD CONSTRAINT `fk_t_project_deliveries_delivery_m_kv_id`
  FOREIGN KEY (`delivery_m_kv_id`)
  REFERENCES `m_kvs` (`id`)
  ON UPDATE CASCADE;
