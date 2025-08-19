
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
-- Table structure for table `t_project_product_separates`
--

DROP TABLE IF EXISTS `t_project_product_separates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_project_product_separates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `t_project_product_id` int NOT NULL,
  `is_w` tinyint(1) NOT NULL COMMENT '0:H  1:W',
  `pos` decimal(15,4) DEFAULT '0.0000' COMMENT '位置',
  `created_m_user_id` int DEFAULT NULL COMMENT '作成担当者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  PRIMARY KEY (`id`),
  KEY `fk_t_project_product_separates_t_project_product_id_idx` (`t_project_product_id`),
  KEY `fk_t_project_product_separates_created_m_user_id_idx` (`created_m_user_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `fk_t_project_product_separates_created_m_user_id` FOREIGN KEY (`created_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_product_separates_t_project_product_id` FOREIGN KEY (`t_project_product_id`) REFERENCES `t_project_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='物件商品の分割';
/*!40101 SET character_set_client = @saved_cs_client */;
