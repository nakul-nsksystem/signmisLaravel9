INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `system_memo`, `created_m_user_id`, `updated_m_user_id`) VALUES ('8010201', '8010', '201', '201', '発注メール運用レベル', '0', '0:debug用 1:ログインユーザーのemail 2:仕入れ先のemail', '0', '0');
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `system_memo`, `created_m_user_id`, `updated_m_user_id`) VALUES ('8010202', '8010', '202', '202', '発送完了メール運用レベル', '0', '0:debug用 1:ログインユーザーのemail 2:発送先のemail', '0', '0');
UPDATE `m_kvs` SET `g_01` = '1' WHERE (`id` = '8010201');
UPDATE `m_kvs` SET `g_01` = '1' WHERE (`id` = '8010202');
