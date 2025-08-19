ALTER TABLE `sm_user_options` 
ADD COLUMN `is_user_editable` TINYINT(1) NOT NULL DEFAULT 0 AFTER `default_value`;
