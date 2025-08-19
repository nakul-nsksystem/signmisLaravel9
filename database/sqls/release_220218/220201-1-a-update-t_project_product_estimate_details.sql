update t_project_product_estimate_details 
set deleted_at = CURRENT_TIME 
where is_product_row = 1 ;