INSERT INTO `m_production_modes` (`id`, `m_production_id`, `order_no`, `name`, `machine_mode_name`, `prepare_sec_per_job`, `prepare_sec_per_qty`, `speed_per_hour`, `speed_unit_m_kv_id`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES ('251', '62', '1', '作業', '作業', '0', '0', '0', '1610003', '0', '2', '2020-12-29 11:18:24', '2022-02-07 20:10:18');
INSERT INTO `m_production_modes` (`id`, `m_production_id`, `order_no`, `name`, `machine_mode_name`, `prepare_sec_per_job`, `prepare_sec_per_qty`, `speed_per_hour`, `speed_unit_m_kv_id`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES ('252', '63', '1', '作業', '作業', '0', '0', '0', '1610003', '0', '2', '2020-12-29 11:18:24', '2022-02-07 20:10:18');
INSERT INTO `m_production_modes` (`id`, `m_production_id`, `order_no`, `name`, `machine_mode_name`, `prepare_sec_per_job`, `prepare_sec_per_qty`, `speed_per_hour`, `speed_unit_m_kv_id`, `created_m_user_id`, `updated_m_user_id`, `created_at`, `updated_at`) VALUES ('253', '64', '1', '作業', '作業', '0', '0', '0', '1610003', '0', '2', '2020-12-29 11:18:24', '2022-02-07 20:10:18');

INSERT INTO `m_production_mode_links` VALUES ('686', '251', '8', 'App\\Models\\MProcessCategory', null, '2022-06-02 14:27:01');
INSERT INTO `m_production_mode_links` VALUES ('687', '252', '8', 'App\\Models\\MProcessCategory', null, '2022-06-02 14:27:32');
INSERT INTO `m_production_mode_links` VALUES ('688', '253', '8', 'App\\Models\\MProcessCategory', null, '2022-06-02 14:27:44');

update t_project_product_processes 
   set m_production_id_02 = 62 ,
       m_production_mode_id_02 = 251 
  where m_production_id_02 = 7 
     and m_process_category_id = 8  ; 



update t_project_product_processes 
   set m_production_id_02 = 63 ,
       m_production_mode_id_02 = 252 
  where m_production_id_02 = 22 
     and m_process_category_id = 8  ; 



update t_project_product_processes 
   set m_production_id_02 = 64 ,
       m_production_mode_id_02 = 253 
  where m_production_id_02 = 23 
     and m_process_category_id = 8  ; 


INSERT INTO `m_production_modes` VALUES ('254', '7', '4', '板手切り', '板手切り', '0', '0', '30000.0000', '1610003', null, null, null, null, '2', '2', '2022-06-02 14:46:29', '2022-06-02 14:46:29', null);
INSERT INTO `m_production_modes` VALUES ('255', '22', '4', '板手切り', '板手切り', '0', '0', '30000.0000', '1610003', null, null, null, null, '2', '2', '2022-06-02 14:46:29', '2022-06-02 14:46:29', null);
INSERT INTO `m_production_modes` VALUES ('256', '23', '4', '板手切り', '板手切り', '0', '0', '30000.0000', '1610003', null, null, null, null, '2', '2', '2022-06-02 14:46:29', '2022-06-02 14:46:29', null);

INSERT INTO `m_production_mode_links` VALUES ('689', '254', '8', 'App\\Models\\MProcessCategory', null, '2022-06-02 14:46:36');
INSERT INTO `m_production_mode_links` VALUES ('690', '255', '8', 'App\\Models\\MProcessCategory', null, '2022-06-02 14:48:28');
INSERT INTO `m_production_mode_links` VALUES ('691', '256', '8', 'App\\Models\\MProcessCategory', null, '2022-06-02 14:48:33');

