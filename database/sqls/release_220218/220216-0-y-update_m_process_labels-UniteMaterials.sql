


update m_process_labels
   set is_computed_name = 'IsCustomerProvide|dvalue' 
 where is_computed_name = 'cIsCustomerProvide' 
   and m_process_category_id = 7  ; 


update m_process_labels
   set formula = 'MProductionName01|dvalue' 
 where formula = 'm$cSelectedMProductionName01' 
   and m_process_category_id = 7  ; 

update m_process_labels
   set formula = 'MProductionModeName01|dvalue' 
 where formula = 'm$cSelectedMProductionModeName01' 
   and m_process_category_id = 7  ; 

update m_process_labels
   set formula = 'TargetMKvId|dvalue|mkv:t_project_product_process-unite-materials-target' 
 where formula = 'cTargetMKvId|mkv:t_project_product_process-unite-materials-target' 
   and m_process_category_id = 7  ; 

update m_process_labels
   set formula = 'TargetName|dvalue' 
 where formula = 'cTargetName' 
   and m_process_category_id = 7  ; 

update m_process_labels
   set formula = 'TargetLongName|dvalue' 
 where formula = 'cTargetLongName' 
   and m_process_category_id = 7  ; 


update m_process_labels
   set formula = 'SupplierLongName|dvalue' 
 where formula = 'cSelectedSupplierName' 
   and m_process_category_id = 7  ; 

update m_process_labels
   set formula = 'SupplierName|dvalue' 
 where formula = 'cSelectedSupplierSName' 
   and m_process_category_id = 7  ; 

update m_process_materials 
   set enabled_is_column = 'IsMaterialCost' 
 where id = 25 ; 

