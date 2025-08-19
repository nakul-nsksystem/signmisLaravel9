-- 材料に税区分を追加
ALTER TABLE m_material_details 
ADD COLUMN tax_m_kv_id INT NULL DEFAULT 1170001 COMMENT '税区分' AFTER delivery_calc_m_kv_id,
ADD INDEX fk_m_material_details_tax_m_kv_id (tax_m_kv_id ASC) VISIBLE
;

ALTER TABLE m_material_details 
ADD CONSTRAINT fk_m_material_details_tax_m_kv_id
  FOREIGN KEY (tax_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
;

update m_material_details set tax_m_kv_id = 1170001 ;

UPDATE m_customers SET name = '' WHERE (id = '0');

-- その他カテゴリ
INSERT INTO m_kv_categories (id, order_no, kv_key, kv_category_name, is_user_editable, created_at, updated_at) VALUES ('1430', '1430', 'm_materials-sub_category_m_kv_id_etc', '材料.サブカテゴリ[その他]', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, target_m_kv_category_id, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1350099', '1350', '30', '30', 'その他', '1430', NULL, '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, g_02, g_03, g_04, g_06, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1430001', '1430', '1', '1', '非課税', NULL, NULL, NULL, NULL, '0', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

-- 消費税率を設定
UPDATE m_kvs SET g_01 = 0  WHERE (id = '1170000');
UPDATE m_kvs SET g_01 = 10 WHERE (id = '1170001');
UPDATE m_kvs SET g_01 = 8  WHERE (id = '1170002');
UPDATE m_kvs SET g_01 = 0  WHERE (id = '1170009');
