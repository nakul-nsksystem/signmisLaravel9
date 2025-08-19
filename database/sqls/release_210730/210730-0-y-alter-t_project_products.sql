ALTER TABLE `t_project_products` 
ADD COLUMN `sqm` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '㎡数' AFTER `size_extend_r`,
ADD COLUMN `total_sqm` DECIMAL(15,4) NULL DEFAULT 0 COMMENT '総㎡数' AFTER `sqm`;

update t_project_products 
   set sqm = ( size_w + size_extend_l + size_extend_r ) * 0.001 * ( size_h + size_extend_t + size_extend_b ) * 0.001  
 where 1 = 1  ; 

update t_project_products 
   set total_sqm = sqm * qty 
 where 1 = 1  ; 

