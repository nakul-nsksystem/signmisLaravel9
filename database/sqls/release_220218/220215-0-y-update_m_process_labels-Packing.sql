update m_process_labels
   set formula = 'WayName|dvalue' 
 where formula = 'cWayName' 
   and m_process_category_id = 19  ; 
