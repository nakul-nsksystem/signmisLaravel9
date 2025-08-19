update m_kvs 
    set order_no = order_no * 10 
 where id in (2010001 , 2010002 ,2010003 ,2010004 ,2010005 ,2010006   ) ; 
 
INSERT INTO `m_kvs` VALUES ('2010007', '2010', '13', '7', '袋 片方ころし', null, '2170', '0', '0', null, null, null, null, null, null, null, null, '0', null, null, '0', '0', '2021-06-18 18:43:07', '2021-06-18 18:43:07', null);
INSERT INTO `m_kvs` VALUES ('2010008', '2010', '15', '8', '袋 両方ころし', null, '2180', '0', '0', null, null, null, null, null, null, null, null, '0', null, null, '0', '0', '2021-06-18 18:45:54', '2021-06-18 18:45:54', null);

update m_kv_categories set kv_key = 't_project_product_process-post-cartain-type_bag_one_close' where id = 2170 ; 
update m_kv_categories set kv_key = 't_project_product_process-post-cartain-type_bag_both_close' where id = 2180 ; 

INSERT INTO `m_kvs` VALUES ('2170001', '2170', '1', '1', 'ミシン１本', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:17:40', '2020-11-12 20:17:40', null);
INSERT INTO `m_kvs` VALUES ('2170002', '2170', '2', '2', 'ミシン２本', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:18:01', '2020-11-12 20:18:01', null);
INSERT INTO `m_kvs` VALUES ('2170003', '2170', '3', '3', 'ウェルダー', null, null, '1', '0', '0', '0', '1', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:18:14', '2020-11-12 20:18:14', null);
INSERT INTO `m_kvs` VALUES ('2170004', '2170', '4', '4', 'マジックテープ', null, null, '0', '1', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:18:32', '2020-11-12 20:18:32', null);
INSERT INTO `m_kvs` VALUES ('2170005', '2170', '5', '5', 'ミシン１本+べろウェルダー', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2021-06-04 14:04:35', '2021-06-04 14:04:35', null);
INSERT INTO `m_kvs` VALUES ('2170006', '2170', '6', '6', 'ミシン２本+べろウェルダー', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2021-06-04 14:04:51', '2021-06-04 14:04:51', null);
INSERT INTO `m_kvs` VALUES ('2170007', '2170', '7', '7', 'ウェルダー+べろウェルダー', null, null, '1', '0', '0', '0', '1', null, null, null, null, null, '0', '袋', null, '0', '0', '2021-06-04 14:05:09', '2021-06-04 14:05:09', null);

INSERT INTO `m_kvs` VALUES ('2180001', '2180', '1', '1', 'ミシン１本', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:17:40', '2020-11-12 20:17:40', null);
INSERT INTO `m_kvs` VALUES ('2180002', '2180', '2', '2', 'ミシン２本', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:18:01', '2020-11-12 20:18:01', null);
INSERT INTO `m_kvs` VALUES ('2180003', '2180', '3', '3', 'ウェルダー', null, null, '1', '0', '0', '0', '1', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:18:14', '2020-11-12 20:18:14', null);
INSERT INTO `m_kvs` VALUES ('2180004', '2180', '4', '4', 'マジックテープ', null, null, '0', '1', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2020-11-12 20:18:32', '2020-11-12 20:18:32', null);
INSERT INTO `m_kvs` VALUES ('2180005', '2180', '5', '5', 'ミシン１本+べろウェルダー', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2021-06-04 14:04:35', '2021-06-04 14:04:35', null);
INSERT INTO `m_kvs` VALUES ('2180006', '2180', '6', '6', 'ミシン２本+べろウェルダー', null, null, '1', '0', '0', '1', '0', null, null, null, null, null, '0', '袋', null, '0', '0', '2021-06-04 14:04:51', '2021-06-04 14:04:51', null);
INSERT INTO `m_kvs` VALUES ('2180007', '2180', '7', '7', 'ウェルダー+べろウェルダー', null, null, '1', '0', '0', '0', '1', null, null, null, null, null, '0', '袋', null, '0', '0', '2021-06-04 14:05:09', '2021-06-04 14:05:09', null);

UPDATE `signmis`.`m_kv_categories` SET `system_memo` = 'g_01:綿テープ 1:有 0:無 ,g_02:ロープ出しロープ 1:有 0:無  03:ころしウェルダーmm数' WHERE (`id` = '2010');

UPDATE `m_kvs` SET `g_03` = '0' WHERE (`id` = '2010001');
UPDATE `m_kvs` SET `g_03` = '0' WHERE (`id` = '2010002');
UPDATE `m_kvs` SET `g_03` = '0' WHERE (`id` = '2010003');
UPDATE `m_kvs` SET `g_03` = '0' WHERE (`id` = '2010004');
UPDATE `m_kvs` SET `g_03` = '0' WHERE (`id` = '2010005');
UPDATE `m_kvs` SET `g_03` = '0' WHERE (`id` = '2010006');
UPDATE `m_kvs` SET `g_03` = '500' WHERE (`id` = '2010007');
UPDATE `m_kvs` SET `g_03` = '1000' WHERE (`id` = '2010008');

