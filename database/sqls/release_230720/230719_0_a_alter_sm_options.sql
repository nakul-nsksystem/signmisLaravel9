ALTER TABLE `sm_options` 
ADD COLUMN `is_user_editable` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ユーザー編集可能フラグ' AFTER `value`;
UPDATE `sm_options` SET `is_user_editable` = '1' WHERE (`id` = '31');
