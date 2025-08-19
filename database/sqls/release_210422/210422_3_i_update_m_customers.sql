-- 大阪はそのまま

-- 東京のCDを変換
update m_customers set cd = cd - 1000 where m_branch_id = 2 and dealing_m_kv_id in(1010000, 1010002, 1010004) ;
update m_customers set cd = cd - 2000 where m_branch_id = 2 and dealing_m_kv_id in(1010001, 1010008) ;
-- 名古屋のCDを変換
update m_customers set cd = cd - 2000 where m_branch_id = 3 and dealing_m_kv_id in(1010000, 1010002, 1010004) ;
update m_customers set cd = cd - 3000 where m_branch_id = 3 and dealing_m_kv_id in(1010001, 1010008) ;

-- 数値0埋め
update m_customers set cd = cd - 10000 where m_branch_id = 1 ;
update m_customers set cd = CONCAT('O', LPAD(cd, 4, '0')) where m_branch_id = 1 ;
update m_customers set cd = cd - 20000 where m_branch_id = 2 ;
update m_customers set cd = CONCAT('T', LPAD(cd, 4, '0')) where m_branch_id = 2;
update m_customers set cd = cd - 30000 where m_branch_id = 3 ;
update m_customers set cd = CONCAT('N', LPAD(cd, 4, '0')) where m_branch_id = 3 ;

