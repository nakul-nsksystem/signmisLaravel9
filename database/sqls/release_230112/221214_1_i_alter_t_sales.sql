-- 売上

-- 出力済みのフラグを持たせる
ALTER TABLE t_sales 
CHANGE COLUMN is_output is_output TINYINT(1) NOT NULL DEFAULT '0' COMMENT '出力済' ;
