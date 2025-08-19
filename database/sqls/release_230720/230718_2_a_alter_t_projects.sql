ALTER TABLE `t_projects` 
ADD COLUMN `is_est_approved` TINYINT(1) NULL DEFAULT 0 COMMENT '見積承認済フラグ' AFTER `estimate_memo`;
