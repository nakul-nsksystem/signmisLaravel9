
update m_process_labels
   set formula = 'MaterialName01|dvalue' 
 where formula = 'cMMaterialName' 
   and m_process_category_id = 14  ; 

update m_process_labels
   set formula = 'MaterialLongName01|dvalue' 
 where formula = 'cMMaterialLongName' 
   and m_process_category_id = 14  ; 


