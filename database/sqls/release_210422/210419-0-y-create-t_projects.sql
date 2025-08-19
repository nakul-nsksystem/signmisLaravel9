
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
-- Table structure for table `t_projects`
--

DROP TABLE IF EXISTS `t_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `m_branch_id` int DEFAULT NULL,
  `cd` varchar(190) DEFAULT NULL,
  `name` varchar(255)  DEFAULT NULL,
  `m_customer_id` int DEFAULT NULL COMMENT '顧客ID',
  `sales_m_user_id` int DEFAULT NULL COMMENT '営業担当',
  `orderd_at` datetime DEFAULT NULL COMMENT '受注日',
  `orderd_m_user_id` int DEFAULT NULL COMMENT '受注ユーザー',
  `devlivery_fee` int DEFAULT '0' COMMENT '送料',
  `other_fee` int DEFAULT '0' COMMENT 'その他費用',
  `memo` varchar(1024)  DEFAULT NULL,
  `created_m_user_id` int NOT NULL COMMENT '作成担当者',
  `updated_m_user_id` int NOT NULL COMMENT '更新担当者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_projects_cd_idx` (`cd`) USING BTREE /*!80000 INVISIBLE */,
  KEY `fk_t_projects_m_branch_id_idx` (`m_branch_id`) USING BTREE /*!80000 INVISIBLE */,
  KEY `fk_t_projects_m_customer_id_idx` (`m_customer_id`) USING BTREE /*!80000 INVISIBLE */,
  KEY `fk_t_projects_sales_m_user_id_idx` (`sales_m_user_id`) USING BTREE /*!80000 INVISIBLE */,
  KEY `fk_t_projects_orderd_m_user_id_idx` (`orderd_m_user_id`),
  KEY `fk_t_projects_created_m_user_id_idx` (`created_m_user_id`),
  KEY `fk_t_projects_updated_m_user_id_idx` (`updated_m_user_id`),
  CONSTRAINT `fk_t_projects_created_m_user_id` FOREIGN KEY (`created_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_projects_m_branch_id` FOREIGN KEY (`m_branch_id`) REFERENCES `m_branches` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_projects_m_customer_id` FOREIGN KEY (`m_customer_id`) REFERENCES `m_customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_projects_orderd_m_user_id` FOREIGN KEY (`orderd_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_projects_sales_m_user_id` FOREIGN KEY (`sales_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_projects_updated_m_user_id` FOREIGN KEY (`updated_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='物件';
/*!40101 SET character_set_client = @saved_cs_client */;
