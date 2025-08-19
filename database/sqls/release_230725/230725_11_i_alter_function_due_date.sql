-- 関数：入金・支払予定日
DROP function IF EXISTS due_date ;

DELIMITER $$
CREATE FUNCTION due_date(complete_day DATETIME, interval_num INT) 
    RETURNS DATETIME
    COMMENT '入金・支払予定日'
BEGIN
    -- 請求日(complete_day)から予定日(interval_num)を参照して入金予定日・支払予定日を計算
    -- 予定日：1～99  は日を参照 日が0の場合は1を31～99は31を設定
    -- 予定日：100の位は月を参照
    -- 例 [031/099] 当月末 [120]翌月20日 [205]翌々5日 [231/299]翌々月末 [310]3ヵ月後10日
    RETURN 
        DATE_ADD(
            DATE_ADD(
                DATE_FORMAT(complete_day, '%Y-01-01'), 
                INTERVAL (GREATEST(1, LEAST(MOD(interval_num, 100), 31)) - 1) DAY
            ), 
            INTERVAL (DATE_FORMAT(complete_day, '%m') + TRUNCATE(interval_num / 100, 0) - 1) MONTH
        ) ;
END $$

DELIMITER ;
;
