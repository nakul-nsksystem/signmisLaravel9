

update m_process_labels
   set is_computed_name = 'IsOutsource|dvalue' 
 where is_computed_name = 'm$cIsOutsource' 
   and m_process_category_id = 10  ; 


update m_process_labels
   set formula = 'WorkDetail|dvalue' 
 where formula = 'cWorkDetail' 
   and m_process_category_id = 10  ; 


update m_process_labels
   set formula = 'OutsourceMProductionName|dvalue' 
 where formula = 'm$cOutsourceProductionName' 
   and m_process_category_id = 10  ; 


