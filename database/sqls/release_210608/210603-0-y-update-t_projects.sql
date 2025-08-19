UPDATE t_projects 
   SET inc_children_updated_at = updated_at , 
       inc_children_updated_m_user_id = updated_m_user_id 
 where id > 0 ;
