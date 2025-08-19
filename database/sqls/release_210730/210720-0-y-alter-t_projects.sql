ALTER TABLE `t_projects` 
ADD COLUMN `customer_order_no` VARCHAR(1024) NULL COMMENT '客先注文No' AFTER `orderd_m_user_id`,
ADD COLUMN `internal_quotation_memo` VARCHAR(1024) NULL COMMENT '社内用見積備考' AFTER `other_fee`;

ALTER TABLE `t_projects` 
 CHANGE `orderd_at` `ordered_at`  datetime, 
 CHANGE `orderd_m_user_id` `ordered_m_user_id`  int ; 