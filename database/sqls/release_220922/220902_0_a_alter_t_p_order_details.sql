ALTER TABLE `t_p_order_details` 
DROP COLUMN `approved_m_user_id`,
DROP COLUMN `approved_at`,
DROP COLUMN `approved`,
CHANGE COLUMN `material_name` `po_material_name` VARCHAR(1024) NULL DEFAULT NULL COMMENT '品名・銘柄' ;

ALTER TABLE `t_p_order_details` 
ADD COLUMN `material_name` VARCHAR(1024) NULL DEFAULT NULL COMMENT '材料名（銘柄のみ）仕入れで使用' AFTER `m_material_detail_id`;

update t_p_order_details as tpd
left join m_material_details as matdet on tpd.m_material_detail_id = matdet.id
left join m_materials as mat on matdet.m_material_id = mat.id 
set material_name = 
case when m_material_detail_id is not null then mat.name
else po_material_name end;


