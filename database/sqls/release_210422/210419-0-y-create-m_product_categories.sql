
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
-- Table structure for table `m_product_categories`
--

DROP TABLE IF EXISTS `m_product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_no` int NOT NULL,
  `cd` varchar(190)  NOT NULL,
  `name` varchar(255) NOT NULL,
  `material_category_m_kv_id` int DEFAULT NULL COMMENT '使用する資材のカテゴリID',
  `is_able_media_separate_both_side` tinyint(1) DEFAULT '0' COMMENT 'メディアを分割する縦・横両方を分割可能な場合は1 \n※　幕などは片方向',
  `media_separate_overlap_length` decimal(10,0) DEFAULT NULL COMMENT 'メディアを分割する際にメディア同士を重ならせる寸法',
  `is_board` tinyint(1) NOT NULL DEFAULT '0' COMMENT '板の場合は 1  \n梱包工程の内容の制御に使用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_product_categories_cd_idx` (`cd`),
  KEY `fk_m_product_categories_material_category_m_kv_id_idx` (`material_category_m_kv_id`),
  CONSTRAINT `fk_m_product_categories_material_category_m_kv_id` FOREIGN KEY (`material_category_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='商品カテゴリー( 幕/塩ビなど ) ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_product_categories`
--

LOCK TABLES `m_product_categories` WRITE;
/*!40000 ALTER TABLE `m_product_categories` DISABLE KEYS */;
INSERT INTO `m_product_categories` VALUES (1,1,'c1','幕、布地系',1350001,0,20,0,'2020-09-01 14:34:18','2020-09-15 04:47:03',NULL),(2,2,'c2','塩ビ系',1350002,1,20,0,'2020-09-01 14:34:18','2020-09-15 02:16:28',NULL),(3,3,'c3','カッティングシート',NULL,0,NULL,0,'2020-09-01 14:34:18','2020-09-01 14:34:18','2020-10-10 00:00:00'),(4,4,'c4','板物',1350011,1,0,1,'2020-09-01 14:34:18','2020-09-15 04:47:18',NULL),(5,5,'c5','仕入商品',NULL,0,NULL,0,'2020-09-01 14:34:18','2020-09-01 14:34:18',NULL),(21,6,'c6','制作物',NULL,0,NULL,1,'2020-11-20 09:55:22','2020-11-20 09:55:22',NULL),(26,7,'c7','Reboard',1350012,1,NULL,1,'2020-09-17 04:09:00','2020-09-17 04:09:00',NULL),(59,8,'c8','データ作成',NULL,0,NULL,0,'2020-11-20 09:53:48','2020-11-20 09:53:48',NULL);
/*!40000 ALTER TABLE `m_product_categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-19 16:16:23
