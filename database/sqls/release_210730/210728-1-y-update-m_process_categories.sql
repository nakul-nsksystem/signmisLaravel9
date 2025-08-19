UPDATE m_process_categories 
   set is_production = 0 
   where id in (6 ,17,19,20,24,26,27) ; 

UPDATE m_process_categories 
   set  is_production = 1
   where id in (1,2,3,4,5 ,7,8,9,10,13,14,15,16,23 ,25) ; 

-- 出力
UPDATE m_process_categories 
   set  production_m_kv_id = 1650001
   where id in (1) ; 

-- ラミ
UPDATE m_process_categories 
   set  production_m_kv_id = 1650002
   where id in (3) ; 

-- ハーフカット
UPDATE m_process_categories 
   set  production_m_kv_id = 1650003
   where id in (9) ; 

-- シートカット
UPDATE m_process_categories 
   set  production_m_kv_id = 1650004
   where id in (4) ; 

-- 継ぎ・幕仕上げ
UPDATE m_process_categories 
   set  production_m_kv_id = 1650005
   where id in (5,15) ; 

-- Reboard 仕上げ
UPDATE m_process_categories 
   set  production_m_kv_id = 1650007
   where id in (25) ; 

-- プライマー・パテ・貼り
UPDATE m_process_categories 
   set  production_m_kv_id = 1650008
   where id in (13,14,7) ; 

-- 形状カット
UPDATE m_process_categories 
   set  production_m_kv_id = 1650009
   where id in (8) ; 

-- 裏面両面テープ貼り
UPDATE m_process_categories 
   set  production_m_kv_id = 1650010
   where id in (23) ; 

-- その他加工
UPDATE m_process_categories 
   set  production_m_kv_id = 1650900
   where id in (10) ; 

