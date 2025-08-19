-- 仕入・金額 列名変更
ALTER TABLE t_p_invoices 
CHANGE COLUMN price_total total_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '金額' ;

ALTER TABLE t_p_invoice_details 
CHANGE COLUMN price_total total_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '金額' ;

-- 仕入 最終更新日追加
ALTER TABLE t_p_invoices 
ADD COLUMN inc_children_updated_m_user_id INT NULL COMMENT '子テーブル含む 最終更新者ID' AFTER updated_m_user_id,
ADD COLUMN inc_children_updated_at DATETIME NULL COMMENT '子テーブル含む 最終更新日' AFTER updated_at,
ADD INDEX fk_t_p_invoices_inc_children_updated_m_user_id (inc_children_updated_m_user_id ASC)
;

ALTER TABLE t_p_invoices 
ADD CONSTRAINT fk_t_p_invoices_inc_children_updated_m_user_id
  FOREIGN KEY (inc_children_updated_m_user_id)
  REFERENCES m_users (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
;
