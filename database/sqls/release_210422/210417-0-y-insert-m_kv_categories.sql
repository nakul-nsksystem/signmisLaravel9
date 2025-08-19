/*
Navicat MySQL Data Transfer

Source Server         : 2019-47
Source Server Version : 80023
Source Host           : 192.168.0.47:3306
Source Database       : signmis

Target Server Type    : MYSQL
Target Server Version : 80023
File Encoding         : 65001

Date: 2021-04-17 11:11:29
*/


-- ----------------------------
-- Records of m_kv_categories
-- ----------------------------
INSERT INTO `m_kv_categories` VALUES ('3110', '3110', 't_project_product_warranty', '物件商品.保証', null, null, null, '0', '2021-04-17 11:01:53', '2021-04-17 11:01:53', null);
INSERT INTO `m_kv_categories` VALUES ('3120', '3120', 't_project_product_specified', '物件商品.指定', null, null, null, '0', '2021-04-17 11:02:02', '2021-04-17 11:02:02', null);

-- ----------------------------
-- Records of m_kvs
-- ----------------------------
INSERT INTO `m_kvs` VALUES ('3110001', '3110', '1', '1', 'MCS', null, null, 'badge-success', null, null, null, null, null, null, null, null, null, '0', null, null, '0', '0', '2021-04-17 11:04:36', '2021-04-17 11:04:36', null);
INSERT INTO `m_kvs` VALUES ('3120001', '3120', '1', '1', '不燃', null, null, 'badge-danger', null, null, null, null, null, null, null, null, null, '0', null, null, '0', '0', '2021-04-17 11:05:10', '2021-04-17 11:05:10', null);
INSERT INTO `m_kvs` VALUES ('3120002', '3120', '2', '2', '防炎', null, null, 'badge-warning', null, null, null, null, null, null, null, null, null, '0', null, null, '0', '0', '2021-04-17 11:05:33', '2021-04-17 11:05:33', null);
