-- 拠点に記号を追加
ALTER TABLE m_branches 
ADD COLUMN symbol VARCHAR(1024) NULL COMMENT '記号' AFTER short_name;

UPDATE m_branches SET symbol = 'O' WHERE (id = '1');
UPDATE m_branches SET symbol = 'T' WHERE (id = '2');
UPDATE m_branches SET symbol = 'N' WHERE (id = '3');
