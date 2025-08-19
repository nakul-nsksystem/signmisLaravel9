-- 売上明細
ALTER TABLE t_sale_details
ADD COLUMN classification_m_kv_id INT NULL COMMENT '分類区分' AFTER delivery_note_disp_m_kv_id;
UPDATE t_sale_details SET classification_m_kv_id = 0 ;

