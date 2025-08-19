UPDATE `m_kv_categories` SET `system_memo` = 'g_01:{ロス込原価の表記},g_02:{0:無し,1:幅x流,2:長さ,3:容量},g_03:{管理単位の表記},g_04:{発注単位のデフォルトidを設定},g_05:{管理単位の計算式},g_06:{原価表示:0非表示,1:表示},' WHERE (`id` = '1360');
UPDATE `m_kv_categories` SET `system_memo` = 'g_01:ロス込み原価計算方法' WHERE (`id` = '1350');

UPDATE `m_kvs` SET `g_01` = '幅方向に200mm・流れ方向に5mのロスを設定 \n仕入れ単価 ÷ {(w-200)×(h-5000)}' WHERE (`id` = '1350001');
UPDATE `m_kvs` SET `g_01` = '幅方向に100mm・流れ方向に5mのロスを設定 \n仕入れ単価 ÷ {(w-100)×(h-5000)}' WHERE (`id` = '1350002');
UPDATE `m_kvs` SET `g_01` = '幅方向に100mm・流れ方向に5mのロスを設定 \n仕入れ単価 ÷ {(w-100)×(h-5000)}' WHERE (`id` = '1350003');
UPDATE `m_kvs` SET `g_01` = '一枚単価×1.15' WHERE (`id` = '1350011');
UPDATE `m_kvs` SET `g_01` = '一枚単価×1.15' WHERE (`id` = '1350012');
UPDATE `m_kvs` SET `g_01` = 'L/㎡/m単価×1.15' WHERE (`id` = '1350022');

