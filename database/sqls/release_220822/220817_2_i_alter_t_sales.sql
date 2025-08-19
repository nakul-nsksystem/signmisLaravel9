-- 売上
ALTER TABLE t_sales
ADD COLUMN contact VARCHAR(1024) NULL DEFAULT NULL COMMENT '客先担当者' AFTER tax_reduced;

-- 売上№を更新(200000以降)
UPDATE t_sales SET id = id + 198000 WHERE id < 200000;
