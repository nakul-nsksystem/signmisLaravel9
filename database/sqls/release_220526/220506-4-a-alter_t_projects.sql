ALTER TABLE `t_projects` 
DROP FOREIGN KEY `fk_t_projects_estimate_delivery_m_kv_id`;
ALTER TABLE `t_projects` 
ADD CONSTRAINT `fk_t_projects_estimate_delivery_m_kv_id`
  FOREIGN KEY (`estimate_delivery_m_kv_id`)
  REFERENCES `m_kvs` (`id`)
  ON UPDATE CASCADE;
