
update m_processes
   set operation_rate_value = 'SqmIncExt' 
 where operation_rate_value = 'sqmIncExt'
   and operation_rate_type_m_kv_id = 9010002 ; 


update m_processes
   set operation_rate_value = 'Sqm' 
 where operation_rate_value = 'sqm' 
 and operation_rate_type_m_kv_id = 9010002 ; 

update m_processes
   set operation_rate_value = 'Perimeter' 
 where operation_rate_value = 'perimeter' 
 and operation_rate_type_m_kv_id = 9010002 ; 


update m_processes
   set prepare_per_job_rate_value = 'MaterialUseNumOfRolls' 
 where prepare_per_job_rate_value = 'materialUseNumOfRolls' 
 and prepare_per_job_rate_type_m_kv_id = 9010002 ; 

