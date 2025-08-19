-- 取引先に特記事項、販売管理用の備考を追加
ALTER TABLE m_customers 
ADD COLUMN notices VARCHAR(1024) NULL DEFAULT NULL COMMENT '特記事項' AFTER convert_memo;

ALTER TABLE m_customers 
ADD COLUMN sales_management_memo VARCHAR(1024) NULL DEFAULT NULL COMMENT '販売管理備考' AFTER notices;

UPDATE m_customers SET sales_management_memo = memo;
UPDATE m_customers SET memo = NULL;

