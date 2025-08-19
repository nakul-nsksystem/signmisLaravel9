
-- 勘定科目設定 現地反映済
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES ('1265010', '1265', '10', '10', '売掛金', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES ('1265020', '1265', '20', '20', '消費税', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
UPDATE `m_kvs` SET `g_01` = 'A' WHERE (`id` = '1265001');
UPDATE `m_kvs` SET `g_01` = 'B' WHERE (`id` = '1265002');
UPDATE `m_kvs` SET `kv_name` = '工事経費', `g_01` = 'C' WHERE (`id` = '1265003');
UPDATE `m_kvs` SET `kv_name` = '営業経費', `g_01` = 'D' WHERE (`id` = '1265004');
UPDATE `m_kvs` SET `kv_name` = 'その他', `g_01` = 'E' WHERE (`id` = '1265005');

update m_customers 
set accounts_title_m_kv_id = 1265010
where accounts_title_m_kv_id = 1265004 ;

update m_customers 
join m_kvs on m_kvs.g_01 = SUBSTRING(m_customers.data_linkage_cd ,1 ,1) and m_kvs.m_kv_category_id = 1265 
set m_customers.accounts_title_m_kv_id = m_kvs.id
where dealing_m_kv_id in (1010000,1010002) and m_customers.deleted_at is null and data_linkage_cd is not null and m_branch_id = 1 ;

update m_customers 
join m_kvs on m_kvs.g_01 = SUBSTRING(m_customers.data_linkage_cd ,2 ,1) and m_kvs.m_kv_category_id = 1265 
set m_customers.accounts_title_m_kv_id = m_kvs.id
where dealing_m_kv_id in (1010000,1010002) and m_customers.deleted_at is null and data_linkage_cd is not null and m_branch_id in (2 , 3 ) ;