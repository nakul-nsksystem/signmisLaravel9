
update m_process_labels
   set is_computed_name = 'IsRemoveTrash|dvalue' 
 where is_computed_name = 'cIsRemoveTrash' 
   and m_process_category_id = 9  ; 

update m_process_labels
   set is_computed_name = 'IsApplication|dvalue' 
 where is_computed_name = 'cIsApplication' 
   and m_process_category_id = 9  ; 

update m_process_labels
   set is_computed_name = 'IsCutApplication|dvalue' 
 where is_computed_name = 'cIsCutApplication' 
   and m_process_category_id = 9  ; 

update m_process_labels
   set formula = 'MProductionName01|dvalue' 
 where formula = 'm$cSelectedMProductionName01' 
   and m_process_category_id = 9  ; 

update m_process_labels
   set formula = 'MProductionModeName01|dvalue' 
 where formula = 'm$cSelectedMProductionModeName01' 
   and m_process_category_id = 9  ; 

update m_process_labels
   set formula = 'ProcessLength|dvalue|lc' 
 where formula = 'cProcessLength|lc' 
   and m_process_category_id = 9  ; 

update m_process_labels
   set formula = 'AplicationMMaterialName|dvalue' 
 where formula = 'cAplicationMMaterialName' 
   and m_process_category_id = 9  ; 

update m_process_labels
   set formula = 'AplicationMMaterialLongName|dvalue' 
 where formula = 'cAplicationMMaterialLongName' 
   and m_process_category_id = 9  ; 

