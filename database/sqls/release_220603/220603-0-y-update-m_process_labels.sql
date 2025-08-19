update m_process_labels 
   set order_no = order_no + 40 
  where order_no = 4 
     and m_process_category_id = 3 ; 

INSERT INTO `m_process_labels` VALUES ('201', '3', '4', 'IsDoubleFace|dvalue', '0', null, null, '両面', 'display_01', null, '2022-06-03 16:01:48', '2022-06-03 16:01:48');
INSERT INTO `m_process_labels` VALUES ('202', '3', '4', 'IsDoubleFace|dvalue', '0', null, null, '両面', 'display_prod_01', null, '2022-06-03 16:02:09', '2022-06-03 16:02:15');
