-- Print

	update m_process_materials 
	   set rate_value = 'custom_sqm'
	 where id = 2 ; 	


	update m_processes 
	   set operation_rate_value = 'custom_sqm'
	 where id in (12 ,59 )  ; 	


	 
-- Lami

	update m_process_materials 
	   set rate_value = 'custom_sqm'
	 where id = 18 ; 	
