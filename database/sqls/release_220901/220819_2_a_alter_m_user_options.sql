ALTER TABLE `m_user_options` 
ADD COLUMN `target_value` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'sm_user_option間参照の時に使用する値' AFTER `value`;