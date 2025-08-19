-- 売上
ALTER TABLE t_sale_details 
ADD COLUMN t_project_product_id INT NULL COMMENT '物件商品' AFTER t_project_id,
ADD INDEX fk_t_sale_details_t_project_product_id (t_project_product_id ASC) ;

ALTER TABLE t_sale_details 
ADD CONSTRAINT fk_t_sale_details_t_project_product_id
  FOREIGN KEY (t_project_product_id)
  REFERENCES t_project_products (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT
;


ALTER TABLE t_sale_details 
CHANGE COLUMN t_project_id t_project_id INT NULL DEFAULT NULL COMMENT '物件id' AFTER t_sale_id,
CHANGE COLUMN t_project_product_id t_project_product_id INT NULL DEFAULT NULL COMMENT '物件商品' AFTER t_project_id;



ALTER TABLE t_sale_details 
CHANGE COLUMN m_product_id m_material_detail_id INT NULL DEFAULT NULL COMMENT '材料明細id' 
;

ALTER TABLE t_sale_details 
ADD INDEX fk_t_sale_details_m_material_detail_id (m_material_detail_id ASC) 
;

ALTER TABLE t_sale_details 
ADD CONSTRAINT fk_t_sale_details_m_material_detail_id
  FOREIGN KEY (m_material_detail_id)
  REFERENCES m_material_details (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT
;

ALTER TABLE t_sales 
CHANGE COLUMN price_total total_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '金額' ;

ALTER TABLE t_sale_details 
CHANGE COLUMN price_cost cost DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '原価' ,
CHANGE COLUMN price_total total_price DECIMAL(15,4) NOT NULL DEFAULT '0.0000' COMMENT '金額' ;

