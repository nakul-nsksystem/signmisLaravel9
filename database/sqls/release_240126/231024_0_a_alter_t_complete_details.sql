ALTER TABLE `t_complete_details` 
ADD COLUMN `is_csv_output` TINYINT(1) NULL DEFAULT 0 COMMENT '会計連動csv出力済フラグ' AFTER `m_bank_id`;
