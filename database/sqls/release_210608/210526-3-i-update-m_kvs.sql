-- 材料マスタの原価表示フラグを更新

UPDATE m_kvs SET g_06 = '0' WHERE (id = '1410001');
UPDATE m_kvs SET g_06 = '0' WHERE (id = '1410002');
UPDATE m_kvs SET g_06 = '0' WHERE (id = '1410003');
UPDATE m_kvs SET g_06 = '0' WHERE (id = '1410004');
UPDATE m_kvs SET g_06 = '1' WHERE (id = '1420001');
UPDATE m_kvs SET g_06 = '1' WHERE (id = '1420002');
