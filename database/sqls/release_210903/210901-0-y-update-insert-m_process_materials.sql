update m_process_materials
   set enabled_is_column = 'tmp_isNotCostByInput'
  where id = 8 ; 
  
  
update m_processes
   set enabled_is_column = 'tmp_isNotCostByInput'
  where id = 17 ; 
  
INSERT INTO `m_process_materials` VALUES ('58', '19', '2', '手入力梱包材', 'is_01', '1', 'n_02', '9010001', null, null, null, null, null, null, null, '2021-09-01 11:23:25', '2021-09-01 11:23:25');

INSERT INTO `m_processes` VALUES ('58', '19', '1', '手入力作業', 'is_01', '0', '1', '0', null, null, null, null, null, null, null, null, null, null, '1.0000', '0', '1', '0', null, null, null, null, null, null, null, null, null, '1.0000', '1', '1', '3', '3600', '10', '01_m_kv_id', null, null, null, '9010003', 'n_01', '作業', '1.0000', '2021-09-01 11:26:26', '2021-09-01 11:31:41', null);



