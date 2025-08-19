ALTER TABLE `t_production_process_plans` 
ADD COLUMN `qty` INT NOT NULL DEFAULT 0 COMMENT '数量（分割がなければ 0 ) ' AFTER `order_no`;

ALTER TABLE `t_production_process_plans` 
ADD COLUMN `qty` INT NOT NULL DEFAULT 0 COMMENT '数量（分割がなければ 0 ) ' AFTER `qty`;
