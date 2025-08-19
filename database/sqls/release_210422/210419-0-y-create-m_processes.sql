

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
-- Table structure for table `m_processes`
--

DROP TABLE IF EXISTS `m_processes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_processes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `m_process_category_id` int DEFAULT NULL,
  `order_no` int NOT NULL,
  `name` varchar(512)  NOT NULL,
  `enabled_is_column` varchar(512)  DEFAULT NULL COMMENT '有効かを判断するカラム名',
  `is_use_prepare_per_job` tinyint(1) DEFAULT '0' COMMENT '準備/ジョブ　使用',
  `prepare_per_job_target_m_production_no` int NOT NULL DEFAULT '1' COMMENT '準備/ジョブ 生産先No',
  `prepare_per_job_speed_ref_type` int DEFAULT '0' COMMENT '準備/ジョブ 速度値参照タイプ\\n1:生産先モード 2:マトリクス 3:固定値',
  `prepare_per_job_speed_ref_value` varchar(512)  DEFAULT NULL COMMENT '準備/ジョブ 速度掛け率値',
  `prepare_per_job_speed_m_matrix_id` int DEFAULT NULL COMMENT '準備/ジョブ 速度掛け率マトリクスID',
  `prepare_per_job_speed_matrix_key_01_column` varchar(512)  DEFAULT NULL COMMENT '準備/ジョブ 速度掛け率マトリクスキー1 カラム名',
  `prepare_per_job_speed_matrix_key_02_column` varchar(512)  DEFAULT NULL COMMENT '準備/ジョブ 速度掛け率マトリクスキー2 カラム名',
  `prepare_per_job_speed_ref_unit_name` varchar(512)  DEFAULT NULL COMMENT '準備/ジョブ 速度単位(表示用)',
  `prepare_per_job_speed_difficulty_column` varchar(512)  DEFAULT NULL COMMENT '準備/ジョブ 難易度カラム',
  `prepare_per_job_rate_type_m_kv_id` int DEFAULT NULL COMMENT '準備/ジョブ 掛率タイプ',
  `prepare_per_job_rate_value` varchar(512)  DEFAULT NULL COMMENT '準備/ジョブ 掛率値',
  `prepare_per_job_memo` varchar(512)  DEFAULT NULL COMMENT '準備/ジョブ 備考',
  `prepare_per_job_num_of_worker_effect` decimal(15,4) DEFAULT '1.0000' COMMENT '準備/ジョブ 人数効率',
  `is_use_prepare_per_qty` tinyint(1) DEFAULT '0' COMMENT '準備/枚　使用',
  `prepare_per_qty_target_m_production_no` int DEFAULT '1' COMMENT '準備/枚 生産先No',
  `prepare_per_qty_speed_ref_type` int DEFAULT '0' COMMENT '準備/枚 速度基準値参照タイプ\n1:生産先モード 2:マトリクス 3:固定値',
  `prepare_per_qty_speed_ref_value` varchar(512)  DEFAULT NULL COMMENT '準備/枚 速度掛け率値',
  `prepare_per_qty_speed_m_matrix_id` int DEFAULT NULL COMMENT '準備/枚 速度掛け率マトリクスID',
  `prepare_per_qty_speed_matrix_key_01_column` varchar(512)  DEFAULT NULL COMMENT '準備/枚 速度掛け率マトリクスキー1 カラム名',
  `prepare_per_qty_speed_matrix_key_02_column` varchar(512)  DEFAULT NULL COMMENT '準備/枚 速度掛け率マトリクスキー2 カラム名',
  `prepare_per_qty_speed_ref_unit_name` varchar(512)  DEFAULT NULL COMMENT '準備/枚 速度単位(表示用) - /枚に固定される為 未使用',
  `prepare_per_qty_speed_difficulty_column` varchar(512)  DEFAULT NULL COMMENT '準備/枚 難易度カラム',
  `prepare_per_qty_rate_type_m_kv_id` int DEFAULT NULL COMMENT '準備/枚 掛率タイプ',
  `prepare_per_qty_rate_value` varchar(512)  DEFAULT NULL COMMENT '準備/枚 掛率値',
  `prepare_per_qty_memo` varchar(512)  DEFAULT NULL COMMENT '準備/枚 備考',
  `prepare_per_qty_num_of_worker_effect` decimal(15,4) DEFAULT '1.0000' COMMENT '準備/枚 人数効率',
  `is_use_operation` tinyint(1) DEFAULT '0' COMMENT '稼働　使用',
  `operation_target_m_production_no` int DEFAULT '1' COMMENT '稼働生産先No',
  `operation_speed_ref_type` int DEFAULT NULL COMMENT '稼働 速度掛け率値参照タイプ\\n1:生産先モード 2:マトリクス 3:固定値',
  `operation_speed_ref_value` varchar(512)  DEFAULT NULL COMMENT '稼働 速度掛け率値',
  `operation_speed_m_matrix_id` int DEFAULT NULL COMMENT '稼働 速度掛け率マトリクスID',
  `operation_speed_matrix_key_01_column` varchar(512)  DEFAULT NULL COMMENT '稼働 速度掛け率マトリクスキー1 カラム名',
  `operation_speed_matrix_key_02_column` varchar(512)  DEFAULT NULL COMMENT '稼働 速度掛け率マトリクスキー2 カラム名',
  `operation_speed_ref_unit_name` varchar(45)  DEFAULT NULL COMMENT '稼働 速度基準値単位(表示用) - /枚に固定される為 未使用',
  `operation_speed_difficulty_column` varchar(512)  DEFAULT NULL COMMENT '稼働 難易度カラム',
  `operation_rate_type_m_kv_id` int DEFAULT NULL COMMENT '稼働掛率タイプ',
  `operation_rate_value` varchar(512)  DEFAULT NULL COMMENT '稼働掛率値',
  `operation_memo` varchar(512)  DEFAULT NULL COMMENT '稼働備考',
  `operation_num_of_worker_effect` decimal(15,4) NOT NULL DEFAULT '1.0000' COMMENT '稼働人数効率',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日' ,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日' ,
  `deleted_at` datetime DEFAULT NULL COMMENT '削除日',
  PRIMARY KEY (`id`),
  KEY `fk_m_processes_m_process_category_id_idx` (`m_process_category_id`),
  KEY `fk_m_processes_prepare_per_job_speed_m_matrix_id_idx` (`prepare_per_job_speed_m_matrix_id`),
  KEY `fk_m_processes_prepare_per_job_rate_type_m_kv_id_idx` (`prepare_per_job_rate_type_m_kv_id`),
  KEY `fk_m_processes_prepare_per_qty_speed_m_matrix_id_idx` (`prepare_per_qty_speed_m_matrix_id`),
  KEY `fk_m_processes_prepare_per_qty_rate_type_m_kv_id_idx` (`prepare_per_qty_rate_type_m_kv_id`),
  KEY `fk_m_processes_operation_speed_m_matrix_id_idx` (`operation_speed_m_matrix_id`),
  KEY `fk_m_processes_operation_rate_type_m_kv_id_idx` (`operation_rate_type_m_kv_id`),
  CONSTRAINT `fk_m_processes_m_process_category_id` FOREIGN KEY (`m_process_category_id`) REFERENCES `m_process_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_processes_operation_rate_type_m_kv_id` FOREIGN KEY (`operation_rate_type_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_processes_operation_speed_m_matrix_id` FOREIGN KEY (`operation_speed_m_matrix_id`) REFERENCES `m_matrices` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_processes_prepare_per_job_rate_type_m_kv_id` FOREIGN KEY (`prepare_per_job_rate_type_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_processes_prepare_per_job_speed_m_matrix_id` FOREIGN KEY (`prepare_per_job_speed_m_matrix_id`) REFERENCES `m_matrices` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_processes_prepare_per_qty_rate_type_m_kv_id` FOREIGN KEY (`prepare_per_qty_rate_type_m_kv_id`) REFERENCES `m_kvs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_m_processes_prepare_per_qty_speed_m_matrix_id` FOREIGN KEY (`prepare_per_qty_speed_m_matrix_id`) REFERENCES `m_matrices` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci COMMENT='工程カテゴリーの社内作業費設定';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_processes`
--

LOCK TABLES `m_processes` WRITE;
/*!40000 ALTER TABLE `m_processes` DISABLE KEYS */;
INSERT INTO `m_processes` VALUES (2,7,1,'貼り',NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,1,NULL,NULL,NULL,NULL,'㎡','n_01',9010002,'sqm',NULL,1.0000,'2020-10-03 16:30:21','2021-03-01 17:59:44',NULL),(5,9,1,'ハーフカット',NULL,0,2,3,'300',NULL,NULL,NULL,'ロール',NULL,9010002,'materialUseNumOfRolls','ロール交換',1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,9010001,NULL,'なし',1.0000,1,1,1,NULL,NULL,NULL,NULL,NULL,'n_02',9010002,'halfcutPathLength','カット加工',1.0000,'2021-02-20 16:41:07','2021-03-23 15:50:54',NULL),(6,9,2,'カストリ','is_01',NULL,2,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'なし',1.0000,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,9010001,NULL,'なし',1.0000,1,2,3,'12000',NULL,NULL,NULL,'mm','n_02',9010002,'halfcutPathLength','カストリ',0.5000,'2021-02-20 16:44:42','2021-02-24 14:25:46',NULL),(7,9,3,'アプリ貼り','is_02',NULL,2,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'なし',1.0000,1,2,3,'10',NULL,NULL,NULL,NULL,NULL,9010001,NULL,'アプリ準備',1.0000,1,2,3,'180000',NULL,NULL,NULL,'mm',NULL,9010003,'n_04','貼り作業',1.0000,'2021-02-20 16:45:17','2021-03-24 18:03:51',NULL),(8,9,4,'アプリ四隅小断','is_03',NULL,2,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'なし',1.0000,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,9010001,NULL,'なし',1.0000,1,2,3,'180000',NULL,NULL,NULL,'mm',NULL,9010002,'perimeter','カット作業',1.0000,'2021-02-20 16:45:48','2021-03-24 17:35:50',NULL),(9,8,1,'カット',NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'データ準備',1.0000,0,1,3,'300',NULL,NULL,NULL,NULL,NULL,9010001,NULL,'資材ロード',1.0000,1,1,1,NULL,NULL,NULL,NULL,'mm','n_01',9010002,'pathLength','機械加工',1.0000,'2021-02-22 16:13:22','2021-03-29 15:44:55',NULL),(10,NULL,1,'AAA',NULL,1,1,1,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'A',1.0000,1,2,2,'2',NULL,NULL,NULL,NULL,NULL,9010001,NULL,'B',1.0000,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,'2021-02-22 17:57:16','2021-02-22 17:57:16',NULL),(12,1,1,'プリント',NULL,0,1,3,'300',NULL,NULL,NULL,NULL,NULL,9010002,'materialUseNumOfRolls','ロール交換',1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,9010003,'n_01','稼働',1.0000,'2021-02-22 20:28:31','2021-03-23 10:48:58',NULL),(13,3,1,'ラミネート',NULL,0,1,3,'500',NULL,NULL,NULL,NULL,NULL,9010002,'materialUseNumOfRolls','ロール交換',1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,9010003,'n_20',NULL,1.0000,'2021-02-24 15:51:31','2021-03-23 15:51:27',NULL),(14,15,1,'継ぎ',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,3,'0.6',NULL,NULL,NULL,NULL,NULL,9010003,'n_03','位置合わせ',0.5000,1,1,1,NULL,NULL,NULL,NULL,'m',NULL,9010003,'n_01','継ぎ',1.0000,'2021-02-24 17:18:27','2021-02-24 18:38:41',NULL),(16,4,1,'カット',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,9010002,'perimeterIncExt','カット',1.0000,'2021-02-27 14:08:13','2021-03-13 17:56:30',NULL),(17,19,1,'作業',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,2,NULL,10,'01_m_kv_id',NULL,NULL,NULL,9010002,'sqmIncExt','作業',1.0000,'2021-02-27 16:28:11','2021-03-24 15:00:59',NULL),(18,8,10,'原寸原稿','is_01',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,3,'60',NULL,NULL,NULL,'枚',NULL,9010001,NULL,'材料乗換',1.0000,1,1,2,NULL,31,'m_branch_id',NULL,'mm',NULL,9010002,'pathLength','ペン書き',1.0000,'2021-03-01 11:17:51','2021-03-29 15:44:48',NULL),(22,14,1,'パテ',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,1,NULL,NULL,NULL,NULL,'㎡','n_01',9010002,'sqm',NULL,1.0000,'2021-03-01 14:58:21','2021-03-01 15:29:09',NULL),(23,13,1,'塗り',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,1,NULL,NULL,NULL,NULL,'㎡','n_01',9010002,'sqm',NULL,1.0000,'2021-03-01 16:28:58','2021-03-01 16:31:06',NULL),(24,5,11,'四方 ミシン','tmp_isSewing01',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,4,2,NULL,33,'02_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength01','辺加工',1.0000,'2021-03-08 11:45:43','2021-03-24 15:48:27',NULL),(25,5,16,'四方 ハトメ','is_02',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,3,1,'120',NULL,NULL,NULL,'個',NULL,9010003,'n_03','ハトメ',1.0000,'2021-03-08 13:14:50','2021-03-24 16:10:17',NULL),(26,5,91,'綿テープ貼り',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,3,'180',NULL,NULL,NULL,'m',NULL,9010003,'tmp_cottonTapeTotalMaterLength','綿テープ',1.0000,'2021-03-12 16:34:07','2021-03-12 17:33:43',NULL),(27,5,93,'ロープカット','tmp_isRopeCut',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,3,'60',NULL,NULL,NULL,'回',NULL,9010003,'tmp_numOfRopeCut','カット',1.0000,'2021-03-12 16:35:39','2021-03-12 17:12:22',NULL),(28,5,94,'風抜き','tmp_isWindAvoid',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,3,'60',NULL,NULL,NULL,'m',NULL,9010003,'tmp_windAvoidTotalMaterLength','風抜き',1.0000,'2021-03-12 18:49:43','2021-03-12 18:49:43',NULL),(29,20,1,'データ作成',NULL,1,1,3,'1',NULL,NULL,NULL,NULL,NULL,9010003,'n_02',NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,3,'1',NULL,NULL,NULL,'時間',NULL,9010003,'n_01',NULL,1.0000,'2021-03-17 19:16:47','2021-03-24 22:04:31',NULL),(30,5,95,'あおり止め-準備','tmp_isStopTilting',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,2,'300',39,'41_m_kv_id',NULL,NULL,NULL,9010003,'tmp_calcedNumOfStopTilting','羽根作り、罫書き、位置調整',1.0000,0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,'2021-03-19 11:41:12','2021-03-19 13:20:00',NULL),(31,5,96,'あおり止め-ウェルダー','tmp_isStopTilting',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,3,'12',39,'41_m_kv_id',NULL,'箇所',NULL,9010003,'tmp_calcedNumOfStopTilting','ウェルダー',1.0000,'2021-03-19 11:48:42','2021-03-19 13:17:04',NULL),(32,5,12,'四方 ウェルダー','tmp_isWelder01',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,2,NULL,33,'02_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength01','辺加工',1.0000,'2021-03-24 16:11:30','2021-03-24 16:11:30',NULL),(33,5,21,'上下 ミシン','tmp_isSewing02',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,4,2,NULL,33,'07_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength02','辺加工',1.0000,'2021-03-08 11:45:43','2021-03-24 15:48:27',NULL),(34,5,22,'上下 ウェルダー','tmp_isWelder02',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,2,NULL,33,'07_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength02','辺加工',1.0000,'2021-03-24 16:11:30','2021-03-24 16:11:30',NULL),(35,5,26,'上下 ハトメ','is_07',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,3,1,'120',NULL,NULL,NULL,'個',NULL,9010003,'n_13','ハトメ',1.0000,'2021-03-08 13:14:50','2021-03-24 16:10:17',NULL),(36,5,31,'左右 ミシン','tmp_isSewing03',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,4,2,NULL,33,'12_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength03','辺加工',1.0000,'2021-03-08 11:45:43','2021-03-24 15:48:27',NULL),(37,5,32,'左右 ウェルダー','tmp_isWelder03',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,2,NULL,33,'12_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength03','辺加工',1.0000,'2021-03-24 16:11:30','2021-03-24 16:11:30',NULL),(38,5,36,'左右 ハトメ','is_12',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,3,1,'120',NULL,NULL,NULL,'個',NULL,9010003,'n_23','ハトメ',1.0000,'2021-03-08 13:14:50','2021-03-24 16:10:17',NULL),(39,5,41,'上 ミシン','tmp_isSewing04',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,4,2,NULL,33,'17_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength04','辺加工',1.0000,'2021-03-08 11:45:43','2021-03-24 15:48:27',NULL),(40,5,42,'上 ウェルダー','tmp_isWelder04',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,2,NULL,33,'17_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength04','辺加工',1.0000,'2021-03-24 16:11:30','2021-03-24 16:11:30',NULL),(41,5,46,'上 ハトメ','is_17',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,3,1,'120',NULL,NULL,NULL,'個',NULL,9010003,'n_33','ハトメ',1.0000,'2021-03-08 13:14:50','2021-03-24 16:10:17',NULL),(42,5,51,'下 ミシン','tmp_isSewing05',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,4,2,NULL,33,'22_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength05','辺加工',1.0000,'2021-03-08 11:45:43','2021-03-24 15:48:27',NULL),(43,5,52,'下 ウェルダー','tmp_isWelder05',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,2,NULL,33,'22_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength05','辺加工',1.0000,'2021-03-24 16:11:30','2021-03-24 16:11:30',NULL),(44,5,56,'下 ハトメ','is_22',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,3,1,'120',NULL,NULL,NULL,'個',NULL,9010003,'n_43','ハトメ',1.0000,'2021-03-08 13:14:50','2021-03-24 16:10:17',NULL),(45,5,61,'左 ミシン','tmp_isSewing06',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,4,2,NULL,33,'27_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength06','辺加工',1.0000,'2021-03-08 11:45:43','2021-03-24 15:48:27',NULL),(46,5,62,'左 ウェルダー','tmp_isWelder06',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,2,NULL,33,'27_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength06','辺加工',1.0000,'2021-03-24 16:11:30','2021-03-24 16:11:30',NULL),(47,5,66,'左 ハトメ','is_27',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,3,1,'120',NULL,NULL,NULL,'個',NULL,9010003,'n_53','ハトメ',1.0000,'2021-03-08 13:14:50','2021-03-24 16:10:17',NULL),(48,5,71,'右 ミシン','tmp_isSewing07',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,4,2,NULL,33,'32_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength07','辺加工',1.0000,'2021-03-08 11:45:43','2021-03-24 15:48:27',NULL),(49,5,72,'右 ウェルダー','tmp_isWelder07',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,2,NULL,33,'32_m_kv_id',NULL,'m',NULL,9010003,'tmp_sideLength07','辺加工',1.0000,'2021-03-24 16:11:30','2021-03-24 16:11:30',NULL),(50,5,76,'右 ハトメ','is_32',0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,3,1,'120',NULL,NULL,NULL,'個',NULL,9010003,'n_63','ハトメ',1.0000,'2021-03-08 13:14:50','2021-03-24 16:10:17',NULL),(51,8,2,'資材ロード',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,2,3,'300',NULL,NULL,NULL,NULL,NULL,9010001,NULL,'資材ロード',1.0000,0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,'2021-03-29 15:44:43','2021-03-29 15:44:43',NULL),(52,23,1,'テープカット＆貼り',NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1.0000,1,1,3,'5',NULL,NULL,NULL,NULL,NULL,9010001,NULL,'テープカット',1.0000,1,1,1,NULL,NULL,NULL,NULL,'m',NULL,9010003,'n_04','貼り',1.0000,'2021-03-30 20:04:54','2021-03-31 14:25:09',NULL);
/*!40000 ALTER TABLE `m_processes` ENABLE KEYS */;
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
