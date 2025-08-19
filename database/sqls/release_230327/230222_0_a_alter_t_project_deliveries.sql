ALTER TABLE `t_project_deliveries` 
ADD COLUMN `mail_postscript` VARCHAR(512) NULL DEFAULT NULL AFTER `mail_sent_at`;
ALTER TABLE `t_project_deliveries` 
CHANGE COLUMN `mail_postscript` `mail_postscript` VARCHAR(512) NULL DEFAULT NULL COMMENT 'メール追記事項' ;
