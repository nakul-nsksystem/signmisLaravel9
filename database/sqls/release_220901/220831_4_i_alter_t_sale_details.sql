-- 売上明細

-- カラム名変更
ALTER TABLE t_sale_details 
DROP FOREIGN KEY fk_t_sale_details_ship_s_m_kv_id;

ALTER TABLE t_sale_details 
CHANGE COLUMN ship_s_m_kv_id ship_m_kv_id INT NOT NULL COMMENT '出荷区分' ,
DROP INDEX fk_t_sale_details_ship_s_m_kv_id ,
ADD INDEX fk_t_sale_details_ship_m_kv_id (ship_m_kv_id ASC) VISIBLE;
;

ALTER TABLE t_sale_details 
ADD CONSTRAINT fk_t_sale_details_ship_m_kv_id
  FOREIGN KEY (ship_m_kv_id)
  REFERENCES m_kvs (id)
  ON UPDATE CASCADE;

-- 分類[未設定]にリセット
UPDATE t_sale_details SET classification_m_kv_id = 1270000 ;

