ALTER TABLE `m_customers` 
ADD COLUMN `po_email` VARCHAR(255) NULL DEFAULT NULL COMMENT '発注用メールアドレス' AFTER `email`;
