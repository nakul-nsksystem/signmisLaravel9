-- 材料明細

-- サイズを含めた名称を少し短く表記できるように全角→半角に変換
update m_materials set name = replace(name, '　', ' ') ;
update m_materials set name = replace(name, '（', '(') ;
update m_materials set name = replace(name, '）', ')') ;
update m_materials set name = replace(name, '[ ', '[') ;
update m_materials set name = replace(name, ' ]', ']') ;

update m_material_details set detail_name = replace(detail_name, '　', ' ') ;
update m_material_details set detail_name = replace(detail_name, '  ', ' ') ;
update m_material_details set detail_name = replace(detail_name, '（', '(') ;
update m_material_details set detail_name = replace(detail_name, '）', ')') ;
update m_material_details set detail_name = replace(detail_name, '[ ', '[') ;
update m_material_details set detail_name = replace(detail_name, ' ]', ']') ;
update m_material_details set detail_name = replace(detail_name, '×', 'X') ;
