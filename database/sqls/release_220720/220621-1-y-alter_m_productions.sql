
ALTER TABLE `m_productions` 
ADD COLUMN `m_production_ext_tool_id` INT NULL COMMENT '外部プロダクションツールID' AFTER `thumbnail_path`,
ADD INDEX `fk_m_productions_m_production_ext_tool_id_idx` (`m_production_ext_tool_id` ASC) ;

ALTER TABLE `m_productions` 
ADD CONSTRAINT `fk_m_productions_m_production_ext_tool_id`
  FOREIGN KEY (`m_production_ext_tool_id`)
  REFERENCES `m_production_ext_tools` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
