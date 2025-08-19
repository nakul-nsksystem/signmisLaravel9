INSERT INTO `m_kv_categories` (`id`, `order_no`, `kv_key`, `kv_category_name`, `is_user_editable`) VALUES ('1055', '1055', 'sales_management-mailng_type', '販売管理.郵送区分', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('1055001', '1055', '1', '1', 'メール',  '0', '0', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('1055002', '1055', '2', '2', '郵送', '0', '0', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('1055003', '1055', '3', '3', '指定のみ','0', '0', '0');
