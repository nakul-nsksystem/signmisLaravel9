DROP TABLE IF EXISTS `t_project_construction_users`;
CREATE TABLE `t_project_construction_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `t_project_construction_id` int NOT NULL,
  `m_user_id` int DEFAULT NULL COMMENT '施工担当者ID',
  `out_source_m_customer_id` int DEFAULT NULL COMMENT '外注先ID',
  `out_source_person_name` varchar(255) DEFAULT NULL,
  `out_source_m_branch_id` int DEFAULT NULL COMMENT '外注先拠点ID',
  `num_of_out_source_people` int DEFAULT NULL COMMENT '外注先人数',
  `out_source_price` decimal(15,4) DEFAULT '0.0000' COMMENT '外注先単価',
  `out_source_total_price` decimal(15,4) DEFAULT '0.0000' COMMENT '外注先金額',
  `created_m_user_id` int DEFAULT NULL COMMENT '作成担当者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `t_project_construction_id_idx` (`t_project_construction_id`),
  KEY `t_project_constructionm_user_id_idx` (`m_user_id`),
  KEY `t_project_construction_out_source_m_kv_id_idx` (`out_source_m_customer_id`),
  KEY `t_project_construction_out_source_m_branch_id_idx` (`out_source_m_branch_id`),
  KEY `t_project_construction_users_created_m_user_id_idx` (`created_m_user_id`),
  CONSTRAINT `fk_t_project_construction_users_created_m_user_id` FOREIGN KEY (`created_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_construction_users_m_user_id` FOREIGN KEY (`m_user_id`) REFERENCES `m_users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_construction_users_out_source_m_branch_id` FOREIGN KEY (`out_source_m_branch_id`) REFERENCES `m_branches` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_construction_users_out_source_m_customer_id` FOREIGN KEY (`out_source_m_customer_id`) REFERENCES `m_customers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_construction_users_t_project_construction_id` FOREIGN KEY (`t_project_construction_id`) REFERENCES `t_project_constructions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='物件施工ユーザー/外注';

-- ----------------------------