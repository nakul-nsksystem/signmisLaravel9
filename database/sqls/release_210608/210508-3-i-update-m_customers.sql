-- 取引先マスタの仕入カテゴリーを更新

INSERT INTO m_tag_links (m_tag_id, m_tag_link_id, m_tag_link_type)
SELECT 10402, id, 'App\\Models\\MCustomer' FROM m_customers WHERE dealing_m_kv_id = 1010004;

UPDATE m_customers SET dealing_m_kv_id = 1010002 WHERE dealing_m_kv_id = 1010004 ;

UPDATE m_kvs SET deleted_at = '2000-01-01' WHERE id = 1010004 ;
