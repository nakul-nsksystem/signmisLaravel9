
update `m_product_categories` 
   set is_not_input_size_needed = 0 
 where id not in (63 , 64)  ; 

 update `m_product_categories` 
   set is_not_input_size_needed = 1
 where id in (63 , 64 , 5 , 59)  ; 

 