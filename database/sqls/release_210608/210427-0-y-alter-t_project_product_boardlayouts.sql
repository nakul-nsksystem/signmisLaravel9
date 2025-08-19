ALTER TABLE `t_project_product_boardlayouts` 
ADD COLUMN `is_auto` TINYINT(1) NULL DEFAULT 0 COMMENT '1:自動からの結果' AFTER `m_material_detail_id`; 
