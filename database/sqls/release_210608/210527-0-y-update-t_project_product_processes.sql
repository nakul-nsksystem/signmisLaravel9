update t_project_product_processes 
   set order_no = ( select order_no from m_process_categories where id = t_project_product_processes.m_process_category_id ) 
 where order_no is null  ; 