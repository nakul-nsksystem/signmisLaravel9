-- 売上 最終更新日追加
ALTER TABLE t_sales 
ADD COLUMN inc_children_updated_m_user_id INT NULL COMMENT '子テーブル含む 最終更新者ID' AFTER updated_m_user_id,
ADD COLUMN inc_children_updated_at DATETIME NULL COMMENT '子テーブル含む 最終更新日' AFTER updated_at,
ADD INDEX fk_t_sales_inc_children_updated_m_user_id (inc_children_updated_m_user_id ASC)
;

ALTER TABLE t_sales 
ADD CONSTRAINT fk_t_sales_inc_children_updated_m_user_id
  FOREIGN KEY (inc_children_updated_m_user_id)
  REFERENCES m_users (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
;
