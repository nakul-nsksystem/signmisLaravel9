-- ビュー：他拠点生産商品集計表
CREATE OR REPLACE VIEW v_summary_remote_branch_products AS

SELECT proj.id									AS t_project_id			,/*物件id*/
       proj.sales_completed_at              	AS sales_completed_at   ,/*売上完了日*/
       NEXT_DUE_DATE(proj.sales_completed_at, cust.closing_date) AS complete_day   ,/*請求予定日*/
       pdt.id									AS t_project_product_id	,/*物件商品id*/
       br.id                          			AS m_branch_id       	,/*営業拠点id*/
       br.cd                          			AS m_branch_cd       	,/*営業拠点CD*/
       IFNULL(br.short_name, br.name) 			AS m_branch_name     	,/*営業拠点名*/
       pdt_br.id                          		AS product_m_branch_id  ,/*生産拠点id*/
       pdt_br.cd                          		AS product_m_branch_cd  ,/*生産拠点CD*/
       IFNULL(pdt_br.short_name, pdt_br.name) 	AS product_m_branch_name,/*生産拠点名*/
       cust.id                          		AS m_customer_id     	,/*取引先id*/
       cust.cd                          		AS m_customer_cd     	,/*取引先CD*/
       IFNULL(cust.short_name, cust.name) 		AS m_customer_name   	,/*取引先名*/
       usr.id                           		AS m_user_id         	,/*営業担当者id*/
       usr.full_name                    		AS m_user_name          ,/*営業担当者*/
       proj.name								AS t_project_name		,/*物件名*/
       pdt.name									AS product_name			,/*商品名*/
       pdt.qty									AS qty					,/*数量*/
       pdt.cost									AS cost					,/*原価*/
       pdt.cost * pdt.qty						AS total_cost			,/*原価金額*/
       pdt.sell_price							AS sell_price			,/*売価*/		
       pdt.sell_price * pdt.qty					AS total_sell_price		/*売価金額*/	

  FROM t_projects AS proj
INNER JOIN t_project_products 	AS pdt  	ON pdt.t_project_id		= proj.id  		/*物件商品*/
INNER JOIN m_branches  			AS br		ON proj.m_branch_id 	= br.id 		/*受注拠点*/
INNER JOIN m_branches  			AS pdt_br	ON pdt.m_branch_id  	= pdt_br.id 	/*生産拠点*/
INNER JOIN m_customers 			AS cust		ON proj.m_customer_id   = cust.id 		/*取引先*/
INNER JOIN m_users     			AS usr      ON proj.sales_m_user_id = usr.id  		/*営業担当*/

WHERE proj.m_branch_id != pdt.m_branch_id /*受注拠点と生産拠点が異なる商品*/
AND proj.sales_completed_at IS NOT NULL	  /*物件は売上完了済み状態*/
AND proj.deleted_at IS NULL
AND pdt.deleted_at IS NULL 
ORDER BY proj.sales_completed_at, proj.cd, pdt.order_no
;
