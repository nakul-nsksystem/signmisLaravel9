CREATE TABLE `t_project_delivery_m_tags` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_delivery_id` int NOT NULL COMMENT '物件納品id',
  `m_tag_id` int NOT NULL COMMENT 'tagid',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '作成時間',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`),
  KEY `fk_t_project_delivery_m_tags_t_project_delivery_id_idx` (`t_project_delivery_id`),
  KEY `fk_t_project_delivery_m_tags_m_tag_id_idx` (`m_tag_id`),
  CONSTRAINT `fk_t_project_delivery_m_tags_t_project_delivery_id` FOREIGN KEY (`t_project_delivery_id`) REFERENCES `t_project_deliveries` (`id`),
  CONSTRAINT `fk_t_project_delivery_m_tags_m_tag_id` FOREIGN KEY (`m_tag_id`) REFERENCES `m_tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='物件納品タグリンク';