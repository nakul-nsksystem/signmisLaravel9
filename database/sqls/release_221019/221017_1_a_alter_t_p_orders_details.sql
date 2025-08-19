ALTER TABLE `t_p_orders` 
DROP FOREIGN KEY `fk_t_p_orders_m_branch_id`;
ALTER TABLE `t_p_orders` 
CHANGE COLUMN `m_branch_id` `m_branch_id` INT NOT NULL COMMENT '拠点id' ,
CHANGE COLUMN `m_user_id` `m_user_id` INT NOT NULL COMMENT '担当者id' ;
ALTER TABLE `t_p_orders` 
ADD CONSTRAINT `fk_t_p_orders_m_branch_id`
  FOREIGN KEY (`m_branch_id`)
  REFERENCES `m_branches` (`id`);
  
ALTER TABLE `t_p_order_details` 
CHANGE COLUMN `qty` `qty` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '数量' ,
CHANGE COLUMN `price` `price` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '単価' ,
CHANGE COLUMN `total_price` `total_price` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '金額' ;
