ALTER TABLE `t_project_construction_users` 
ADD COLUMN `t_project_delivery_uid` INT NULL DEFAULT NULL COMMENT '仮紐づけ用uid' AFTER `t_project_delivery_id`;


update t_project_construction_users as tpcu
join t_project_deliveries as tpdel on tpcu.t_project_delivery_id = tpdel.id
set t_project_delivery_uid = tpdel.uid ;
