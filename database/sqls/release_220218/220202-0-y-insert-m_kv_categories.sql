INSERT INTO `m_kv_categories` VALUES ('8010', '8010', 'sm_option-key', 'システムマスタ,キー', null, null, null, '0', '2022-02-02 14:57:36', '2022-02-02 14:57:36', null);
INSERT INTO `m_kv_categories` VALUES ('8020', '8020', 'm_user_option-key', 'ユーザー設定マスタ,キー', null, null, null, '0', '2022-02-02 14:58:11', '2022-02-02 14:58:11', null);

INSERT INTO `m_kvs` VALUES ('8010001', '8010', '1', '1', '物件コピー,売価をクリア', null, null, null, null, null, null, null, null, null, null, null, null, '0', null, null, '0', '0', '2022-02-02 15:02:14', '2022-02-02 15:02:14', null);
INSERT INTO `m_kvs` VALUES ('8010002', '8010', '2', '2', '物件コピー,送料をクリア', null, null, null, null, null, null, null, null, null, null, null, null, '0', null, null, '0', '0', '2022-02-02 15:02:32', '2022-02-02 15:02:32', null);
INSERT INTO `m_kvs` VALUES ('8010011', '8010', '11', '11', '物件,サマリー表示', null, null, null, null, null, null, null, null, null, null, null, null, '0', '0:全員表示 1:ログインユーザー = 営業担当', null, '0', '0', '2022-02-02 15:03:51', '2022-02-02 15:03:51', null);

update m_kvs 
   set g_01 = 1 
  where id in (8010001,8010002,8010011) ; 

update m_kvs 
   set g_02 = 'bool'
  where id in (8010001,8010002) ; 

update m_kvs 
   set g_02 = 'number'
  where id in (8010011) ; 

