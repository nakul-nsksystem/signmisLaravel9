INSERT INTO `m_productions` (`id`, `order_no`, `m_branch_id`, `cd`, `name`, `is_production_target`, `cost_per_hour`, `prepare_sec`, `color_ink_cost_per_sqm`, `white_ink_cost_per_sqm`, `varnish_ink_cost_per_sqm`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES (62, '8100', '1', '183', 'オペレータ O(生産対象外)', '0', '2200.000', '0', '0.0000', '0.0000', '0.0000', '0', '2', '2020-11-26 21:15:13', '2021-08-31 15:52:34');
INSERT INTO `m_productions` (`id`, `order_no`, `m_branch_id`, `cd`, `name`, `is_production_target`, `cost_per_hour`, `prepare_sec`, `color_ink_cost_per_sqm`, `white_ink_cost_per_sqm`, `varnish_ink_cost_per_sqm`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES (63, '8100', '2', '283', 'オペレータ T(生産対象外)', '0', '2200.000', '0', '0.0000', '0.0000', '0.0000', '0', '2', '2021-01-09 17:10:03', '2021-08-31 15:52:20');
INSERT INTO `m_productions` (`id`, `order_no`, `m_branch_id`, `cd`, `name`, `is_production_target`, `cost_per_hour`, `prepare_sec`, `color_ink_cost_per_sqm`, `white_ink_cost_per_sqm`, `varnish_ink_cost_per_sqm`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES (64, '8100', '3', '383', 'オペレータ N(生産対象外)', '0', '2200.000', '0', '0.0000', '0.0000', '0.0000', '0', '2', '2021-01-09 17:10:28', '2021-08-31 15:52:41');

INSERT INTO `m_production_links` VALUES ('609', '62', '1', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:30:35');
INSERT INTO `m_production_links` VALUES ('610', '62', '2', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:30:35');
INSERT INTO `m_production_links` VALUES ('611', '62', '4', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:30:35');
INSERT INTO `m_production_links` VALUES ('612', '62', '21', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:31:18');
INSERT INTO `m_production_links` VALUES ('613', '62', '26', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:31:32');
INSERT INTO `m_production_links` VALUES ('614', '62', '59', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:31:43');
INSERT INTO `m_production_links` VALUES ('615', '63', '1', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:32:24');
INSERT INTO `m_production_links` VALUES ('616', '63', '2', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:32:33');
INSERT INTO `m_production_links` VALUES ('617', '63', '4', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:32:36');
INSERT INTO `m_production_links` VALUES ('618', '63', '21', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:32:38');
INSERT INTO `m_production_links` VALUES ('619', '63', '26', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:32:41');
INSERT INTO `m_production_links` VALUES ('620', '63', '59', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:32:42');
INSERT INTO `m_production_links` VALUES ('621', '64', '1', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:33:16');
INSERT INTO `m_production_links` VALUES ('622', '64', '2', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:33:24');
INSERT INTO `m_production_links` VALUES ('623', '64', '4', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:33:26');
INSERT INTO `m_production_links` VALUES ('624', '64', '21', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:33:30');
INSERT INTO `m_production_links` VALUES ('625', '64', '26', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:33:32');
INSERT INTO `m_production_links` VALUES ('626', '64', '59', 'App\\Models\\MProductCategory', null, null, '2022-06-02 14:33:34');

INSERT INTO `m_production_links` VALUES ('627', '62', '8', 'App\\Models\\MProcessCategory', '2', null, '2022-06-02 14:35:06');
INSERT INTO `m_production_links` VALUES ('628', '63', '8', 'App\\Models\\MProcessCategory', '2', null, '2022-06-02 14:35:31');
INSERT INTO `m_production_links` VALUES ('629', '64', '8', 'App\\Models\\MProcessCategory', '2', null, '2022-06-02 14:35:39');


update m_production_links 
   set target_m_production_no = 1 
 where m_production_id in (7 ,22,23)    
   and m_production_links_id = 8 ; 
