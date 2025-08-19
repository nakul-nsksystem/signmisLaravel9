INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `system_memo`, `is_user_editable`, `re_invoice_flg`, `created_m_user_id`, `updated_m_user_id`) VALUES ('8010401','8010','401','401','販売管理:編集可能期間','年: y or year, 月: M or month, 週: w or week, 日: d or day, 時: h or hour, 分: m or minute, 秒: s or second,','0','0','0','0');
UPDATE `m_kvs`　SET `g_01`='6M'　WHERE (`m_kvs`.`id` = 8010401);
INSERT INTO `sm_options` (`id`, `key_m_kv_id`, `value`, `is_user_editable`, `created_at`, `updated_at`) VALUES (32, 8010401, '12M', 0, '2024-04-05 10:59:03', '2024-04-05 10:59:03');

