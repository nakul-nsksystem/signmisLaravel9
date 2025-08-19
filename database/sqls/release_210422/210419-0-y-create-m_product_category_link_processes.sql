
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
-- Table structure for table `m_product_category_link_processes`
--

DROP TABLE IF EXISTS `m_product_category_link_processes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_product_category_link_processes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `m_product_category_id` int NOT NULL COMMENT '商品分類ID',
  `m_process_category_id` int NOT NULL COMMENT '工程カテゴリーID',
  `is_default_on` tinyint(1) NOT NULL COMMENT '1:デフォルトON ',
  `is_required` tinyint(1) DEFAULT NULL COMMENT '1:必須',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  KEY `fk_m_product_category_link_processes_m_product_category_id_idx` (`m_product_category_id`),
  KEY `fk_m_product_category_link_processes_m_process_category_id_idx` (`m_process_category_id`),
  CONSTRAINT `fk_m_product_category_link_processes_m_process_category_id` FOREIGN KEY (`m_process_category_id`) REFERENCES `m_process_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_m_product_category_link_processes_m_product_category_id` FOREIGN KEY (`m_product_category_id`) REFERENCES `m_product_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='商品カテゴリーに関連する工程カテゴリーのリンクテーブル';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_product_category_link_processes`
--

LOCK TABLES `m_product_category_link_processes` WRITE;
/*!40000 ALTER TABLE `m_product_category_link_processes` DISABLE KEYS */;
INSERT INTO `m_product_category_link_processes` VALUES (6,1,1,1,0,'2020-09-01 18:34:27','2020-09-01 18:34:27'),(7,1,2,0,0,'2020-09-01 18:34:27','2020-09-01 18:34:27'),(8,1,4,1,0,'2020-09-01 18:34:27','2020-09-01 18:34:27'),(9,1,6,0,1,'2020-09-01 20:20:28','2020-09-01 20:20:31'),(13,2,6,0,1,'2020-09-01 20:20:39','2020-09-01 20:20:41'),(14,2,1,1,0,'2020-09-01 20:20:41','2020-09-01 20:20:41'),(15,2,3,0,0,'2020-09-01 20:20:41','2020-09-01 20:20:41'),(16,1,5,1,0,'2020-09-02 14:31:31','2020-09-02 14:31:31'),(17,2,7,0,0,'2020-09-02 14:31:31','2020-09-02 14:31:31'),(18,2,8,0,0,'2020-09-02 14:31:31','2020-09-02 14:31:31'),(19,2,10,0,0,'2020-09-02 14:31:31','2020-09-02 14:31:31'),(25,2,9,0,0,'2020-09-02 14:31:31','2020-09-02 14:31:31'),(28,4,6,0,1,'2020-09-02 14:44:11','2020-09-02 14:44:11'),(29,4,1,1,0,'2020-09-02 14:44:11','2020-09-02 14:44:11'),(30,4,3,0,0,'2020-09-02 14:44:11','2020-09-02 14:44:11'),(31,4,8,0,0,'2020-09-02 14:44:11','2020-09-02 14:44:11'),(32,2,13,0,0,'2020-11-12 10:03:17','2020-11-12 10:03:17'),(33,2,14,0,0,'2020-11-12 11:33:49','2020-11-12 11:33:49'),(34,1,15,0,0,'2020-11-12 11:39:02','2020-11-12 11:39:02'),(35,26,6,0,1,'2020-11-16 13:23:56','2020-11-16 13:23:56'),(36,26,1,1,0,'2020-11-16 13:23:56','2020-11-16 13:23:56'),(37,26,3,0,0,'2020-11-16 13:23:56','2020-11-16 13:23:56'),(38,26,8,0,0,'2020-11-16 13:23:56','2020-11-16 13:23:56'),(39,21,16,0,1,'2020-11-17 12:44:43','2020-11-17 12:44:43'),(40,5,17,0,1,'2020-11-17 12:44:43','2020-11-17 12:44:43'),(42,1,19,0,0,'2020-11-17 17:55:51','2020-11-17 17:55:51'),(44,2,19,0,0,'2020-11-17 17:55:51','2020-11-17 17:55:51'),(46,4,19,0,0,'2020-11-17 17:55:51','2020-11-17 17:55:51'),(48,26,19,0,0,'2020-11-17 17:55:51','2020-11-17 17:55:51'),(49,59,20,0,1,'2020-11-17 17:55:51','2020-11-17 17:55:51'),(52,4,22,0,0,'2021-02-27 11:30:26','2021-02-27 11:30:26'),(53,2,4,1,0,'2021-03-30 11:51:29','2021-03-30 11:51:29'),(54,2,23,0,0,'2021-03-30 14:16:06','2021-03-30 14:16:06'),(55,4,23,0,0,'2021-03-31 13:44:59','2021-03-31 13:44:59');
/*!40000 ALTER TABLE `m_product_category_link_processes` ENABLE KEYS */;
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
