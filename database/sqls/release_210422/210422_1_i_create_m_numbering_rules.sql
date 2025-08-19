CREATE TABLE m_numbering_rules (
  id INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  order_no INT NULL COMMENT '表示順',
  name VARCHAR(1024) NULL COMMENT '名称',
  description VARCHAR(1024) NULL COMMENT '説明',
  category_m_kv_id INT NULL COMMENT 'カテゴリ',
  key_name VARCHAR(1024) NULL COMMENT 'ユーザー名',
  function_name VARCHAR(1024) NULL COMMENT '関数名',
  argument_name1 VARCHAR(1024) NULL COMMENT '引数1',
  argument_name2 VARCHAR(1024) NULL COMMENT '引数2',
  argument_name3 VARCHAR(1024) NULL COMMENT '引数3',
  auto_increment INT NOT NULL DEFAULT 1 COMMENT 'インクリメント値',
  memo VARCHAR(1024) NULL COMMENT '備考',
  created_m_user_id INT NULL COMMENT '作成担当者',
  updated_m_user_id INT NULL COMMENT '更新担当者',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日',
  deleted_at DATETIME NULL COMMENT '削除日',
  PRIMARY KEY (id))
COMMENT = '採番ルール';

ALTER TABLE m_numbering_rules 
ADD INDEX fk_m_numbering_rules_category_m_kv_id (category_m_kv_id ASC) ,
ADD INDEX fk_m_numbering_rules_created_m_user_id (updated_m_user_id ASC) ,
ADD INDEX fk_m_numbering_rules_updated_m_user_id (created_m_user_id ASC) ;
;

ALTER TABLE m_numbering_rules 
ADD CONSTRAINT fk_m_numbering_rules_category_m_kv_id
  FOREIGN KEY (category_m_kv_id)
  REFERENCES m_kvs (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT fk_m_numbering_rules_created_m_user_id
  FOREIGN KEY (created_m_user_id)
  REFERENCES m_users (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT fk_m_numbering_rules_updated_m_user_id
  FOREIGN KEY (updated_m_user_id)
  REFERENCES m_users (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;


INSERT INTO m_kv_categories (id, order_no, kv_key, kv_category_name, is_user_editable, created_at, updated_at) VALUES ('1700', '1700', 'm_numbering_rules-category_m_kv_id', '採番ルール.カテゴリ', '0', '2000-01-01', '2000-01-01');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1700001', '1700', '1', '1', '取引先CD', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_kvs (id, m_kv_category_id, order_no, kv_cd, kv_name, is_user_editable, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES ('1700002', '1700', '2', '2', '物件CD', '0', '0', '0', '2000-01-01 00:00:00', '2000-01-01 00:00:00');

INSERT INTO m_numbering_rules (id, order_no, name, description, category_m_kv_id, key_name, function_name, argument_name1, auto_increment, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES (1, 1, '取引先.CD', '1：頭に拠点の記号[O・T・N]を付ける 2：取引先・仕入先・外注先はprefix[拠点1桁] + CD[4桁] 3：納品先は取引先CD + 連番[3桁] 採番しないで手打ちを想定 4：CD附番時は(取引先・仕入先・外注先)4桁に対してMAX+1 5：管理用領域([O・T・N]+9000番台)は採番ルールから除外', 1700001, 'mike', 'NumberingRrule_CustomerCd_mike', 'model[m_branch_id]', 1, 0, 0, '2000-01-01 00:00:00', '2000-01-01 00:00:00');
INSERT INTO m_numbering_rules (id, order_no, name, description, category_m_kv_id, key_name, function_name, argument_name1, auto_increment, created_m_user_id, updated_m_user_id, created_at, updated_at) VALUES (2, 2, '物件.CD', '1：頭に拠点の記号[O・T・N]を付ける 2：[拠点][YY][MM][連番4桁]：例(T21040001, T21040002)', 1700002, 'mike', 'NumberingRrule_ProjectCd_mike', 'model[m_branch_id]', 1, 0, 0, '2000-01-01 00:00:00', '2000-01-01 00:00:00');

