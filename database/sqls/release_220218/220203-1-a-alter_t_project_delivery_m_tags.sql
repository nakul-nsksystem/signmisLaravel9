ALTER TABLE `t_project_delivery_m_tags` 
DROP FOREIGN KEY `fk_t_project_delivery_m_tags_m_tag_id`,
DROP FOREIGN KEY `fk_t_project_delivery_m_tags_t_project_delivery_id`;
ALTER TABLE `t_project_delivery_m_tags` 
ADD CONSTRAINT `fk_t_project_delivery_m_tags_m_tag_id`
  FOREIGN KEY (`m_tag_id`)
  REFERENCES `m_tags` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_delivery_m_tags_t_project_delivery_id`
  FOREIGN KEY (`t_project_delivery_id`)
  REFERENCES `t_project_deliveries` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
