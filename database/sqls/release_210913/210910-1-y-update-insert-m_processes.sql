update m_processes 
   set enabled_is_column = '!is_02' ,  
       name = 'プリント(モード)'
 where id = 12 ; 
INSERT INTO `m_processes` VALUES ('59', '1', '2', 'プリント(手入力)', 'is_02', '0', '1', '0', null, null, null, null, null, null, null, null, null, null, '1.0000', '0', '1', '0', null, null, null, null, null, null, null, null, null, '1.0000', '1', '1', '4', 'n_02', null, null, null, null, null, '9010003', 'n_01', null, '1.0000', '2021-09-10 18:32:37', '2021-09-10 18:40:57', null);


DELETE FROM m_processes where id = 2 ; 
INSERT INTO `m_processes` VALUES ('2', '7', '1', '貼り', null, null, '1', '0', null, null, null, null, null, null, null, null, null, null, '1.0000', null, '1', '0', null, null, null, null, null, null, null, null, null, '1.0000', '1', '1', '3', '3600', null, null, null, '秒', null, '9010003', 'n_06', null, '1.0000', '2020-10-03 16:30:21', '2021-09-10 19:27:35', null);

