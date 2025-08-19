ALTER TABLE `m_material_details` 
ADD COLUMN `ivt_div_m_kv_id` INT NULL DEFAULT NULL COMMENT '在庫管理単位区分id' AFTER `delivery_calc_m_kv_id`;

update m_material_details
join m_materials
on m_material_details.m_material_id = m_materials.id
set ivt_div_m_kv_id = 1540001
where m_materials.is_stocked = "1"