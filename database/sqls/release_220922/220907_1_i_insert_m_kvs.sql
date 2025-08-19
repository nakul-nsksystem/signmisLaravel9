-- 区分

-- 納品書区分追加
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, system_memo, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1080006', '1080', '6', '6', '本伝B(控/納)', '0', '', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

UPDATE m_kvs SET kv_name = '本伝A [控/納/受]',  g_01 = 't_sales.delivery_note_standard'  WHERE (id = '1080001');
UPDATE m_kvs SET kv_name = '本伝B [控/納]',     g_01 = 't_sales.delivery_note_special'   WHERE (id = '1080002');
UPDATE m_kvs SET kv_name = '仮伝'                                                        WHERE (id = '1080003');
UPDATE m_kvs SET kv_name = '仮伝 [下請]',       deleted_at = '2000-01-01'                WHERE (id = '1080004');
UPDATE m_kvs SET kv_name = '仮伝 [孫請]',       deleted_at = '2000-01-01'                WHERE (id = '1080005');
UPDATE m_kvs SET kv_name = '仮伝 [手書き]',     deleted_at = '2000-01-01'                WHERE (id = '1080006');

UPDATE m_kv_categories SET system_memo = 'g_01:{納品書を呼び出すクラス名[t_sales.***]を記述},' WHERE (id = '1080');

