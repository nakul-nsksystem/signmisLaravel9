SELECT p.id,p.is_input_customer_user,p.m_customer_person_id,p.customer_user_name , p.delivery_mail_to , c.name,c.email FROM t_projects as p 
left join m_customer_persons as c on p.m_customer_person_id = c.id 
where p.is_input_customer_user = 0 and p.deleted_at is null
order by id desc;

update t_projects as p 
left join m_customer_persons as c on p.m_customer_person_id = c.id 
set p.customer_user_name = c.name ,
p.delivery_mail_to = c.email
where p.is_input_customer_user = 0 and p.deleted_at is null