ALTER TABLE `t_project_files` 
ADD COLUMN `t_project_mail_uid` INT NULL DEFAULT NULL COMMENT 'メール紐づけ用uid' AFTER `t_project_mail_id`;
