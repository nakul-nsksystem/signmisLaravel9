ALTER TABLE t_p_order_details
ADD COLUMN is_display_price TINYINT(1) NULL DEFAULT 0 COMMENT '発注書に単価金額を表示するフラグ' AFTER total_price;
