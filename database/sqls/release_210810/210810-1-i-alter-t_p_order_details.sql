-- 発注明細 仕入完了日追加

ALTER TABLE t_p_order_details 
ADD COLUMN purchase_completed_at DATETIME NULL COMMENT '仕入完了日' AFTER due_date;
