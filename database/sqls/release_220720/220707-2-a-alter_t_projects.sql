ALTER TABLE `t_projects` 
ADD COLUMN `delivery_mail_to` VARCHAR(255) NULL COMMENT '納品完了メール送信先' AFTER `internal_quotation_memo`;
