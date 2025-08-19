INSERT INTO `m_role_keys` VALUES ('17', '8', '250', 'm_customer_info-privilege', '取引先付加マスタ 権限', '1', '10~:営業担当=ログイン編集 20~:編集 100:全権', '2022-05-25 17:00:25', '2022-05-25 17:00:25', null);
INSERT INTO `m_role_keys` VALUES ('18', '8', '261', 'm_customer_info-ref-price-privilege', '取引先付加情報マスタ 参考単価権限', '1', '10~:表示のみ 20~:編集 100:全権', '2022-05-25 17:13:23', '2022-05-25 17:13:23', null);

UPDATE `m_role_keys` SET `order_no`='100' WHERE (`id`='11') ;
UPDATE `m_role_keys` SET `order_no`='200' WHERE (`id`='12') ;
UPDATE `m_role_keys` SET `order_no`='900' WHERE (`id`='13') ;


INSERT INTO `m_role_details` (m_role_id , m_role_key_id, control_level) VALUES ( '6', '17', '100');
INSERT INTO `m_role_details` (m_role_id , m_role_key_id, control_level) VALUES ( '6', '18', '100');
INSERT INTO `m_role_details` (m_role_id , m_role_key_id, control_level) VALUES ( '8', '17', '10');
INSERT INTO `m_role_details` (m_role_id , m_role_key_id, control_level) VALUES ( '8', '18', '20');
