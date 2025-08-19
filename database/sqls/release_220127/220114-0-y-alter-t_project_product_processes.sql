ALTER TABLE `t_project_product_processes` 
DROP FOREIGN KEY `fk_t_project_product_processes_01_m_production_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_01_m_production_mode_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_01_m_production_option_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_02_m_production_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_02_m_production_mode_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_02_m_production_option_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_03_m_production_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_03_m_production_mode_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_03_m_production_option_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_04_m_production_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_04_m_production_mode_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_04_m_production_option_id`;
ALTER TABLE `t_project_product_processes` 
CHANGE COLUMN `01_m_production_id` `m_production_id_01` INT NULL DEFAULT NULL COMMENT '生産先ID 1' ,
CHANGE COLUMN `01_m_production_mode_id` `m_production_mode_id_01` INT NULL DEFAULT NULL COMMENT '生産先モードID 1' ,
CHANGE COLUMN `01_m_production_option_id` `m_production_option_id_01` INT NULL DEFAULT NULL COMMENT '生産先オプションID 1' ,
CHANGE COLUMN `02_m_production_id` `m_production_id_02` INT NULL DEFAULT NULL COMMENT '生産先ID 2' ,
CHANGE COLUMN `02_m_production_mode_id` `m_production_mode_id_02` INT NULL DEFAULT NULL COMMENT '生産先モードID 2' ,
CHANGE COLUMN `02_m_production_option_id` `m_production_option_id_02` INT NULL DEFAULT NULL COMMENT '生産先オプションID 2' ,
CHANGE COLUMN `03_m_production_id` `m_production_id_03` INT NULL DEFAULT NULL COMMENT '生産先ID 3' ,
CHANGE COLUMN `03_m_production_mode_id` `m_production_mode_id_03` INT NULL DEFAULT NULL COMMENT '生産先モードID 3' ,
CHANGE COLUMN `03_m_production_option_id` `m_production_option_id_03` INT NULL DEFAULT NULL COMMENT '生産先オプションID 3' ,
CHANGE COLUMN `04_m_production_id` `m_production_id_04` INT NULL DEFAULT NULL COMMENT '生産先ID 4' ,
CHANGE COLUMN `04_m_production_mode_id` `m_production_mode_id_04` INT NULL DEFAULT NULL COMMENT '生産先モードID 4' ,
CHANGE COLUMN `04_m_production_option_id` `m_production_option_id_04` INT NULL DEFAULT NULL COMMENT '生産先オプションID 4' ;


ALTER TABLE `t_project_product_processes` 
ADD CONSTRAINT `fk_t_project_product_processes_m_production_id_01`
  FOREIGN KEY (`m_production_id_01`)
  REFERENCES `m_productions` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_mode_id_01`
  FOREIGN KEY (`m_production_mode_id_01`)
  REFERENCES `m_production_modes` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_option_id_01`
  FOREIGN KEY (`m_production_option_id_01`)
  REFERENCES `m_production_options` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_id_02`
  FOREIGN KEY (`m_production_id_02`)
  REFERENCES `m_productions` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_mode_id_02`
  FOREIGN KEY (`m_production_mode_id_02`)
  REFERENCES `m_production_modes` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_option_id_02`
  FOREIGN KEY (`m_production_option_id_02`)
  REFERENCES `m_production_options` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_id_03`
  FOREIGN KEY (`m_production_id_03`)
  REFERENCES `m_productions` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_mode_id_03`
  FOREIGN KEY (`m_production_mode_id_03`)
  REFERENCES `m_production_modes` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_option_id_03`
  FOREIGN KEY (`m_production_option_id_03`)
  REFERENCES `m_production_options` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_id_04`
  FOREIGN KEY (`m_production_id_04`)
  REFERENCES `m_productions` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_mode_id_04`
  FOREIGN KEY (`m_production_mode_id_04`)
  REFERENCES `m_production_modes` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_production_option_id_04`
  FOREIGN KEY (`m_production_option_id_04`)
  REFERENCES `m_production_options` (`id`)
  ON UPDATE CASCADE;


