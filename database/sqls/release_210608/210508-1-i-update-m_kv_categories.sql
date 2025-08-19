-- 原価表示の管理
UPDATE m_kv_categories SET 
system_memo = 'g_01:{ロス込原価の表記},g_02:{0:無し,1:幅x流,2:長さ,3:容量},g_03:{管理単位の表記},g_04:{発注単位のデフォルトidを設定},g_05:{管理単位の計算式},g_06:{原価表示:0非表示,1:表示},' 
WHERE id = 1350
;

-- サブカテゴリ
UPDATE m_kvs 
SET g_06 = 1
WHERE m_kv_category_id BETWEEN 1360 AND 1420 
;

UPDATE m_kvs 
SET g_06 = 0
WHERE id IN(1420001, 1420002, 1420003, 1420004, 1420098, 1420099)
;
