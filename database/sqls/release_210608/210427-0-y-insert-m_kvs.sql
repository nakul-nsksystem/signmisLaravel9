
INSERT INTO `m_kvs` (`id`, `m_kv_category_id`, `order_no`, `kv_cd`, `kv_name`, `is_user_editable`, `created_m_user_id`, `updated_m_user_id`) VALUES ('2310010', '2310', '10', '10', 'おまかせ', '0', '0', '0') ; 

update m_kvs 
   set g_01 = "curtain"
 where id in (2310001,2310002,2310003,2310004,2310005,2310006)  ; 

update m_kvs 
   set g_01 = "pvc"
 where id = 2310010 ; 

 
