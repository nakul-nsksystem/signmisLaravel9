-- 区分

-- 関連する区分追加
INSERT INTO m_kv_categories (id, order_no, kv_key, kv_category_name, is_user_editable, created_at, updated_at) VALUES ('1205', '20', 'sales_management-purchase', '販売管理.仕入区分', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1200005', '1200', '5', '5', '記入用', '4', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
UPDATE m_kvs SET g_01 = 0 WHERE (id = '1200001');
UPDATE m_kvs SET g_01 = 0 WHERE (id = '1200002');
UPDATE m_kvs SET g_01 = 0 WHERE (id = '1200003');
UPDATE m_kvs SET g_01 = 0 WHERE (id = '1200004');

UPDATE m_kvs SET kv_name = 'その他', g_01 = '4' WHERE (id = '1270004');
DELETE FROM m_kvs WHERE (id = '1270005');

INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, system_memo, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1205001', '1205', '1', '1', '仕入', '0', '0', 't_p_invoice_details.purchase_m_kv_id', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1205002', '1205', '2', '2', '返品', '0', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1205003', '1205', '3', '3', '値引', '0', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1205004', '1205', '4', '4', '調整', '0', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1205005', '1205', '5', '5', '記入用', '4', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
UPDATE m_kvs SET system_memo = 't_sale_details.ship_m_kv_id' WHERE (id = '1200001');
UPDATE m_kvs SET system_memo = 't_p_invoice_details.accounts_title_m_kv_id' WHERE (id = '1265000');

INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, system_memo, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1270000', '1270', '0', '0', '未設定', '0', 't_sale_details.classification_m_kv_id', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
UPDATE m_kvs SET g_01 = NULL WHERE (id = '1270001');
UPDATE m_kvs SET g_01 = NULL WHERE (id = '1270002');
UPDATE m_kvs SET g_01 = NULL WHERE (id = '1270003');
UPDATE m_kvs SET g_01 = NULL WHERE (id = '1270004');

UPDATE m_kv_categories SET kv_key = 'sales_management-classification' WHERE (id = '1270');
UPDATE m_kv_categories SET kv_key = 'sales_management-accounts_title' WHERE (id = '1265');

UPDATE m_kvs SET deleted_at = '2000-01-01 00:00:00' WHERE (id = '1200004');
UPDATE m_kvs SET deleted_at = '2000-01-01 00:00:00' WHERE (id = '1205004');
