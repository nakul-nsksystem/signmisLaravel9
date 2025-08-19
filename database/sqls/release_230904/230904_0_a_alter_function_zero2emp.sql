-- 関数：帳票用0を空文字にして返す
DROP function IF EXISTS zero2emp ;

DELIMITER $$
CREATE FUNCTION zero2emp(val DECIMAL(15,4)) 
    RETURNS DECIMAL(15,4)
    COMMENT '帳票用0をNULLにして返す'
BEGIN
    DECLARE result DECIMAL(15,4);

    IF val = 0 THEN
        SET result = NULL;
    ELSE
        SET result = val;
    END IF;

    RETURN result;
END $$

DELIMITER ;
;
