update m_kvs
   set kv_name = 'カット'
 where id = 1650003 ; 

update m_process_categories 
   set production_m_kv_id = 1650003
  where id in (4,8,9) ; 

update m_process_categories 
   set production_m_kv_id = 1650900
  where id in (23) ; 


delete from m_kvs 
  where id in (1650004 , 1650006 , 1650009 , 1650010) ;
