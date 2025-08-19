-- 取引先 
-- 販売管理連携用CDを設定
ALTER TABLE m_customers
ADD COLUMN data_linkage_cd VARCHAR(80) NULL DEFAULT NULL COMMENT '連携用CD' AFTER delivery_format_m_kv_id ;

-- 販売管理連携用CDを更新 
UPDATE m_customers SET data_linkage_cd = convert_memo WHERE convert_memo IS NOT NULL ;
UPDATE m_customers SET convert_memo    = NULL         WHERE convert_memo IS NOT NULL ;

-- 営業担当者更新
-- 東京(売)
UPDATE m_customers SET sales_m_user_id = 1017 WHERE m_branch_id = 2 AND dealing_m_kv_id = 1010001 ; 
-- 東京(買)
UPDATE m_customers SET sales_m_user_id = 201  WHERE m_branch_id = 2 AND dealing_m_kv_id = 1010002 ; 
-- 名古屋(売)
UPDATE m_customers SET sales_m_user_id = 302  WHERE m_branch_id = 3 AND dealing_m_kv_id = 1010001 ; 
-- 名古屋(買)
UPDATE m_customers SET sales_m_user_id = 301  WHERE m_branch_id = 3 AND dealing_m_kv_id = 1010002 ; 
