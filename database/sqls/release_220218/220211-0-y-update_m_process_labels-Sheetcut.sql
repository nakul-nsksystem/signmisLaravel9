
update m_process_labels
   set formula = 'MProductionName01|dvalue' 
 where formula = 'm$cSelectedMProductionName01' 
   and m_process_category_id = 4  ; 

update m_process_labels
   set formula = 'MProductionModeName01|dvalue' 
 where formula = 'm$cSelectedMProductionModeName01' 
   and m_process_category_id = 4  ; 

