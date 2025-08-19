INSERT INTO `m_kv_categories` (`id`, `order_no`, `kv_key`, `kv_category_name`, `is_user_editable`) VALUES ('5010', '5010', 't_inventory-division', '在庫区分', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('5010010', '5010', '10', '10', '入庫', '0', '0', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('5010020', '5010', '20', '20', '出庫', '0', '0', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('5010030', '5010', '30', '30', '調整', '0', '0', '0');
