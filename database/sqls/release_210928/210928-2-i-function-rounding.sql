USE signmis;
DROP FUNCTION IF EXISTS rounding;
DELIMITER $$

CREATE 
FUNCTION rounding(val DECIMAL(15, 4), rounding_type INT)
RETURNS DECIMAL(15, 4)

CONTAINS SQL
COMMENT '端数処理'

BEGIN
    RETURN 
        CASE
            WHEN rounding_type = 1070001 THEN
                -- 切捨
                TRUNCATE(val, 0)
            WHEN rounding_type = 1070002 THEN
                -- 四捨五入
                ROUND(val)
            WHEN rounding_type = 1070003 THEN
                -- 切上
                ROUND_UP(val)
            ELSE
                val
        END ;

END$$

DELIMITER ;
