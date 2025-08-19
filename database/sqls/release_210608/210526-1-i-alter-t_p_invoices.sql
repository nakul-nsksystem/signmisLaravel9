-- 仕入
ALTER TABLE t_p_invoices COMMENT = '仕入' ;

ALTER TABLE t_p_invoices 
CHANGE COLUMN tax tax DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '消費税' ,
CHANGE COLUMN m_branch_id m_branch_id INT NOT NULL COMMENT '拠点id' ,
CHANGE COLUMN supplier_m_customer_id supplier_m_customer_id INT NOT NULL COMMENT '仕入先id' ,
CHANGE COLUMN m_user_id m_user_id INT NULL DEFAULT NULL COMMENT '担当者id' 
;


ALTER TABLE t_p_invoice_details COMMENT = '仕入明細' ;

ALTER TABLE t_p_invoice_details 
CHANGE COLUMN t_p_invoice_id t_p_invoice_id INT NOT NULL COMMENT '仕入id' ,
CHANGE COLUMN m_material_detail_id m_material_detail_id INT NULL DEFAULT NULL COMMENT '材料明細id' ,
CHANGE COLUMN material_name material_name VARCHAR(1024) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL COMMENT '材料名' ,
CHANGE COLUMN material_size_x material_size_x DECIMAL(15,4) NULL DEFAULT '0.0000' COMMENT '材料サイズX' ,
CHANGE COLUMN material_size_y material_size_y DECIMAL(15,4) NULL DEFAULT '0.0000' COMMENT '材料サイスY' ,
CHANGE COLUMN tax tax DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '消費税'
;

