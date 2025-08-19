-- 権限・メニュー
INSERT INTO m_role_key_categories (id, order_no, name, explanation, created_at, updated_at) VALUES (NULL, '55', 't_complete-role', '締関係', '2021-09-14', '2021-09-14');

INSERT INTO m_role_keys (id, m_role_key_category_id, order_no, name, explanation, system_flg, created_at, updated_at) VALUES (NULL, '9', '10', 't_complete-privilege', '締アクセス権', '1', '2021-09-14', '2021-09-14');
UPDATE m_role_keys SET name = 't_sale-privilege' WHERE (id = '6');

INSERT INTO m_role_details (id, m_role_id, m_role_key_id, control_level, created_at, updated_at) VALUES (NULL, '6', '16', '30', '2021-09-14', '2021-09-14');
INSERT INTO m_role_details (id, m_role_id, m_role_key_id, control_level, created_at, updated_at) VALUES (NULL, '18', '16', '30', '2021-09-14', '2021-09-14');

UPDATE m_role_key_categories SET name = 't_sale-role' WHERE (id = '5');

