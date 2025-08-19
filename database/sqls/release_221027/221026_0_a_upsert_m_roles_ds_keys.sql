UPDATE `m_role_keys` SET `explanation` = '連携アクセス権' WHERE (`id` = '8');
UPDATE `m_role_keys` SET `m_role_key_category_id` = '7', `order_no` = '71', `name` = 'rel_export-privilege' WHERE (`id` = '19');
INSERT INTO `m_role_keys` (`id`, `m_role_key_category_id`, `order_no`, `name`, `explanation`, `system_flg`, `memo`) VALUES ('21', '7', '75', 'rel_rt_ss_order-privilege', 'SS連携', '1', '30~:連携可能');
UPDATE `m_role_key_categories` SET `deleted_at` = '2022-09-15 17:39:13' WHERE (`id` = '10');
INSERT INTO `m_role_details` (`id`, `m_role_id`, `m_role_key_id`, `control_level`) VALUES ('214', '6', '21', '30');
INSERT INTO `m_role_details` (`id`, `m_role_id`, `m_role_key_id`, `control_level`) VALUES ('215', '18', '21', '30');
UPDATE `m_role_details` SET `control_level` = '30' WHERE (`id` = '128');
