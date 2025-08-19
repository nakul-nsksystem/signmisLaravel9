
update m_process_labels
   set formula = 'MaterialName|dvalue' 
 where formula = 'cMMaterialName' 
   and m_process_category_id = 13  ; 

update m_process_labels
   set formula = 'MaterialLongName|dvalue' 
 where formula = 'cMMaterialLongName' 
   and m_process_category_id = 13  ; 


update m_process_labels
   set formula = 'MaterialName01|dvalue' 
 where formula = 'MaterialName|dvalue' 
   and m_process_category_id = 13  ; 

update m_process_labels
   set formula = 'MaterialLongName01|dvalue' 
 where formula = 'MaterialLongName|dvalue' 
   and m_process_category_id = 13  ; 


