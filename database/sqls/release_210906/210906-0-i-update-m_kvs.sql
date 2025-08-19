-- 区分
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) 
VALUES ('1170009', '1170', '3', '9', '内税', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

UPDATE m_kvs SET kv_name = '通常税率(10%)' WHERE (id = '1170001');
UPDATE m_kvs SET kv_name = '軽減税率(8%)' WHERE (id = '1170002');

