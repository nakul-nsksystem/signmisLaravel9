ALTER TABLE `t_user_points` 
ADD COLUMN `applied_at` DATETIME NULL COMMENT '申請日' AFTER `point`,
ADD COLUMN `approved_at` DATETIME NULL COMMENT '承認/拒否日' AFTER `applied_at`,
ADD COLUMN `approve_m_user_id` INT NULL COMMENT '承認担当者id' AFTER `approved_at`,
ADD COLUMN `approval_comment` VARCHAR(1024) NULL COMMENT '承認者コメント' AFTER `approve_m_user_id`;
