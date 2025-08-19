USE signmis;
DROP FUNCTION IF EXISTS round_up;
DELIMITER $$

CREATE 
FUNCTION round_up(val DECIMAL(15, 4))
RETURNS DECIMAL(15, 4)

CONTAINS SQL
COMMENT '切り上げ'

BEGIN
    -- 符号を無視して絶対値を切り上げる(0から離す)
    -- 整数：正の無限大への丸め(rounding toward plus  infinity: RP) ROUND_UP( 1.1) →  2
    -- 負数：負の無限大への丸め(rounding toward minus infinity: RM) ROUND_UP(-1.1) → -2
    RETURN CEIL(ABS(val)) * SIGN(val);

END$$

DELIMITER ;
