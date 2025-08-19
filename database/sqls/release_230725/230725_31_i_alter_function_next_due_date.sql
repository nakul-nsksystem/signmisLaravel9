-- 関数：入金・支払予定日
DROP function IF EXISTS next_due_date ;

DELIMITER $$
CREATE FUNCTION next_due_date(target_date DATETIME, closing_date INT) 
    RETURNS DATETIME
    COMMENT '次回期日'
BEGIN
    -- 対象日(target_date)から締日(closing_date)を参照して次回期日を計算
    -- 予定日：1～99  は日を参照 日が0の場合は1を31～99は31を設定
    -- 予定日：100の位は月を参照
    -- 例 [031/099] 当月末 [120]翌月20日 [205]翌々5日 [231/299]翌々月末 [310]3ヵ月後10日
    RETURN 
        CASE 
            WHEN closing_date = 0 THEN
                -- [締日が0]は当月初日
                DUE_DATE(target_date, 1)

            WHEN DATE_FORMAT(target_date, '%e') <= closing_date THEN
                -- [対象日 <= 締日]は当月締日
                DUE_DATE(target_date, closing_date)

            ELSE
                -- 翌月締日
                DUE_DATE(target_date, closing_date + 100)

        END ;
END $$

DELIMITER ;
;
