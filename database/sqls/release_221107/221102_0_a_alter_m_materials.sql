ALTER TABLE `m_materials` 
ADD COLUMN `fire_prev_label_cd` VARCHAR(190) NULL DEFAULT NULL COMMENT '防炎シールコード' AFTER `weight`;
