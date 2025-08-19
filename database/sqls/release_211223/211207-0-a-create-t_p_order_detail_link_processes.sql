CREATE TABLE `t_project_product_process_order_details` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `t_project_product_process_id` int NOT NULL COMMENT '工程id',
  `t_p_order_detail_id` int NOT NULL COMMENT '発注明細id',
  `order_no` int DEFAULT NULL COMMENT '並び順',
  `is_preceding` tinyint(1) DEFAULT '0' COMMENT '先行発注フラグ',
  `memo` varchar(1024) DEFAULT NULL COMMENT '備考',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '作成時間',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`),
  KEY `fk_t_p_order_detail_link_processes_t_p_order_detail_id_idx` (`t_p_order_detail_id`),
  KEY `fk_t_p_order_detail_link_processes_t_project_product_proces_idx` (`t_project_product_process_id`),
  CONSTRAINT `fk_t_p_order_detail_link_processes_t_p_order_detail_id` FOREIGN KEY (`t_p_order_detail_id`) REFERENCES `t_p_order_details` (`id`),
  CONSTRAINT `fk_t_p_order_detail_link_processes_t_project_product_process_id` FOREIGN KEY (`t_project_product_process_id`) REFERENCES `t_project_product_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='発注物件連動リンク';
