ALTER TABLE `t_production_results` 
DROP FOREIGN KEY `fk_t_production_results_t_project_product_process_id`;
ALTER TABLE `t_production_results` 
CHANGE COLUMN `t_project_product_process_id` `t_project_product_process_id` INT NULL COMMENT '物件工程ID' ;
ALTER TABLE `t_production_results` 
ADD CONSTRAINT `fk_t_production_results_t_project_product_process_id`
  FOREIGN KEY (`t_project_product_process_id`)
  REFERENCES `t_project_product_processes` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


ALTER TABLE `t_production_results` 
DROP COLUMN `seconds`;

ALTER TABLE `t_production_results` 
DROP FOREIGN KEY `fk_t_production_results_t_project_product_process_id`;
ALTER TABLE `t_production_results` 
CHANGE COLUMN `t_project_product_process_id` `t_production_process_plans_id` INT NULL DEFAULT NULL COMMENT '物件工程ID' ,
ADD INDEX `fk_t_production_results_t_production_process_plans_id_idx` (`t_production_process_plans_id` ASC) ,
DROP INDEX `fk_t_production_results_t_project_product_process_id_idx` ;

ALTER TABLE `t_production_results` 
ADD CONSTRAINT `fk_t_production_results_t_production_process_plans_id`
  FOREIGN KEY (`t_production_process_plans_id`)
  REFERENCES `t_production_process_plans` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `t_production_results` 
ADD COLUMN `input_type_m_kv_id` INT NOT NULL COMMENT '入力タイプ' AFTER `t_production_process_plans_id`,
ADD INDEX `fk_t_production_results_input_type_m_kv_id_idx` (`input_type_m_kv_id` ASC) ;

ALTER TABLE `t_production_results` 
ADD CONSTRAINT `fk_t_production_results_input_type_m_kv_id`
  FOREIGN KEY (`input_type_m_kv_id`)
  REFERENCES `m_kvs` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;


ALTER TABLE `t_production_results` 
ADD COLUMN `result_type_flg` INT NULL COMMENT '0:通常 1:追加情報(データ作成など）' AFTER `t_production_process_plans_id`,
ADD COLUMN `memo` VARCHAR(1024) NULL AFTER `loss_qty`;
