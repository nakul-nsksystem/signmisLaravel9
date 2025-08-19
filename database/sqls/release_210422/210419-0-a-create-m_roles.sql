
--
-- Table structure for table `m_role_details`
--

DROP TABLE IF EXISTS `m_role_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_role_details` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `m_role_id` int NOT NULL COMMENT '権限id',
  `m_role_key_id` int NOT NULL COMMENT '権限キーid',
  `control_level` int NOT NULL DEFAULT '0' COMMENT '権限レベル',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  KEY `m_role_details_idx` (`m_role_id`),
  KEY `fk_m_role_details_m_role_key_id_idx` (`m_role_key_id`),
  CONSTRAINT `fk_m_role_details_m_role_id` FOREIGN KEY (`m_role_id`) REFERENCES `m_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_m_role_details_m_role_key_id` FOREIGN KEY (`m_role_key_id`) REFERENCES `m_role_keys` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='権限詳細';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_role_details`
--

LOCK TABLES `m_role_details` WRITE;
/*!40000 ALTER TABLE `m_role_details` DISABLE KEYS */;
INSERT INTO `m_role_details` VALUES (89,6,1,30,'2021-04-14 19:01:35','2021-04-16 09:34:40',NULL),(90,6,2,30,'2021-04-14 19:01:35','2021-04-16 09:34:40',NULL),(91,6,3,30,'2021-04-14 19:01:35','2021-04-16 09:34:40',NULL),(92,6,4,30,'2021-04-14 19:01:35','2021-04-16 09:34:40',NULL),(93,6,6,30,'2021-04-14 19:01:35','2021-04-16 09:34:40',NULL),(94,6,7,30,'2021-04-14 19:01:35','2021-04-16 09:34:40',NULL),(95,6,5,30,'2021-04-14 19:01:35','2021-04-16 09:34:40','2021-04-16 14:01:14'),(96,6,9,30,'2021-04-14 19:01:35','2021-04-16 09:34:40',NULL),(97,8,1,30,'2021-04-14 19:13:02','2021-04-16 14:18:27',NULL),(98,8,2,10,'2021-04-14 19:13:02','2021-04-15 09:05:08',NULL),(99,8,3,20,'2021-04-14 19:13:02','2021-04-16 14:18:27',NULL),(100,8,4,0,'2021-04-14 19:13:02','2021-04-14 19:13:02',NULL),(101,8,6,0,'2021-04-14 19:13:02','2021-04-14 19:13:02',NULL),(102,8,7,0,'2021-04-14 19:13:02','2021-04-14 19:13:02',NULL),(103,8,5,0,'2021-04-14 19:13:02','2021-04-14 19:13:02','2021-04-16 14:01:14'),(104,8,9,0,'2021-04-14 19:13:02','2021-04-14 19:13:02',NULL),(105,17,1,30,'2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(106,17,2,20,'2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(107,17,3,30,'2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(108,17,4,30,'2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(109,17,6,20,'2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(110,17,7,10,'2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(111,17,5,30,'2021-04-15 09:08:58','2021-04-15 09:08:58','2021-04-16 14:01:14'),(112,17,9,30,'2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(113,8,8,0,'2021-04-15 13:17:54','2021-04-15 13:17:54',NULL),(114,6,8,30,'2021-04-15 13:17:54','2021-04-16 09:34:40',NULL),(115,17,8,10,'2021-04-15 13:17:54','2021-04-16 14:10:47','2021-04-16 14:10:47'),(116,6,11,30,'2021-04-16 13:27:48','2021-04-16 13:27:48',NULL),(117,6,12,30,'2021-04-16 13:27:48','2021-04-16 13:27:48',NULL),(118,6,13,30,'2021-04-16 13:27:48','2021-04-16 13:27:48',NULL),(119,17,11,30,'2021-04-16 14:10:32','2021-04-16 14:10:47','2021-04-16 14:10:47'),(120,17,12,30,'2021-04-16 14:10:32','2021-04-16 14:10:47','2021-04-16 14:10:47'),(121,17,13,30,'2021-04-16 14:10:32','2021-04-16 14:10:47','2021-04-16 14:10:47'),(122,18,1,10,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(123,18,2,0,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(124,18,3,30,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(125,18,4,30,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(126,18,6,30,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(127,18,7,10,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(128,18,8,0,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(129,18,9,30,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(130,18,11,0,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(131,18,12,30,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(132,18,13,0,'2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(133,8,11,0,'2021-04-16 14:18:27','2021-04-16 14:18:27',NULL),(134,8,12,0,'2021-04-16 14:18:27','2021-04-16 14:18:27',NULL),(135,8,13,0,'2021-04-16 14:18:27','2021-04-16 14:18:27',NULL),(136,6,14,0,'2021-04-16 15:43:35','2021-04-16 15:43:35',NULL),(137,19,1,10,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(138,19,2,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(139,19,3,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(140,19,14,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(141,19,4,10,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(142,19,6,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(143,19,7,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(144,19,8,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(145,19,9,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(146,19,11,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(147,19,12,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL),(148,19,13,0,'2021-04-16 16:45:55','2021-04-16 16:45:55',NULL);
/*!40000 ALTER TABLE `m_role_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_role_key_categories`
--

DROP TABLE IF EXISTS `m_role_key_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_role_key_categories` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `order_no` int DEFAULT NULL COMMENT '表示順',
  `name` varchar(1024) NOT NULL COMMENT 'キーカテゴリ名称',
  `explanation` varchar(1024) DEFAULT NULL COMMENT '説明',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='権限キーカテゴリ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_role_key_categories`
--

LOCK TABLES `m_role_key_categories` WRITE;
/*!40000 ALTER TABLE `m_role_key_categories` DISABLE KEYS */;
INSERT INTO `m_role_key_categories` VALUES (1,10,'t_project-role','物件関係','2021-04-09 11:36:05','2021-04-09 11:36:05',NULL),(2,20,'t_product_control-role','生産管理関係','2021-04-09 11:36:05','2021-04-09 11:36:05',NULL),(3,30,'t_p_order-role','発注関係','2021-04-09 11:41:09','2021-04-09 11:41:09',NULL),(4,40,'t_p_invoice-role','仕入関係','2021-04-09 11:41:09','2021-04-09 11:41:09',NULL),(5,50,'sales-role','売上関係','2021-04-09 11:41:09','2021-04-09 11:41:09',NULL),(6,60,'inventory-role','在庫関係','2021-04-09 11:41:09','2021-04-09 11:41:09',NULL),(7,70,'rel-role','SS連携関係','2021-04-09 11:41:09','2021-04-09 11:41:09',NULL),(8,80,'master-role','マスタ関係','2021-04-09 11:41:09','2021-04-09 11:41:09',NULL);
/*!40000 ALTER TABLE `m_role_key_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_role_keys`
--

DROP TABLE IF EXISTS `m_role_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_role_keys` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `m_role_key_category_id` int DEFAULT NULL COMMENT '権限キーカテゴリ',
  `order_no` int DEFAULT NULL COMMENT '表示順',
  `name` varchar(1024) NOT NULL COMMENT 'key名称',
  `explanation` varchar(1024) DEFAULT NULL COMMENT '説明',
  `system_flg` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'システム使用フラグ',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  KEY `fk_m_role_keys_m_role_key_category_id_idx` (`m_role_key_category_id`),
  CONSTRAINT `fk_m_role_keys_m_role_key_category_id` FOREIGN KEY (`m_role_key_category_id`) REFERENCES `m_role_key_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='権限キー';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_role_keys`
--

LOCK TABLES `m_role_keys` WRITE;
/*!40000 ALTER TABLE `m_role_keys` DISABLE KEYS */;
INSERT INTO `m_role_keys` VALUES (1,1,10,'t_project-privilege','物件アクセス権',1,'2021-04-06 14:59:28','2021-04-06 14:59:28',NULL),(2,2,20,'t_production_control-privilege','生産管理アクセス権',1,'2021-04-06 16:40:48','2021-04-06 16:43:21',NULL),(3,3,30,'t_p_order-privilege','発注アクセス権',1,'2021-04-06 16:42:44','2021-04-06 16:42:44',NULL),(4,4,40,'t_p_invoice-privilege','仕入アクセス権',1,'2021-04-06 16:42:58','2021-04-07 14:56:56',NULL),(5,8,80,'master-privilege','マスタアクセス権',0,'2021-04-06 16:43:09','2021-04-16 14:01:14','2021-04-16 14:01:14'),(6,5,50,'sales-privilege','売上アクセス権',1,'2021-04-07 14:50:28','2021-04-09 10:18:39',NULL),(7,6,60,'inventory-privilege','在庫アクセス権',1,'2021-04-07 14:53:21','2021-04-15 13:20:29',NULL),(8,7,70,'rel-privilege','SS連携アクセス権',1,'2021-04-07 14:54:11','2021-04-15 13:18:17',NULL),(9,8,81,'m_material_master-privilege','材料マスタアクセス権',1,'2021-04-08 09:14:04','2021-04-12 14:45:16',NULL),(10,1,11,'t_project-display','画面表示あ',1,'2021-04-15 11:26:44','2021-04-15 11:27:20','2021-04-15 11:27:20'),(11,8,82,'m_user_master-privilege','ユーザーマスタアクセス権',1,'2021-04-16 13:24:42','2021-04-16 13:24:42',NULL),(12,8,83,'m_customer_master-privilege','取引先マスタアクセス権',1,'2021-04-16 13:25:59','2021-04-16 13:25:59',NULL),(13,8,84,'m_role_master-privilege','権限マスタアクセス権',1,'2021-04-16 13:27:11','2021-04-16 13:27:11',NULL),(14,3,31,'t_p_order-approve','発注承認',0,'2021-04-16 15:39:05','2021-04-16 15:39:05',NULL);
/*!40000 ALTER TABLE `m_role_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_role_users`
--

DROP TABLE IF EXISTS `m_role_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_role_users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `m_role_id` int NOT NULL COMMENT '権限id',
  `m_user_id` int NOT NULL COMMENT 'ユーザーid',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  KEY `m_role_users_ibfk_2` (`m_user_id`),
  KEY `m_role_users_ibfk_3` (`m_role_id`),
  CONSTRAINT `m_role_users_ibfk_2` FOREIGN KEY (`m_user_id`) REFERENCES `m_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `m_role_users_ibfk_3` FOREIGN KEY (`m_role_id`) REFERENCES `m_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='ロールユーザー';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_role_users`
--

LOCK TABLES `m_role_users` WRITE;
/*!40000 ALTER TABLE `m_role_users` DISABLE KEYS */;
INSERT INTO `m_role_users` VALUES (57,6,3,'2021-04-09 11:11:19','2021-04-09 11:11:19'),(59,6,2,'2021-04-09 11:11:43','2021-04-09 11:11:43'),(73,8,303,'2021-04-16 15:37:05','2021-04-16 15:37:05'),(74,18,303,'2021-04-16 15:37:05','2021-04-16 15:37:05'),(75,6,303,'2021-04-16 15:37:05','2021-04-16 15:37:05');
/*!40000 ALTER TABLE `m_role_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_roles`
--

DROP TABLE IF EXISTS `m_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_roles` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(1024) DEFAULT NULL COMMENT '権限名',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='権限';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_roles`
--

LOCK TABLES `m_roles` WRITE;
/*!40000 ALTER TABLE `m_roles` DISABLE KEYS */;
INSERT INTO `m_roles` VALUES (6,'全権','2021-04-07 09:33:40','2021-04-09 10:17:23',NULL),(8,'営業','2021-04-07 09:43:00','2021-04-07 09:43:00',NULL),(17,'テスト','2021-04-15 09:08:58','2021-04-16 14:10:47','2021-04-16 14:10:47'),(18,'事務','2021-04-16 14:17:46','2021-04-16 14:17:46',NULL),(19,'テス','2021-04-16 16:45:55','2021-04-16 16:45:55',NULL);
/*!40000 ALTER TABLE `m_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-19 13:30:45
