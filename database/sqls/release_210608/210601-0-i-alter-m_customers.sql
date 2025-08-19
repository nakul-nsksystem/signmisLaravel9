-- 納品形式

ALTER TABLE m_customers 
ADD COLUMN delivery_format_m_kv_id INT NULL COMMENT '納品形式区分' AFTER payment_notice_m_kv_id
;

INSERT INTO m_kv_categories (id, order_no, kv_key, kv_category_name, is_user_editable, created_at, updated_at) VALUES ('1235', '1235', 'sales_management-delivery_format', '販売管理.納品形式区分', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, system_memo, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1235001', '1235', '1', '1', '一式', '0', '', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, system_memo, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1235002', '1235', '2', '2', '明細', '0', '', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

ALTER TABLE m_customers 
ADD INDEX fk_m_customers_delivery_format_m_kv_id (delivery_format_m_kv_id ASC) ;

ALTER TABLE m_customers 
ADD CONSTRAINT fk_m_customers_delivery_format_m_kv_id
  FOREIGN KEY (delivery_format_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

