INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `g_01`, `g_02`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('8010301', '8010', '301', '301', '物件最低利益率', '15', 'number', '0', '0', '0');
INSERT INTO `sm_options` (`id`, `key_m_kv_id`, `value`) VALUES ('31', '8010301', '-9999');
UPDATE `m_kvs` SET `system_memo` = '値%以下の利益率の場合、見積承認が必要' WHERE (`id` = '8010301');
