ALTER TABLE `m_role_keys` 
ADD COLUMN `memo` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'control_level　備考' AFTER `system_flg`;