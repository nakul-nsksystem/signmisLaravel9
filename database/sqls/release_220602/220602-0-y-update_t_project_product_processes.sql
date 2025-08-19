	update t_project_product_processes 
	   set total_cost = work_cost 
	 where m_process_category_id = 26 ; 
	 
-- Lami
	update t_project_product_processes 
	   set custom_sqm = ( select sqm from t_project_products where t_project_product_processes.t_project_product_id = t_project_products.id)  ,
	       total_custom_sqm = ( select sqm * qty from t_project_products where t_project_product_processes.t_project_product_id = t_project_products.id)   
	 where m_process_category_id = 3 ; 

-- Print

	update t_project_product_processes 
	   set custom_sqm = ( select sqm * (is_01 + 1) from t_project_products where t_project_product_processes.t_project_product_id = t_project_products.id)  ,
	       total_custom_sqm = ( select sqm * (is_01  + 1) * qty from t_project_products where t_project_product_processes.t_project_product_id = t_project_products.id)   
	 where m_process_category_id = 1 ; 	


