ALTER TABLE `t_p_order_details` 
ADD COLUMN `t_project_construction_user_id` INT NULL DEFAULT NULL COMMENT '\'t_project_construction_users紐づけid' AFTER `t_project_product_process_id`;
