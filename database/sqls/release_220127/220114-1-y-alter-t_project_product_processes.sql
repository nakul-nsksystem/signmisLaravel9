
ALTER TABLE `t_project_product_processes` 
DROP FOREIGN KEY `fk_t_project_product_processes_01_m_material_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_02_m_material_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_03_m_material_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_04_m_material_id`,
DROP FOREIGN KEY `fk_t_project_product_processes_05_m_material_id`;
ALTER TABLE `t_project_product_processes` 
CHANGE COLUMN `01_m_material_id` `m_material_id_01` INT NULL DEFAULT NULL ,
CHANGE COLUMN `02_m_material_id` `m_material_id_02` INT NULL DEFAULT NULL ,
CHANGE COLUMN `03_m_material_id` `m_material_id_03` INT NULL DEFAULT NULL ,
CHANGE COLUMN `04_m_material_id` `m_material_id_04` INT NULL DEFAULT NULL ,
CHANGE COLUMN `05_m_material_id` `m_material_id_05` INT NULL DEFAULT NULL ,
CHANGE COLUMN `06_m_material_id` `m_material_id_06` INT NULL DEFAULT NULL ,
CHANGE COLUMN `07_m_material_id` `m_material_id_07` INT NULL DEFAULT NULL ,
CHANGE COLUMN `08_m_material_id` `m_material_id_08` INT NULL DEFAULT NULL ,
CHANGE COLUMN `09_m_material_id` `m_material_id_09` INT NULL DEFAULT NULL ,
CHANGE COLUMN `10_m_material_id` `m_material_id_10` INT NULL DEFAULT NULL ,
CHANGE COLUMN `11_m_material_id` `m_material_id_11` INT NULL DEFAULT NULL ,
CHANGE COLUMN `12_m_material_id` `m_material_id_12` INT NULL DEFAULT NULL ,
CHANGE COLUMN `13_m_material_id` `m_material_id_13` INT NULL DEFAULT NULL ,
CHANGE COLUMN `14_m_material_id` `m_material_id_14` INT NULL DEFAULT NULL ,
CHANGE COLUMN `15_m_material_id` `m_material_id_15` INT NULL DEFAULT NULL ,
CHANGE COLUMN `16_m_material_id` `m_material_id_16` INT NULL DEFAULT NULL ,
CHANGE COLUMN `17_m_material_id` `m_material_id_17` INT NULL DEFAULT NULL ,
CHANGE COLUMN `18_m_material_id` `m_material_id_18` INT NULL DEFAULT NULL ,
CHANGE COLUMN `19_m_material_id` `m_material_id_19` INT NULL DEFAULT NULL ,
CHANGE COLUMN `20_m_material_id` `m_material_id_20` INT NULL DEFAULT NULL ,
CHANGE COLUMN `21_m_material_id` `m_material_id_21` INT NULL DEFAULT NULL ,
CHANGE COLUMN `22_m_material_id` `m_material_id_22` INT NULL DEFAULT NULL ,
CHANGE COLUMN `23_m_material_id` `m_material_id_23` INT NULL DEFAULT NULL ,
CHANGE COLUMN `24_m_material_id` `m_material_id_24` INT NULL DEFAULT NULL ,
CHANGE COLUMN `25_m_material_id` `m_material_id_25` INT NULL DEFAULT NULL ;

ALTER TABLE `t_project_product_processes` 
DROP INDEX `fk_t_project_product_processes_01_m_material_id_idx` ;
ALTER TABLE `t_project_product_processes` 
DROP INDEX `fk_t_project_product_processes_02_m_material_id_idx` ;
ALTER TABLE `t_project_product_processes` 
DROP INDEX `fk_t_project_product_processes_03_m_material_id_idx` ;
ALTER TABLE `t_project_product_processes` 
DROP INDEX `fk_t_project_product_processes_04_m_material_id_idx` ;
ALTER TABLE `t_project_product_processes` 
DROP INDEX `fk_t_project_product_processes_05_m_material_id_idx` ;




ALTER TABLE `t_project_product_processes` 
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_01`
  FOREIGN KEY (`m_material_id_01`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_02`
  FOREIGN KEY (`m_material_id_02`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_03`
  FOREIGN KEY (`m_material_id_03`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_04`
  FOREIGN KEY (`m_material_id_04`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_05`
  FOREIGN KEY (`m_material_id_05`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_06`
  FOREIGN KEY (`m_material_id_06`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_07`
  FOREIGN KEY (`m_material_id_07`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_08`
  FOREIGN KEY (`m_material_id_08`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_09`
  FOREIGN KEY (`m_material_id_09`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_10`
  FOREIGN KEY (`m_material_id_10`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_11`
  FOREIGN KEY (`m_material_id_11`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_12`
  FOREIGN KEY (`m_material_id_12`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_13`
  FOREIGN KEY (`m_material_id_13`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_14`
  FOREIGN KEY (`m_material_id_14`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_15`
  FOREIGN KEY (`m_material_id_15`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_16`
  FOREIGN KEY (`m_material_id_16`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_17`
  FOREIGN KEY (`m_material_id_17`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_18`
  FOREIGN KEY (`m_material_id_18`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_19`
  FOREIGN KEY (`m_material_id_19`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_20`
  FOREIGN KEY (`m_material_id_20`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_21`
  FOREIGN KEY (`m_material_id_21`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_22`
  FOREIGN KEY (`m_material_id_22`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_23`
  FOREIGN KEY (`m_material_id_23`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_24`
  FOREIGN KEY (`m_material_id_24`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_t_project_product_processes_m_material_id_25`
  FOREIGN KEY (`m_material_id_25`)
  REFERENCES `m_materials` (`id`)
  ON UPDATE CASCADE ; 

  
