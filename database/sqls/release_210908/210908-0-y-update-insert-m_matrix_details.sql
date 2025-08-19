
-- 
update m_matrix_details
   set deleted_at = '2021-09-08'
  where id in (160 ,161,164 ,167,168,171)  ; 
  
-- 
 update m_kvs 
    set deleted_at = '2021-09-08'
  where id in 
(2170003,
2170004,
2170007,
2180003,
2180004,
2180007) ; 


UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 97;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 98;
UPDATE m_matrix_details SET val1 = 9000 WHERE ID = 100;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 101;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 102;
UPDATE m_matrix_details SET val1 = 14400 WHERE ID = 104;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 105;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 106;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 108;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 109;
UPDATE m_matrix_details SET val1 = 18000 WHERE ID = 111;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 113;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 114;
UPDATE m_matrix_details SET val1 = 18000 WHERE ID = 116;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 142;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 143;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 145;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 146;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 148;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 149;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 151;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 152;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 155;
UPDATE m_matrix_details SET val1 = 5000 WHERE ID = 156;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 159;
UPDATE m_matrix_details SET val1 = 9000 WHERE ID = 161;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 162;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 163;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 165;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 166;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 169;
UPDATE m_matrix_details SET val1 = 30000 WHERE ID = 170;

UPDATE m_matrix_details SET k1_description = '凸(ヤッコ) - マジックテープ(片方)' WHERE ID = 116;

update m_kvs set kv_name = 'マジックテープ(片方)' where id = 2160004 ; 

update m_kvs set order_no = order_no + 1 
 where id in (2160005 ,2160006,2160007) ; 
 
INSERT INTO `m_kvs` VALUES ('2160008', '2160', '5', '8', 'マジックテープ(雄メス)', null, null, '0', '1', '0', '1', '0', null, null, null, null, null, '0', '凸(ヤッコ)', null, '0', '0', '2021-09-08 14:41:53', '2021-09-08 14:41:53', null);

INSERT INTO `m_matrix_details` VALUES ('173', '33', '54', '2160008', '凸(ヤッコ) - マジックテープ(雄メス)', null, null, null, null, null, null, '9000.0000', null, null, null, null, null, '0', '0', '2021-09-08 14:39:23', '2021-09-08 14:39:23', null);

