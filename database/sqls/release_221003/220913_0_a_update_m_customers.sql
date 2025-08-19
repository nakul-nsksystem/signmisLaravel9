
update m_customers set 
price_fraction_m_kv_id = 1070002 ,
tax_fraction_m_kv_id = 1070002 
where dealing_m_kv_id in (1010001,1010002,1010004)
and m_branch_id = 2 ;