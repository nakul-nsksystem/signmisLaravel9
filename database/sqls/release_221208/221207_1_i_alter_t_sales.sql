-- 売上

-- 出力済みのフラグを持たせる
ALTER TABLE t_sales 
ADD COLUMN is_output INT NOT NULL DEFAULT 0 COMMENT '出力済' AFTER tax_reduced ;

UPDATE t_sales SET is_output = 0 WHERE id >= 0 ;
