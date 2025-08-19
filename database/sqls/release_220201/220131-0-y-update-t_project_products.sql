 update t_project_products  
    set cost = round(total_cost / qty , 0 )
  where cost >  ceil(total_cost / qty );  
