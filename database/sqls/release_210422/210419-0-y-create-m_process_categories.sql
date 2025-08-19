
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
-- Table structure for table `m_process_categories`
--

DROP TABLE IF EXISTS `m_process_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_process_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_no` int NOT NULL,
  `cd` varchar(190)  NOT NULL,
  `name` varchar(255)  NOT NULL,
  `is_able_to_add` tinyint(1) DEFAULT '0' COMMENT '1:ユーザー追加可能（仕入れ商品など）',
  `memo4project` varchar(1024)  DEFAULT NULL COMMENT '物件の工程入力時に出すコメント',
  `num_of_use_m_production` int DEFAULT NULL COMMENT '使用生産先数',
  `m_production_memo_01` varchar(1024)  DEFAULT NULL COMMENT '生産先1',
  `m_production_memo_02` varchar(1024)  DEFAULT NULL COMMENT '生産先2',
  `m_production_memo_03` varchar(1024)  DEFAULT NULL COMMENT '生産先3',
  `m_production_memo_04` varchar(1024)  DEFAULT NULL COMMENT '生産先4',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_process_categories_cd_idx` (`cd`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='工程カテゴリーマスタ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_process_categories`
--

LOCK TABLES `m_process_categories` WRITE;
/*!40000 ALTER TABLE `m_process_categories` DISABLE KEYS */;
INSERT INTO `m_process_categories` VALUES (1,120,'Print','出力',0,NULL,1,'プリンタ',NULL,NULL,NULL,'2020-09-01 14:34:18','2020-09-01 14:34:18',NULL),(2,130,'Uvcoat','UVコート',0,NULL,1,'外注先',NULL,NULL,NULL,'2020-09-01 14:34:18','2020-09-01 14:34:18',NULL),(3,140,'Lami','ラミネート',0,NULL,1,'ラミネータ',NULL,NULL,NULL,'2020-09-01 14:34:18','2020-09-01 14:34:18',NULL),(4,300,'Sheetcut','シートカット',0,NULL,1,'カット作業',NULL,NULL,NULL,'2020-09-01 14:34:18','2020-09-01 14:34:18',NULL),(5,800,'Post-cartain','幕 仕上げ加工',0,NULL,4,'オペレータ','ウェルダー','ハトメ','ミシン','2020-09-01 14:34:18','2021-03-24 15:10:36',NULL),(6,110,'Material','資材',0,NULL,1,NULL,NULL,NULL,NULL,'2020-09-01 20:20:11','2021-02-13 13:35:36',NULL),(7,500,'Unite-materials','貼り',0,NULL,3,'貼り作業','A','B',NULL,'2020-09-02 13:58:47','2021-02-20 15:21:49',NULL),(8,600,'Multicut','形状カット',0,NULL,2,'加工機','作業者',NULL,NULL,'2020-09-02 13:58:47','2021-03-01 11:23:38',NULL),(9,250,'Plot-halfcut','プロッターハーフカット',0,'難易度基準\n　ひらがな：3   漢字 ：5\n　20mm以下漢字 ： 8 \n    文字10mm以下 :  15\n    筆文字、複雑図形 :  30',2,'カッティングプロッター','後作業者',NULL,NULL,'2020-09-02 13:58:47','2021-02-10 12:07:21',NULL),(10,800,'Post-pvc','その他加工',1,NULL,1,NULL,NULL,NULL,NULL,'2020-09-02 13:58:47','2020-09-02 13:58:47',NULL),(13,400,'Primar','プライマー',0,NULL,1,'作業者',NULL,NULL,NULL,'2021-02-06 10:19:31','2021-02-06 10:19:31',NULL),(14,450,'Pate','パテ',0,NULL,1,'作業者',NULL,NULL,NULL,'2021-02-06 10:19:31','2021-02-06 10:19:31',NULL),(15,500,'JointCartain','継ぎ加工',0,NULL,2,'ウェルダー','オペレータ',NULL,NULL,'2021-02-05 17:24:39','2021-02-24 17:18:28',NULL),(16,930,'Frame','枠',0,NULL,1,'作業者',NULL,NULL,NULL,'2021-02-06 10:19:31','2021-02-06 10:19:31',NULL),(17,920,'Purchase-product','仕入商品',1,NULL,1,NULL,NULL,NULL,NULL,'2021-02-06 11:07:19','2021-02-06 11:07:21',NULL),(19,990,'Packing','梱包',0,NULL,1,'作業者',NULL,NULL,NULL,'2021-02-06 11:12:51','2021-02-06 11:12:51',NULL),(20,910,'Data-creation','データ作成',0,NULL,1,'作業者',NULL,NULL,NULL,'2021-02-06 10:53:44','2021-02-06 10:53:47',NULL),(22,270,'Test','TEST',0,'難易度基準\n　ひらがな：3   漢字 ：5\n　20mm以下漢字 ： 8 \n    文字10mm以下 :  15\n    筆文字、複雑図形 :  30',1,NULL,NULL,NULL,NULL,'2021-02-10 14:38:05','2021-02-13 14:04:26',NULL),(23,650,'Backside-tape','裏面両面テープ貼',0,NULL,1,'作業者',NULL,NULL,NULL,'2021-03-30 14:08:16','2021-03-30 14:08:16',NULL);
/*!40000 ALTER TABLE `m_process_categories` ENABLE KEYS */;
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
