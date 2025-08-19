-- 税マスタ

-- テーブル定義
CREATE TABLE m_taxes (
  id INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  order_no INT NULL COMMENT '表示順',
  start_day DATE NOT NULL COMMENT '開始日',
  tax_rate DECIMAL(4, 4) NOT NULL COMMENT '税率',
  reduced_tax_rate DECIMAL(4, 4) NOT NULL COMMENT '軽減税率',
  memo VARCHAR(1024) NULL COMMENT '備考',
  created_m_user_id INT NOT NULL COMMENT '作成担当者',
  updated_m_user_id INT NOT NULL COMMENT '更新担当者',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  deleted_at DATETIME NULL COMMENT '削除日',
  PRIMARY KEY (id))
COMMENT = '税';

-- データ追加
INSERT INTO m_taxes (id, order_no, start_day, tax_rate, reduced_tax_rate, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES (1, 1, '1900-01-01', '0', '0', '0', '0', '2000-01-01', '2000-01-01');
INSERT INTO m_taxes (id, order_no, start_day, tax_rate, reduced_tax_rate, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES (2, 2, '1989-04-01', '0.03', '0', '0', '0', '2000-01-01', '2000-01-01');
INSERT INTO m_taxes (id, order_no, start_day, tax_rate, reduced_tax_rate, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES (3, 3, '1997-04-01', '0.05', '0', '0', '0', '2000-01-01', '2000-01-01');
INSERT INTO m_taxes (id, order_no, start_day, tax_rate, reduced_tax_rate, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES (4, 4, '2014-04-01', '0.08', '0', '0', '0', '2000-01-01', '2000-01-01');
INSERT INTO m_taxes (id, order_no, start_day, tax_rate, reduced_tax_rate, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES (5, 5, '2019-10-01', '0.1', '0.08', '0', '0', '2000-01-01', '2000-01-01');

-- 売上・仕入の税率を 10[10%]→0.1 に変更
UPDATE t_sale_details      SET tax_rate = tax_rate / 100 WHERE tax_rate > 1 ;
UPDATE t_p_invoice_details SET tax_rate = tax_rate / 100 WHERE tax_rate > 1 ;
