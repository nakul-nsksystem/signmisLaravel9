

update m_process_materials
   set enabled_is_column = 'IsNotCostByInput'
   where id = 8 ; 
   
update m_processes
   set enabled_is_column = 'IsNotCostByInput'
   where id = 17 ; 