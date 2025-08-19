-- 仕入
ALTER TABLE t_p_invoices
ADD COLUMN contact VARCHAR(1024) NULL DEFAULT NULL COMMENT '仕入先担当者' AFTER tax_reduced;

-- 仕入№を更新(200000以降)
ALTER TABLE t_p_invoices AUTO_INCREMENT = 200000 ;
