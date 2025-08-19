ALTER TABLE `m_branches` 
ADD COLUMN `production_start_at` TIME NULL COMMENT '生産開始時刻（拠点デフォルト)' AFTER `t_p_order_email`,
ADD COLUMN `production_end_at` TIME NULL COMMENT '生産終了時刻（拠点デフォルト)' AFTER `production_start_at`;
