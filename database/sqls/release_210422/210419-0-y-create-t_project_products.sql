
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
-- Table structure for table `t_project_products`
--

DROP TABLE IF EXISTS `t_project_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_project_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `t_project_id` int NOT NULL,
  `order_no` int DEFAULT NULL,
  `m_branch_id` int NOT NULL COMMENT '生産拠点',
  `name` varchar(1024)  DEFAULT NULL COMMENT '商品名',
  `display_01` varchar(1024)  DEFAULT NULL COMMENT '表示用1',
  `display_02` varchar(1024)  DEFAULT NULL COMMENT '表示用2',
  `display_03` varchar(1024)  DEFAULT NULL COMMENT '表示用3',
  `display_04` varchar(1024)  DEFAULT NULL COMMENT '表示用4',
  `display_05` varchar(1024)  DEFAULT NULL COMMENT '表示用5',
  `delivery_date` datetime DEFAULT NULL COMMENT '納期',
  `m_product_category_id` int DEFAULT NULL,
  `qty` int DEFAULT '0' COMMENT '数量',
  `size_w` decimal(15,4) DEFAULT '0.0000' COMMENT 'サイズW',
  `size_h` decimal(15,4) DEFAULT '0.0000' COMMENT 'サイズH',
  `size_extend_t` decimal(15,4) DEFAULT '0.0000' COMMENT '伸ばし上',
  `size_extend_b` decimal(15,4) DEFAULT '0.0000' COMMENT '伸ばし下',
  `size_extend_l` decimal(15,4) DEFAULT '0.0000' COMMENT '伸ばし左',
  `size_extend_r` decimal(15,4) DEFAULT '0.0000' COMMENT '伸ばし右',
  `weight` decimal(15,4) DEFAULT '0.0000' COMMENT '重量',
  `total_weight` decimal(15,4) DEFAULT '0.0000' COMMENT '総重量',
  `is_needed_labels_for_fire_prevention` tinyint(1) DEFAULT '0' COMMENT '用防炎シール',
  `specified_m_kv_id` int DEFAULT NULL COMMENT '指定',
  `warranty_m_kv_id` int DEFAULT NULL,
  `num_of_sep_w` int DEFAULT '1' COMMENT '商品分割数W',
  `sep_way_w` int DEFAULT NULL COMMENT '商品分割方法W 1:均等割 2:指定',
  `num_of_sep_h` int DEFAULT '1' COMMENT '商品分割数H',
  `sep_way_h` int DEFAULT NULL COMMENT '商品分割方法H 1:均等割 2:指定',
  `sep_overlap_length` decimal(15,4) DEFAULT '0.0000' COMMENT '商品分割の重ね代（寸法）',
  `memo` varchar(1024)  DEFAULT NULL,
  `cost` decimal(15,4) DEFAULT '0.0000' COMMENT '@原価',
  `total_cost` decimal(15,4) DEFAULT '0.0000' COMMENT '総原価',
  `sell_price` decimal(15,4) DEFAULT '0.0000' COMMENT '@売価',
  `total_sell_price` decimal(15,4) DEFAULT '0.0000' COMMENT '総売価',
  `profit` decimal(15,4) DEFAULT '0.0000' COMMENT '@利益',
  `total_profit` decimal(15,4) DEFAULT '0.0000' COMMENT '総利益',
  `profit_per` decimal(15,4) DEFAULT '0.0000' COMMENT '利益率',
  `variable_cost` decimal(15,4) DEFAULT '0.0000' COMMENT '変動費',
  `total_variable_cost` decimal(15,4) DEFAULT '0.0000' COMMENT '総変動費',
  `margin_profit` decimal(15,4) DEFAULT '0.0000' COMMENT '限界利益',
  `total_margin_profit` decimal(15,4) DEFAULT '0.0000' COMMENT '総限界利益',
  `margin_profit_per` decimal(15,4) DEFAULT '0.0000' COMMENT '限界利益率',
  `total_hour_for_production` decimal(15,4) DEFAULT '0.0000' COMMENT '総予測生産時間',
  `created_m_user_id` int NOT NULL COMMENT '作成担当者',
  `updated_m_user_id` int NOT NULL COMMENT '更新担当者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  KEY `fk_t_project_products_t_project_id_idx` (`t_project_id`),
  KEY `fk_t_project_products_m_branch_id_idx` (`m_branch_id`),
  KEY `fk_t_project_products_m_product_category_id_idx` (`m_product_category_id`) /*!80000 INVISIBLE */,
  KEY `fk_t_project_products_specified_m_kv_id_idx` (`specified_m_kv_id`) /*!80000 INVISIBLE */,
  KEY `fk_t_project_products_warranty_m_kv_id_idx` (`warranty_m_kv_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `fk_t_project_products_m_branch_id` FOREIGN KEY (`m_branch_id`) REFERENCES `m_branches` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_products_m_product_category_id` FOREIGN KEY (`m_product_category_id`) REFERENCES `m_product_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_products_specified_m_kv_id` FOREIGN KEY (`specified_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_products_t_project_id` FOREIGN KEY (`t_project_id`) REFERENCES `t_projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_t_project_products_warranty_m_kv_id` FOREIGN KEY (`warranty_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='物件商品';
/*!40101 SET character_set_client = @saved_cs_client */;
