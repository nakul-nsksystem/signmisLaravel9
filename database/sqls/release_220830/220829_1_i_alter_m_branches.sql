-- 拠点

-- 拠点締日を追加
ALTER TABLE m_branches
ADD COLUMN closing_date INT NULL COMMENT '拠点締日' AFTER production_end_at ;

-- 締日を設定
UPDATE m_branches SET closing_date = 99 WHERE (id = 2);
UPDATE m_branches SET closing_date = 20 WHERE (id = 1);
UPDATE m_branches SET closing_date = 20 WHERE (id = 3);
