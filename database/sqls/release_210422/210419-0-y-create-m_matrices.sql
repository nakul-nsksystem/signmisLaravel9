
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
-- Table structure for table `m_matrices`
--

DROP TABLE IF EXISTS `m_matrices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_matrices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `m_branch_id` int DEFAULT NULL,
  `order_no` int DEFAULT NULL,
  `cd` varchar(190)  NOT NULL,
  `name` varchar(1024)  DEFAULT NULL,
  `k1_name` varchar(1024)  DEFAULT NULL COMMENT 'キー表示タイトル',
  `k1_op` int DEFAULT NULL COMMENT '1: =   2: <   3: >   4: <=   5: >=',
  `k2_name` varchar(1024)  DEFAULT NULL COMMENT 'キー表示タイトル',
  `k2_op` int DEFAULT NULL COMMENT '1: =   2: <   3: >   4: <=   5: >=',
  `k3_name` varchar(1024)  DEFAULT NULL COMMENT 'キー表示タイトル',
  `k3_op` int DEFAULT NULL COMMENT '1: =   2: <   3: >   4: <=   5: >=',
  `k4_name` varchar(1024)  DEFAULT NULL COMMENT 'キー表示タイトル',
  `k4_op` int DEFAULT NULL COMMENT '1: =   2: <   3: >   4: <=   5: >=',
  `val1_name` varchar(1024)  DEFAULT NULL COMMENT '値1タイトル(表示用)',
  `val2_name` varchar(1024)  DEFAULT NULL COMMENT '値2タイトル(表示用)',
  `created_m_user_id` int NOT NULL COMMENT '作成担当者',
  `updated_m_user_id` int NOT NULL COMMENT '更新担当者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  KEY `fk_m_matrices_m_branch_id_idx` (`m_branch_id`),
  KEY `fk_m_matrices_created_m_user_id_idx` (`created_m_user_id`),
  KEY `fk_m_matrices_updated_m_user_id_idx` (`updated_m_user_id`),
  KEY `m_matrices_cd_idx` (`cd`),
  CONSTRAINT `fk_m_matrices_created_m_user_id` FOREIGN KEY (`created_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_matrices_m_branche_id` FOREIGN KEY (`m_branch_id`) REFERENCES `m_branches` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_matrices_updated_m_user_id` FOREIGN KEY (`updated_m_user_id`) REFERENCES `m_users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='マトリクス（原価計算に使用)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_matrices`
--

LOCK TABLES `m_matrices` WRITE;
/*!40000 ALTER TABLE `m_matrices` DISABLE KEYS */;
INSERT INTO `m_matrices` VALUES (1,1,1,'test','TEST','Key1 =',1,'Key2 <',2,'Key3 <=',3,NULL,NULL,'VAL1','VAL2',0,0,'2020-12-22 16:13:09','2020-12-22 16:13:09',NULL),(10,NULL,911,'packing_wt','M911 梱包 - 梱包作業時間','方法',1,NULL,NULL,NULL,NULL,NULL,NULL,'秒数/個',NULL,0,0,'2021-01-05 16:50:28','2021-01-05 16:50:28',NULL),(11,NULL,912,'packing_mp','M912 梱包 - 梱包資材㎡単価 ','方法',1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/㎡',NULL,0,0,'2021-01-05 15:15:44','2021-01-05 15:15:44',NULL),(18,NULL,512,'orgcopy_mp','M512 形状カット - 原寸原稿 メディア㎡単価','拠点',1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/㎡',NULL,0,0,'2021-01-07 12:50:03','2021-01-07 12:50:03',NULL),(19,NULL,501,'multicut_wp','M501 形状カット - 作業費 時間単価','生産先',1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/h',NULL,0,0,'2021-01-07 17:07:10','2021-01-07 17:07:10',NULL),(20,NULL,621,'plotHalfcut_application_width_margin','M621 プロッターハーフカット - アプリ 幅マージン',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'mm',NULL,0,0,'2021-01-08 19:16:21','2021-01-08 19:16:21',NULL),(29,NULL,751,'jointCartain_tape_extension','M751 幕継ぎ加工 - テープ両端必要mm数',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'mm数',NULL,0,0,'2021-01-28 14:32:55','2021-01-28 14:32:55',NULL),(31,NULL,513,'multicut_wt','M513 形状カット - 原寸原稿 ペン書き速度','拠点',1,NULL,NULL,NULL,NULL,NULL,NULL,'速度/mm',NULL,0,0,'2021-03-01 11:19:01','2021-03-01 11:19:01',NULL),(32,NULL,752,'postCartain_grommet_margin','M752 仕上げ加工 - ハトメ端マージンmm数',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'mm',NULL,0,0,'2021-03-08 11:14:00','2021-03-08 11:14:00',NULL),(33,NULL,701,'postCartain_wt','M701 幕仕上げ - 仕上げ加工時間','方法',1,NULL,NULL,NULL,NULL,NULL,NULL,'秒/mm',NULL,0,0,'2021-03-08 11:18:17','2021-03-08 11:18:17',NULL),(34,NULL,704,'postCartain_cottonTape_mp','M704 幕仕上げ - 綿テープ材料価格',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/m',NULL,0,0,'2021-03-12 15:56:15','2021-03-12 15:56:15',NULL),(35,NULL,706,'postCartain_ropeOutRope_mp','M706 幕仕上げ - ロープだし用ロープ材料価格',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/m',NULL,0,0,'2021-03-12 16:06:00','2021-03-12 16:06:00',NULL),(36,NULL,722,'postCartain_windAvoid_mp','M722 幕仕上げ - 風抜きテープ単価',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/m',NULL,0,0,'2021-03-12 18:39:18','2021-03-12 18:39:18',NULL),(37,NULL,723,'postCartain_windAvoid_extend','M723 幕仕上げ - 風抜きテープ両端延長',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'延長/箇所',NULL,0,0,'2021-03-12 19:04:30','2021-03-12 19:04:30',NULL),(38,NULL,731,'postCartain_StopTilting_mp','M731 幕仕上げ - あおり止め材料単価',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/m',NULL,0,0,'2021-03-18 20:44:28','2021-03-18 20:44:28',NULL),(39,NULL,732,'postCartain_StopTilting_wt','M732 幕仕上げ - あおり止め作業時間',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'掛け率',NULL,0,0,'2021-03-19 09:49:54','2021-03-19 09:49:54',NULL),(40,NULL,734,'postCartain_StopTilting_baseLength','M734 幕仕上げ - あおり止め 基準長さ（基準長さ単位で最低とする)',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'基準長さmm/箇所',NULL,0,0,'2021-03-19 10:37:23','2021-03-19 10:37:23',NULL),(41,NULL,741,'postCartain_Pipe_cut_c','M741 幕仕上げ - パイプ カット単価',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/カット',NULL,0,0,'2021-03-19 15:48:19','2021-03-19 15:48:19',NULL),(42,NULL,742,'postCartain_Pipe_joint_c','M742 幕仕上げ - パイプ ジョイント単価',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/箇所',NULL,0,0,'2021-03-19 15:48:38','2021-03-19 15:48:38',NULL),(43,NULL,746,'postCartain_Pipe_crash_space','M746 幕仕上げ - パイプ つぶしあそび代',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'あそび代mm',NULL,0,0,'2021-03-19 16:27:29','2021-03-19 16:27:29',NULL),(44,NULL,747,'postCartain_Pipe_waste_cost_per','M747 幕仕上げ - パイプ 余りコスト％',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'掛け率',NULL,0,0,'2021-03-24 21:09:23','2021-03-24 21:09:23',NULL),(45,NULL,748,'postCartain_Pipe_waste_condition_per','M748 幕仕上げ - パイプ 端材扱い％',NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,'判定端材率',NULL,0,0,'2021-04-03 10:58:55','2021-04-03 10:58:55',NULL),(46,NULL,101,'boardMaterials_waste_cost_per','M101 板材 端材扱い境界 %',NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,'判定端材率',NULL,0,0,'2021-04-09 14:19:20','2021-04-09 14:19:20',NULL),(47,NULL,111,'boardMaterials_cost_per_cut','M111 板材 カットコスト',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'単価/カット',NULL,0,0,'2021-04-13 18:50:53','2021-04-13 18:50:53',NULL),(48,NULL,11,'product_predict_profit_per','M011 想定利益率',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'想定利益率',NULL,0,0,'2021-04-16 11:34:51','2021-04-16 11:34:51',NULL);
/*!40000 ALTER TABLE `m_matrices` ENABLE KEYS */;
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
