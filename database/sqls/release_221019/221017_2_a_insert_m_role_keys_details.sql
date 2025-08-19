INSERT INTO `m_role_keys` (`id`, `m_role_key_category_id`, `order_no`, `name`, `explanation`, `system_flg`, `memo`) VALUES ('20', '3', '32', 't_p_order-price-view-privilege', '発注金額表示権', '1', '10~:表示権限有り');
INSERT INTO `m_role_details` (`id`, `m_role_id`, `m_role_key_id`, `control_level`) VALUES ('213', '6', '20', '30');
