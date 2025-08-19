DROP TABLE IF EXISTS `t_project_deliveries`;
CREATE TABLE `t_project_deliveries` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_id` int NOT NULL COMMENT 't_project_id',
  `delivery_m_kv_id` int NOT NULL COMMENT 'delivery_m_kv_id',
  `delivery_at` varchar(255) DEFAULT NULL COMMENT '納期（発送日）',
  `delivery_time` varchar(1024) DEFAULT NULL COMMENT '納期時間',
  `num_of_boxes` int DEFAULT NULL COMMENT '個口',
  `memo` varchar(1024) DEFAULT NULL COMMENT '備考',
  `delivery_customer_name` varchar(1024) DEFAULT NULL COMMENT '納品先名',
  `delivery_customer_address` varchar(1024) DEFAULT NULL COMMENT '納品先住所',
  `delivery_customer_user` varchar(1024) DEFAULT NULL COMMENT '納品先担当者',
  `delivery_customer_tel` varchar(1024) DEFAULT NULL COMMENT '納品先tel',
  `delivery_owner_name` varchar(1024) DEFAULT NULL COMMENT '荷主名',
  `delivery_owner_address` varchar(1024) DEFAULT NULL COMMENT '荷主住所',
  `delivery_owner_tel` varchar(1024) DEFAULT NULL COMMENT '荷主tel',
  `created_m_user_id` int DEFAULT NULL COMMENT '作成userid',
  `updated_m_user_id` int DEFAULT NULL COMMENT '更新userid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  KEY `fk_t_project_deliveries_t_project_id_idx` (`t_project_id`),
  KEY `fk_t_project_deliveries_delivery_m_kv_id_idx` (`delivery_m_kv_id`),
  CONSTRAINT `fk_t_project_deliveries_delivery_m_kv_id` FOREIGN KEY (`delivery_m_kv_id`) REFERENCES `m_kvs` (`id`),
  CONSTRAINT `fk_t_project_deliveries_t_project_id` FOREIGN KEY (`t_project_id`) REFERENCES `t_projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='物件納品情報';

