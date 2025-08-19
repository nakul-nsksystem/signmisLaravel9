ALTER TABLE `m_product_categories` 
ADD COLUMN `is_not_input_size_needed` TINYINT(1) NULL DEFAULT 0 COMMENT '0:サイズ入力必要 1:サイズ入力不要' AFTER `media_separate_overlap_length`;

