

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
-- Table structure for table `m_process_materials`
--

DROP TABLE IF EXISTS `m_process_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_process_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `m_process_category_id` int NOT NULL,
  `order_no` int DEFAULT NULL,
  `name` varchar(255)  DEFAULT NULL,
  `enabled_is_column` varchar(255)  DEFAULT NULL COMMENT '有効かを判断するカラム名',
  `price_type` int DEFAULT NULL COMMENT '単価の取得方法　1: カラム 2:マトリクス',
  `price_column` varchar(255)  DEFAULT NULL COMMENT '単価を取得するカラム名',
  `rate_type_m_kv_id` int DEFAULT NULL COMMENT '掛け率値参照タイプ\\n1:カラム 2:マトリクス',
  `rate_value` varchar(255)  DEFAULT NULL COMMENT '掛け率値',
  `m_matrix_id` int DEFAULT NULL COMMENT '単価を取得するマトリクスID',
  `matrix_key_01_column` varchar(255)  DEFAULT NULL COMMENT 'マトリクスのキー1 取得カラム名',
  `matrix_key_02_column` varchar(255)  DEFAULT NULL COMMENT 'マトリクスのキー2 取得カラム名',
  `unit_name` varchar(45)  DEFAULT NULL COMMENT '単位(表示用)',
  `additional_value` decimal(15,4) DEFAULT NULL COMMENT '固定追加値',
  `memo` varchar(1024)  DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日' ,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日' ,
  PRIMARY KEY (`id`),
  KEY `fk_m_process_materials_m_process_category_id_idx` (`m_process_category_id`),
  KEY `fk_m_process_materials_rate_type_m_kv_id_idx` (`rate_type_m_kv_id`),
  KEY `fk_m_process_materials_m_matrix_id_idx` (`m_matrix_id`),
  CONSTRAINT `fk_m_process_materials_m_matrix_id` FOREIGN KEY (`m_matrix_id`) REFERENCES `m_matrices` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_process_materials_m_process_category_id` FOREIGN KEY (`m_process_category_id`) REFERENCES `m_process_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_m_process_materials_rate_type_m_kv_id` FOREIGN KEY (`rate_type_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='工程カテゴリーの材料費設定';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_process_materials`
--

LOCK TABLES `m_process_materials` WRITE;
/*!40000 ALTER TABLE `m_process_materials` DISABLE KEYS */;
INSERT INTO `m_process_materials` VALUES (1,15,1,'テープ',NULL,NULL,'n_10',9010003,'n_12',NULL,NULL,NULL,'m',0.0000,'テープの両サイド の 加算値は m_costs  key[jointCartain_tape_extension]','2021-02-24 19:49:44','2021-02-24 20:58:31'),(2,1,1,'インク',NULL,NULL,'n_10',9010003,'n_01',NULL,NULL,NULL,'sqm',NULL,NULL,'2021-02-26 13:17:49','2021-02-26 14:52:47'),(3,9,1,'アプリ','is_02',NULL,'n_10',9010002,'sqmIncExt',NULL,NULL,NULL,'㎡',NULL,NULL,'2021-02-26 16:01:01','2021-03-13 17:58:00'),(4,6,1,'メディア',NULL,NULL,'n_10',9010003,'n_12',NULL,NULL,NULL,'sqm',NULL,NULL,'2021-02-26 16:57:53','2021-02-26 17:12:26'),(5,22,1,'資材 1固定',NULL,NULL,NULL,9010001,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-02-27 11:36:18','2021-02-27 11:36:18'),(6,22,2,'資材 カラム',NULL,NULL,NULL,9010003,'n_01',NULL,NULL,NULL,NULL,NULL,NULL,'2021-02-27 11:36:42','2021-02-27 11:37:10'),(7,22,3,'資材 パラメータ',NULL,NULL,NULL,9010002,'sqm',NULL,NULL,NULL,'㎡',NULL,NULL,'2021-02-27 11:37:01','2021-02-27 11:37:06'),(8,19,1,'梱包材',NULL,2,NULL,9010002,'sqm',11,'01_m_kv_id',NULL,'㎡',NULL,NULL,'2021-02-27 14:43:34','2021-03-23 15:25:07'),(9,8,1,'原寸原稿','is_01',2,NULL,9010003,'n_08',18,'m_branch_id',NULL,'㎡',NULL,NULL,'2021-03-01 11:23:01','2021-03-01 11:23:01'),(16,14,1,'パテ材',NULL,1,'n_10',9010002,'sqm',NULL,NULL,NULL,'㎡',NULL,NULL,'2021-03-01 15:28:57','2021-03-01 15:28:57'),(17,13,1,'液材料',NULL,1,'n_10',9010002,'sqm',NULL,NULL,NULL,'㎡',NULL,NULL,'2021-03-01 16:29:34','2021-03-01 16:29:34'),(18,3,1,'ラミ材',NULL,1,'n_10',9010003,'n_12',NULL,NULL,NULL,'㎡',NULL,NULL,'2021-03-01 17:24:04','2021-03-01 17:24:04'),(19,5,11,'四方 ハトメ','is_02',1,'tmp_grommetPrice01',9010003,'n_03',NULL,NULL,NULL,'個',NULL,NULL,'2021-03-08 10:32:37','2021-03-08 10:32:37'),(20,5,12,'四方 マジックテープ','is_03',1,'tmp_mtPrice01',9010003,'tmp_mtTotalLength01',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-08 10:33:28','2021-03-08 10:41:33'),(21,5,91,'綿テープ',NULL,2,NULL,9010003,'tmp_cottonTapeTotalMaterLength',34,NULL,NULL,'m',NULL,NULL,'2021-03-12 15:57:01','2021-03-12 17:01:58'),(22,5,92,'ロープ出しロープ',NULL,2,NULL,9010003,'tmp_ropeTotalMaterLength',35,NULL,NULL,'m',NULL,NULL,'2021-03-12 16:14:41','2021-03-12 16:59:55'),(23,5,93,'取付用ロープ',NULL,1,'tmp_ropeoutCost',9010003,'tmp_ropeoutMaterLength',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-12 16:17:56','2021-03-12 16:17:56'),(24,5,94,'風抜きテープ','tmp_isWindAvoid',2,NULL,9010003,'tmp_windAvoidTotalMaterLength',36,NULL,NULL,'m',NULL,NULL,'2021-03-12 18:47:44','2021-03-12 18:47:44'),(25,7,1,'材料','tmp_isMaterialCost',1,'n_10',9010001,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2021-03-17 15:24:08','2021-04-14 15:45:59'),(27,5,95,'あおり止め羽根','tmp_isStopTilting',2,NULL,9010003,'tmp_stopTiltingTotalMaterLength',38,'41_m_kv_id',NULL,'m',NULL,NULL,'2021-03-19 10:44:28','2021-03-19 11:36:51'),(28,5,901,'パイプ','tmp_isPipe',1,'tmp_pipeCostPerMater',9010003,'tmp_pipeTotalMaterLength',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-19 15:07:26','2021-04-03 18:03:09'),(29,5,910,'パイプカット','tmp_pipeTotalNumOfCut',2,NULL,9010003,'tmp_pipeTotalNumOfCut',41,NULL,NULL,'回',NULL,NULL,'2021-03-19 15:58:02','2021-03-19 15:59:15'),(30,5,920,'パイプジョイント','tmp_pipeTotalNumOfJoint',2,NULL,9010003,'tmp_pipeTotalNumOfJoint',42,NULL,NULL,'回',NULL,NULL,'2021-03-19 15:59:08','2021-03-19 15:59:08'),(31,5,16,'四方 シリコンゴム','is_04',1,'tmp_silliconRubberPrice01',9010003,'tmp_sideMaterLength01',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-23 20:18:25','2021-03-24 12:56:12'),(32,5,21,'上下 ハトメ','is_07',1,'tmp_grommetPrice02',9010003,'n_23',NULL,NULL,NULL,'個',NULL,NULL,'2021-03-08 10:32:37','2021-03-08 10:32:37'),(33,5,22,'上下 マジックテープ','is_08',1,'tmp_mtPrice02',9010003,'tmp_mtTotalLength02',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-08 10:33:28','2021-03-08 10:41:33'),(34,5,26,'上下 シリコンゴム','is_09',1,'tmp_silliconRubberPrice02',9010003,'tmp_sideMaterLength02',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-23 20:18:25','2021-03-24 12:56:12'),(35,5,31,'左右 ハトメ','is_12',1,'tmp_grommetPrice03',9010003,'n_33',NULL,NULL,NULL,'個',NULL,NULL,'2021-03-08 10:32:37','2021-03-08 10:32:37'),(36,5,32,'左右 マジックテープ','is_13',1,'tmp_mtPrice03',9010003,'tmp_mtTotalLength03',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-08 10:33:28','2021-03-08 10:41:33'),(37,5,36,'左右 シリコンゴム','is_14',1,'tmp_silliconRubberPrice03',9010003,'tmp_sideMaterLength03',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-23 20:18:25','2021-03-24 12:56:12'),(38,5,41,'上 ハトメ','is_17',1,'tmp_grommetPrice04',9010003,'n_43',NULL,NULL,NULL,'個',NULL,NULL,'2021-03-08 10:32:37','2021-03-08 10:32:37'),(39,5,42,'上 マジックテープ','is_18',1,'tmp_mtPrice04',9010003,'tmp_mtTotalLength04',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-08 10:33:28','2021-03-08 10:41:33'),(40,5,46,'上 シリコンゴム','is_19',1,'tmp_silliconRubberPrice04',9010003,'tmp_sideMaterLength04',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-23 20:18:25','2021-03-24 12:56:12'),(41,5,51,'下 ハトメ','is_22',1,'tmp_grommetPrice05',9010003,'n_53',NULL,NULL,NULL,'個',NULL,NULL,'2021-03-08 10:32:37','2021-03-08 10:32:37'),(42,5,52,'下 マジックテープ','is_23',1,'tmp_mtPrice05',9010003,'tmp_mtTotalLength05',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-08 10:33:28','2021-03-08 10:41:33'),(43,5,56,'下 シリコンゴム','is_24',1,'tmp_silliconRubberPrice05',9010003,'tmp_sideMaterLength05',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-23 20:18:25','2021-03-24 12:56:12'),(44,5,61,'左 ハトメ','is_27',1,'tmp_grommetPrice06',9010003,'n_63',NULL,NULL,NULL,'個',NULL,NULL,'2021-03-08 10:32:37','2021-03-08 10:32:37'),(45,5,62,'左 マジックテープ','is_28',1,'tmp_mtPrice06',9010003,'tmp_mtTotalLength06',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-08 10:33:28','2021-03-08 10:41:33'),(46,5,66,'左 シリコンゴム','is_29',1,'tmp_silliconRubberPrice06',9010003,'tmp_sideMaterLength06',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-23 20:18:25','2021-03-24 12:56:12'),(47,5,71,'右 ハトメ','is_32',1,'tmp_grommetPrice07',9010003,'n_73',NULL,NULL,NULL,'個',NULL,NULL,'2021-03-08 10:32:37','2021-03-08 10:32:37'),(48,5,72,'右 マジックテープ','is_33',1,'tmp_mtPrice07',9010003,'tmp_mtTotalLength07',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-08 10:33:28','2021-03-08 10:41:33'),(49,5,76,'右 シリコンゴム','is_34',1,'tmp_silliconRubberPrice07',9010003,'tmp_sideMaterLength07',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-23 20:18:25','2021-03-24 12:56:12'),(51,23,1,'両面テープ',NULL,1,'n_10',9010003,'n_04',NULL,NULL,NULL,'m',NULL,NULL,'2021-03-30 19:50:39','2021-03-30 19:50:39'),(52,5,906,'パイプ端材','tmp_isPipe',1,'tmp_pipeWasteCostPerMater',9010003,'tmp_pipeTotalWasteMaterLength',NULL,NULL,NULL,'m',NULL,NULL,'2021-04-03 18:04:10','2021-04-03 18:04:10');
/*!40000 ALTER TABLE `m_process_materials` ENABLE KEYS */;
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
