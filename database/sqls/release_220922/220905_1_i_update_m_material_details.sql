-- 材料明細

-- サイズを含めた名称を少し短く表記できるように変換
update m_material_details set convert_memo = detail_name;

update m_material_details set detail_name = concat('[', FORMAT(width, 0), 'mm X ', FORMAT(height / 1000, 0), 'M' , IF(contents_qty=1, '', CONCAT(' * ', contents_qty)),  ']') 
where height >= 10000  and m_material_id in( SELECT id from m_materials where category_m_kv_id in(1350001, 1350002, 1350003, 1350011) and id not in(1203401,1203402,2203601,2203601));

