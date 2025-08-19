-- 売上明細

-- 関連する区分追加
UPDATE m_kv_categories SET order_no = 24 WHERE (id = 1235) ;
UPDATE m_kv_categories SET order_no = 25 WHERE (id = 1265) ;

INSERT INTO m_kv_categories (id, order_no, kv_key, kv_category_name, is_user_editable, created_at, updated_at) VALUES ('1270', '26', 'sales_management-classification_m_kv_id', '販売管理.分類区分', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1265000', '1265', '0', '0', '未設定', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1270001', '1270', '1', '1', '一般商品', '0', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1270002', '1270', '2', '2', '材料', '0', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1270003', '1270', '3', '3', '経費・雑費', '2', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1270004', '1270', '4', '4', '値引', '3', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1270005', '1270', '5', '5', '記入用', '4', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

-- 分類[一般商品]にリセット
UPDATE t_sale_details SET classification_m_kv_id = 1270001 ;

-- 売上明細 リレーション再定義
ALTER TABLE t_sale_details 
CHANGE COLUMN classification_m_kv_id classification_m_kv_id INT NOT NULL COMMENT '分類区分' ,
ADD INDEX fk_t_sale_details_classification_m_kv_id (classification_m_kv_id ASC) ;
;

ALTER TABLE t_sale_details 
ADD CONSTRAINT fk_t_sale_details_classification_m_kv_id
  FOREIGN KEY (classification_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE t_sale_details 
CHANGE COLUMN classification_m_kv_id classification_m_kv_id INT NOT NULL COMMENT '分類区分' ;

-- 仕入明細 科目は未設定にリセット
UPDATE t_p_invoice_details SET accounts_title_m_kv_id = 1265000 ;

