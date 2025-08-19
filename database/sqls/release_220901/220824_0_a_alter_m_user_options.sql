ALTER TABLE `m_user_options` 
ADD COLUMN `order_no` INT NULL DEFAULT NULL COMMENT '表示順' AFTER `sm_user_option_id`,
ADD COLUMN `is_system_created` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0:ユーザーが作成 1:システムが作成' AFTER `target_value`;


INSERT INTO 
`m_user_options` (`m_user_id`, `sm_user_option_id`, `order_no`, `name`, `value`, `target_value`, `is_system_created`) 
select id,151,0,'営業担当物件(システムデフォルト作成)',
concat('{"m_branch_id":',m_branch_id,',"sales_m_user_id":',id,',"m_customer":{},"t_project_products":{"name":"","m_product_category_id":0,"operator_m_user_id":0,"t_project_product_processes":{"m_branch_id":0,"m_process_category_id":0}}}'),
1,1 from m_users  	;
	
