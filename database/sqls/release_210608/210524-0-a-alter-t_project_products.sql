ALTER TABLE `t_project_products` 
ADD COLUMN `t_project_file_id` INT NULL DEFAULT NULL COMMENT 't_project_file_id' AFTER `total_hour_for_production`,
ADD COLUMN `t_project_file_uid` INT NULL DEFAULT NULL COMMENT '添付ファイル紐づけ用仮id' AFTER `t_project_file_id`,
ADD INDEX `fk_t_project_products_t_project_file_id_idx` (`t_project_file_id` ASC) ;
;
ALTER TABLE `t_project_products` 
ADD CONSTRAINT `fk_t_project_products_t_project_file_id`
  FOREIGN KEY (`t_project_file_id`)
  REFERENCES `t_project_files` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
