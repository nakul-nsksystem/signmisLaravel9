
update m_process_labels
   set formula = 'cMaterialName|dvalue' 
 where formula = 'cMMaterialName' 
   and m_process_category_id = 23  ; 

update m_process_labels
   set formula = 'cMaterialLongName|dvalue' 
 where formula = 'cMMaterialLongName' 
   and m_process_category_id = 23 ; 




update m_process_labels
   set formula = 'MaterialName01|dvalue' 
 where formula = 'cMaterialName|dvalue' 
   and m_process_category_id = 23  ; 

update m_process_labels
   set formula = 'MaterialLongName01|dvalue' 
 where formula = 'cMaterialLongName|dvalue' 
   and m_process_category_id = 23 ; 

