

update m_process_labels
   set formula = 'num_of_workers|dvalue' 
 where formula = 'm$cNumOfWorkers' 
   and m_process_category_id = 26  ; 

update m_process_labels
   set formula = 'Detail|dvalue' 
 where formula = 'cDetail' 
   and m_process_category_id = 27  ; 


