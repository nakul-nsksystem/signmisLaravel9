INSERT INTO `m_role_keys` (`id`, `m_role_key_category_id`, `order_no`, `name`, `explanation`, `system_flg`, `memo`) VALUES ('23', '1', '20', 't_project-estimate-approve', '物件見積承認権限', '1', '10~承認権限有り');
INSERT INTO `m_roles` (`id`, `name`) VALUES ('23', '見積承認者');
INSERT INTO `m_role_details` (`m_role_id`, `m_role_key_id`, `control_level`) VALUES ('23', '23', '10');
