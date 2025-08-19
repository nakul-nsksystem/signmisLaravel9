
update m_process_materials
   set rate_value = 'SqmIncExt' 
 where rate_value = 'sqmIncExt'
   and rate_type_m_kv_id = 9010002 ; 


update m_process_materials
   set rate_value = 'Sqm' 
 where rate_value = 'sqm' 
 and rate_type_m_kv_id = 9010002 ; 

