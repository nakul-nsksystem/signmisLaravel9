INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `g_01`, `g_02`, `re_invoice_flg`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES ('8010501', '8010', '501', '501', 'ポイント端数区分', '1070002', 'mkv', '0', '0', '0', '0', '2024-07-09 09:13:02', '2024-07-09 09:13:02');
INSERT INTO `sm_options` (`key_m_kv_id`, `value`, `is_user_editable`) VALUES ('8010501', '1070002', '1');


UPDATE `m_kvs` SET `target_m_kv_category_id` = '1070' WHERE (`id` = '8010501');


INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `g_01`, `g_02`, `re_invoice_flg`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('8010502', '8010', '502', '502', '制作Pt一括設定率', '3', 'number', '0', '0', '0', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `g_01`, `g_02`, `re_invoice_flg`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('8010503', '8010', '503', '503', '営業Pt一括設定率', '3', 'number', '0', '0', '0', '0');


INSERT INTO `sm_options` (`key_m_kv_id`, `value`, `is_user_editable`) VALUES ('8010502', '3', '1');
INSERT INTO `sm_options` (`key_m_kv_id`, `value`, `is_user_editable`) VALUES ('8010503', '3', '1');


INSERT INTO `m_role_key_categories` (`id`, `order_no`, `name`, `explanation`) VALUES ('13', '99', 'point-role', 'ポイント');
INSERT INTO `m_role_keys` (`id`, `m_role_key_category_id`, `order_no`, `name`, `explanation`, `system_flg`, `memo`) VALUES ('33', '13', '992', 'point_admin-privilege', 'ポイント管理者権', '1', '10~:アクセス可能');
