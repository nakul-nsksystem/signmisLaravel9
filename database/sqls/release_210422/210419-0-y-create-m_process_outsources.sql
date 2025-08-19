
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: signmis
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `m_process_outsources`
--

DROP TABLE IF EXISTS `m_process_outsources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_process_outsources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `m_process_category_id` int NOT NULL,
  `order_no` int DEFAULT NULL,
  `name` varchar(255)  DEFAULT NULL,
  `enabled_is_column` varchar(255)  DEFAULT NULL COMMENT '有効かを判断するカラム名',
  `is_price_ref_from_m_production` tinyint(1) DEFAULT NULL COMMENT '0: カラム 1:MProduction.cost_per_hourを使用 ',
  `price_column` varchar(255)  DEFAULT NULL COMMENT '単価を取得するカラム名',
  `rate_type_m_kv_id` int DEFAULT NULL COMMENT '掛け率値参照タイプ\\n1:カラム 2:マトリクス',
  `rate_value` varchar(255)  DEFAULT NULL COMMENT '掛け率値',
  `unit_name` varchar(45)  DEFAULT NULL COMMENT '単位(表示用)',
  `additional_value` decimal(15,4) DEFAULT NULL COMMENT '固定追加値',
  `is_ignore_qty` tinyint(1) DEFAULT '0' COMMENT '数量無視 ( 一式などの場合は 1 ) ',
  `memo` varchar(1024)  DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日' ,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  KEY `fk_m_process_outsources_m_process_category_id_idx` (`m_process_category_id`),
  KEY `fk_m_process_outsources_rate_type_m_kv_id_idx` (`rate_type_m_kv_id`),
  CONSTRAINT `fk_m_process_outsources_m_process_category_id` FOREIGN KEY (`m_process_category_id`) REFERENCES `m_process_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_m_process_outsources_rate_type_m_kv_id` FOREIGN KEY (`rate_type_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='工程カテゴリーの外注費設定';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_process_outsources`
--

LOCK TABLES `m_process_outsources` WRITE;
/*!40000 ALTER TABLE `m_process_outsources` DISABLE KEYS */;
INSERT INTO `m_process_outsources` VALUES (5,2,1,'コーティング',NULL,1,NULL,9010002,'sqmIncExt','㎡',NULL,0,NULL,'2021-02-26 20:15:07','2021-03-13 17:49:46'),(6,22,1,'外注',NULL,NULL,NULL,9010002,'sqm','㎡',NULL,0,NULL,'2021-02-27 11:35:36','2021-02-27 11:35:36'),(7,17,1,'仕入',NULL,NULL,'outsource_cost_by_input',9010003,'outsource_qty',NULL,NULL,0,NULL,'2021-03-17 18:14:51','2021-03-17 18:14:51'),(8,20,1,'外注',NULL,NULL,'outsource_cost_by_input',9010001,NULL,'式',NULL,1,NULL,'2021-03-24 21:59:59','2021-03-24 22:09:00');
/*!40000 ALTER TABLE `m_process_outsources` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-19 16:16:24
