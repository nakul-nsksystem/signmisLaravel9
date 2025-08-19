update m_processes 
  set operation_rate_type_m_kv_id = 9010003 ,
      operation_rate_value = 'n_02'
where id in (9 ,18 )  ; 

update m_process_labels
   set is_computed_name = 'IsOrgCopy|dvalue' 
 where is_computed_name = 'cIsOrgCopy' 
   and m_process_category_id = 8  ; 


update m_process_labels
   set formula = 'MProductionName01|dvalue' 
 where formula = 'm$cSelectedMProductionName01' 
   and m_process_category_id = 8  ; 

update m_process_labels
   set formula = 'MProductionModeName01|dvalue' 
 where formula = 'm$cSelectedMProductionModeName01' 
   and m_process_category_id = 8  ; 

update m_process_labels
   set formula = 'ProcessLength|dvalue|lc' 
 where formula = 'cProcessLength|lc' 
   and m_process_category_id = 8  ; 


update m_process_labels
   set formula = 'ProductionModeNumOfCut|dvalue' 
 where formula = 'cProductionModeNumOfCut' 
   and m_process_category_id = 8  ; 

update m_process_labels
   set formula = 'OrgSizeW|dvalue' 
 where formula = 'cOrgSizeW' 
   and m_process_category_id = 8  ; 

update m_process_labels
   set formula = 'OrgSizeH|dvalue' 
 where formula = 'cOrgSizeH' 
   and m_process_category_id = 8  ; 
