-- 取引先 

-- 東京(売)
-- 本伝Bに変更
UPDATE m_customers 
SET delivery_note_m_kv_id = 1080002
WHERE m_branch_id = 2 AND dealing_m_kv_id = 1010001 ; 

-- 納品形式が設定されてない取引先は明細に変更
UPDATE m_customers 
SET delivery_format_m_kv_id = 1235002
WHERE m_branch_id = 2 AND dealing_m_kv_id = 1010001 AND delivery_format_m_kv_id IS NULL ; 

