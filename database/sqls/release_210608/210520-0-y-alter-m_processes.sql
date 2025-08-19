ALTER TABLE `m_processes` 
ADD COLUMN `prepare_per_job_price_column` VARCHAR(255) NULL COMMENT '準備/ジョブ 単価を取得するカラム名' AFTER `prepare_per_job_rate_value`;
