INSERT INTO `m_kv_categories` (`id`, `order_no`, `kv_key`, `kv_category_name`, `is_user_editable`) VALUES ('1540', '1540', 'm_materials-ivt_div', '材料.在庫区分', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('1540001', '1540', '1', '1', '発注単位と同じ', '0', '0', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('1540002', '1540', '2', '2', '内容数', '0', '0', '0');
