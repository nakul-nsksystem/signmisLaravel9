ALTER TABLE `m_users` 
ADD COLUMN `is_nsk_user` TINYINT(1) NULL DEFAULT 0 COMMENT '0:一般ユーザー 1:nskユーザー（権限all100、天津飯表示）' AFTER `thumbnail_path`;
update `m_users` set `is_nsk_user` = '1'
where id in(2,3,4,1012) ;
