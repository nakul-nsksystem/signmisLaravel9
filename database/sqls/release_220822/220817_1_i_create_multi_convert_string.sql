SET GLOBAL log_bin_trust_function_creators = 1; 
DROP function IF EXISTS multi_convert_string ;

DELIMITER $$

CREATE FUNCTION multi_convert_string(
    pValue VARCHAR(255) , --  対象文字列
    pLength INT           --  変換したいバイト数
)
    RETURNS VARCHAR(255) 
    COMMENT '指定バイト数で文字を区切って変換'

BEGIN
    DECLARE str, result VARCHAR(255) DEFAULT ''  ; -- 変換文字処理用
    DECLARE i, position, maxLehgth INT DEFAULT 0 ; -- 変換文字のポジション用

    -- NULLチェック
    IF pValue IS NULL THEN
        RETURN NULL ;
    END IF ;

    SET maxLehgth = CHAR_LENGTH(pValue) ;

    -- 1文字単位でループ
    loop1: LOOP
        -- カウンターインクリメント
        SET i = i + 1 ;

        -- 閾値判定：超えていたら処理を抜ける
        IF maxLehgth < i THEN
            LEAVE loop1 ;
        END IF ;

        -- 現在の文字位置
        SET str = SUBSTRING(pValue, i, 1) ;

        -- 全角半角判定
        IF REGEXP_LIKE(str, '[ｦ-ﾟ]') THEN
            -- 半角カナはutf-8では3バイトなので1バイトとして計算
            SET position = position + 1 ;
        ELSE
            -- 半角は1バイト・全角は2バイト計算(utf-8[3byte]→shift-jis[2byte])
            SET position = position + IF(LENGTH(str) = 1, 1, 2) ;
        END IF ;

        -- 閾値判定：超えていたら処理を抜ける
        IF pLength < position THEN
            LEAVE loop1 ;
        END IF ;

        -- そうでない場合は文字を結合
        SET result = CONCAT(result, str) ;
    END LOOP loop1 ;

    RETURN result ;
END$$

DELIMITER  ;
