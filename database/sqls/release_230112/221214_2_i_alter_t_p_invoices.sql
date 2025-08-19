-- 仕入

-- 出力済みのフラグを持たせる
ALTER TABLE t_p_invoices 
CHANGE COLUMN is_output is_output TINYINT(1) NOT NULL DEFAULT '0' COMMENT '出力済' ;
