/* SignMIS 返還インボイス */

/* 区分マスタ */
ALTER TABLE m_kvs ADD COLUMN re_invoice_flg TINYINT(1) NOT NULL DEFAULT 0 COMMENT '返還インボイスフラグ' AFTER g_10 ;

UPDATE m_kvs SET re_invoice_flg = 0 ;

INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, re_invoice_flg, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1200006', '1200', '6', '6', '先月 返品', '0', '1', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, re_invoice_flg, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1200007', '1200', '7', '7', '先月 値引', '0', '1', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, re_invoice_flg, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1205006', '1205', '6', '6', '先月 返品', '0', '1', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, g_01, re_invoice_flg, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1205007', '1205', '7', '7', '先月 値引', '0', '1', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

-- UPDATE m_kvs SET kv_name = '当月 返品' WHERE (id = 1200002);
-- UPDATE m_kvs SET kv_name = '当月 値引' WHERE (id = 1200003);
-- UPDATE m_kvs SET kv_name = '当月 返品' WHERE (id = 1205002);
-- UPDATE m_kvs SET kv_name = '当月 値引' WHERE (id = 1205003);

UPDATE m_kvs SET order_no       = 9 WHERE id IN(1200005, 1205005) ;

/* 締 */
ALTER TABLE t_completes 
CHANGE  COLUMN total_price_include total_price_tax_exemption    DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '売上/仕入金額(非課税)'                                   ,
ADD     COLUMN re_total_price_normal                            DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(通常税率)'      AFTER total_price_tax_exemption ,
ADD     COLUMN re_total_price_reduced                           DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(軽減税率)'      AFTER re_total_price_normal     ,
ADD     COLUMN re_total_price_tax_exemption                     DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(非課税)'        AFTER re_total_price_reduced    ,
ADD     COLUMN re_tax_normal                                    DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還消費税(通常税率)'    AFTER tax_reduced               ,
ADD     COLUMN re_tax_reduced                                   DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還消費税(軽減税率)'    AFTER re_tax_normal              
;

UPDATE t_completes
   SET re_total_price_normal        = 0 , 
       re_total_price_reduced       = 0 , 
       re_total_price_tax_exemption = 0 , 
       re_tax_normal                = 0 , 
       re_tax_reduced               = 0   
;

/* 合計金額=金額(通常) 消費税=消費税(通常) に上書き */
UPDATE t_completes SET total_price_normal = total_price ;
UPDATE t_completes SET tax_normal         = tax ;


/* 売 */
ALTER TABLE t_sales 
CHANGE  COLUMN total_price_include total_price_tax_exemption    DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '売上金額(非課税)'                                        ,
ADD     COLUMN re_total_price_normal                            DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(通常税率)'      AFTER total_price_tax_exemption ,
ADD     COLUMN re_total_price_reduced                           DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(軽減税率)'      AFTER re_total_price_normal     ,
ADD     COLUMN re_total_price_tax_exemption                     DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(非課税)'        AFTER re_total_price_reduced    ,
ADD     COLUMN re_tax_normal                                    DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還消費税(通常税率)'    AFTER tax_reduced               ,
ADD     COLUMN re_tax_reduced                                   DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還消費税(軽減税率)'    AFTER re_tax_normal              
;

UPDATE t_sales
   SET re_total_price_normal        = 0 , 
       re_total_price_reduced       = 0 , 
       re_total_price_tax_exemption = 0 , 
       re_tax_normal                = 0 , 
       re_tax_reduced               = 0   
;

/* 仕入 */
ALTER TABLE t_p_invoices 
CHANGE  COLUMN total_price_include total_price_tax_exemption    DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '仕入金額(非課税)'                                        ,
ADD     COLUMN re_total_price_normal                            DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(通常税率)'      AFTER total_price_tax_exemption ,
ADD     COLUMN re_total_price_reduced                           DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(軽減税率)'      AFTER re_total_price_normal     ,
ADD     COLUMN re_total_price_tax_exemption                     DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還金額(非課税)'        AFTER re_total_price_reduced    ,
ADD     COLUMN re_tax_normal                                    DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還消費税(通常税率)'    AFTER tax_reduced               ,
ADD     COLUMN re_tax_reduced                                   DECIMAL(15, 4) NOT NULL DEFAULT 0 COMMENT '返還消費税(軽減税率)'    AFTER re_tax_normal              
;

UPDATE t_p_invoices
   SET re_total_price_normal        = 0 , 
       re_total_price_reduced       = 0 , 
       re_total_price_tax_exemption = 0 , 
       re_tax_normal                = 0 , 
       re_tax_reduced               = 0   
;


/* 売上・仕入 締区分追加 */
ALTER TABLE t_sales 
ADD COLUMN account_m_kv_id INT NOT NULL DEFAULT 1060000 COMMENT '締区分' AFTER slip_m_kv_id,
ADD INDEX fk_t_sales_account_m_kv_id (account_m_kv_id ASC)
;

ALTER TABLE t_sales 
ADD CONSTRAINT fk_t_sales_account_m_kv_id
  FOREIGN KEY (account_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
;

ALTER TABLE t_p_invoices 
ADD COLUMN account_m_kv_id INT NOT NULL DEFAULT 1060000 COMMENT '締区分' AFTER slip_m_kv_id,
ADD INDEX fk_t_p_invoices_account_m_kv_id (account_m_kv_id ASC)
;

ALTER TABLE t_p_invoices 
ADD CONSTRAINT fk_t_p_invoices_account_m_kv_id
  FOREIGN KEY (account_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
;

UPDATE t_sales      SET account_m_kv_id = 1060000 ;
UPDATE t_p_invoices SET account_m_kv_id = 1060000 ;

/* 売上の締区分を変更 */
/* プリスマ系は伝票時 以外は請求時で統一 */
UPDATE t_sales      s SET s.account_m_kv_id = 1060001 WHERE s.accounting_m_customer_id IN(SELECT c.id FROM m_customers c WHERE c.account_m_kv_id = 1060001) ;
UPDATE t_sales      s SET s.account_m_kv_id = 1060002 WHERE s.accounting_m_customer_id IN(SELECT c.id FROM m_customers c WHERE c.account_m_kv_id = 1060002) ;
UPDATE t_sales      s SET s.account_m_kv_id = 1060003 WHERE s.accounting_m_customer_id IN(SELECT c.id FROM m_customers c WHERE c.account_m_kv_id = 1060003) ;

/* 仕入の締区分を変更 */
UPDATE t_p_invoices s SET s.account_m_kv_id = 1060000 ;
UPDATE t_p_invoices s SET s.account_m_kv_id = 1060001 WHERE s.supplier_m_customer_id   IN(SELECT c.id FROM m_customers c WHERE c.account_m_kv_id = 1060001) ;
UPDATE t_p_invoices s SET s.account_m_kv_id = 1060002 WHERE s.supplier_m_customer_id   IN(SELECT c.id FROM m_customers c WHERE c.account_m_kv_id = 1060002) ;
UPDATE t_p_invoices s SET s.account_m_kv_id = 1060003 WHERE s.supplier_m_customer_id   IN(SELECT c.id FROM m_customers c WHERE c.account_m_kv_id = 1060003) ;

-- 請求締処理の消費税
UPDATE t_p_invoices s SET s.account_m_kv_id = 1060003 WHERE s.slip_m_kv_id  = 1160003 ;

-- 伝票に変更
UPDATE t_p_invoices s SET s.account_m_kv_id = 1060002 WHERE s.slip_m_kv_id <> 1160003 and t_complete_id <> -1 and s.tax <> 0 ;

-- 個別に変更
UPDATE t_p_invoices s SET s.account_m_kv_id = 1060001 WHERE s.slip_m_kv_id <> 1160003 and t_complete_id <> -1 and s.tax <> 0 and s.id in(select d.t_p_invoice_id from t_p_invoice_details d where d.tax <> 0) ;

-- 大阪 伊藤商行の残高以前の仕入は伝票時
update t_p_invoices set account_m_kv_id = 1060002 where supplier_m_customer_id = 10117 and t_complete_id = -1 ;
-- 大阪 キヌガワの残高以前の仕入は伝票時
update t_p_invoices set account_m_kv_id = 1060002 where supplier_m_customer_id = 10138 and t_complete_id = -1 ;
-- 大阪 東洋粘着資材の残高以前の仕入は個別
update t_p_invoices set account_m_kv_id = 1060001 where supplier_m_customer_id = 10191 and t_complete_id = -1 ;
-- 大阪 ニップの残高以前の仕入は個別
update t_p_invoices set account_m_kv_id = 1060001 where supplier_m_customer_id = 10197 and t_complete_id = -1 ;
-- 大阪 日本製図器の残高以前の仕入は伝票時
update t_p_invoices set account_m_kv_id = 1060002 where supplier_m_customer_id = 10199 and t_complete_id = -1 ;
-- 大阪 エネクスフリートの残高以前の仕入は伝票時
update t_p_invoices set account_m_kv_id = 1060002 where supplier_m_customer_id = 10392 and t_complete_id = -1 ;

-- 東京 大塚商会の仕入は一部請求時に
update t_p_invoices set account_m_kv_id = 1060003 where supplier_m_customer_id = 36793 and t_complete_id = -1 ;
UPDATE t_p_invoices SET account_m_kv_id = 1060003 WHERE id in(200786, 200787, 200792, 201063, 200952, 200953, 201120, 201119, 201121) ;

-- 大阪 大塚商会の残高以前の仕入は伝票時
update t_p_invoices set account_m_kv_id = 1060002 where supplier_m_customer_id = 37132 and t_complete_id = -1 ;

-- 確認
SELECT * FROM t_sales      WHERE account_m_kv_id = 1060000 ;
SELECT * FROM t_p_invoices WHERE account_m_kv_id = 1060000 ;

COMMIT;
