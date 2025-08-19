update t_p_order_details 
set total_price = price * qty 
where total_price = 0 ;