-- 仕入カテゴリータグ

INSERT INTO m_tag_categories (id, order_no, tag_category_key, tag_category_name, is_user_editable, created_at, updated_at) 
VALUES ('4', '4', 'm_customers-purchas_category', '取引先 - 仕入カテゴリー', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00')
;

INSERT INTO m_tags (id, order_no, m_tag_category_id, tag_key, tag_name, tag_color_m_kv_id, is_user_editable, created_at, updated_at) 
VALUES ('10401', '1', '4', 'm_customers-purchas_category_construction', '施工', '1340001', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00')
;

INSERT INTO m_tags (id, order_no, m_tag_category_id, tag_key, tag_name, tag_color_m_kv_id, is_user_editable, created_at, updated_at) 
VALUES ('10402', '2', '4', 'm_customers-purchas_category_outsourcing', '外注', '1340002', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00')
;

