ALTER TABLE `t_project_mails` 
ADD COLUMN `mailpath` varchar(255) NULL DEFAULT NULL COMMENT 'メール保存パス' AFTER `cc` ,
ADD COLUMN `created_m_user_id` INT NULL DEFAULT NULL COMMENT '作成者id' AFTER `mailpath` , 
ADD COLUMN `updated_m_user_id` INT NULL DEFAULT NULL COMMENT '更新者id' AFTER `created_m_user_id` , 
ADD COLUMN `deleted_at` DATETIME NULL DEFAULT NULL COMMENT '削除日' AFTER `updated_m_user_id`;