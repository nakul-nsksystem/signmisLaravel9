<?php

namespace App\Http\Controllers\Api\Traits;

trait NumberTrait
{
    /**
     * 無効な数値を0にする
     */
    public function invalid2zr($val)
    {
        if (is_null($val) || is_nan($val) || !is_finite($val)) {
            return 0;
        }
        return (float)$val;
    }

    /**
     * Nullを0に変換
     */
    public function nl2zr($val)
    {
        return $this->invalid2zr($val);
    }

    /**
     * 切り捨て
     */
    public function trunc($val, $digit = 0)
    {
        $v = intval($val * pow(10, $digit)) / pow(10, $digit);
        return $this->invalid2zr($v);
    }

    /**
     * 四捨五入
     */
    public function round($val, $digit = 0)
    {
        $v = round($val, $digit);
        return $this->invalid2zr($v);
    }

    /**
     * 切り上げ
     */
    public function ceil($val, $digit = 0)
    {
        $v = ceil($val * pow(10, $digit)) / pow(10, $digit);
        return $this->invalid2zr($v);
    }

    /**
     * 端数処理・丸め処理
     */
    public function rounding($val, $fraction_type, $digit = 0)
    {
        switch ($fraction_type) {
            case 1070001:
                return $this->trunc($val, $digit);
            case 1070002:
                return $this->round($val, $digit);
            case 1070003:
                return $this->ceil($val, $digit);
        }
        return $val;
    }

    /**
     * 書式[整数値：左側を0埋め]
     */
    public function formatZeroPadding($val, $digit = 0)
    {
        return str_pad((string)$val, $digit, '0', STR_PAD_LEFT);
    }

    /**
     * 書式[整数値：カンマ区切り+小数点以下：0埋め]
     */
    public function formatDecimalZeroPadding($val, $digit = 2)
    {
        return number_format($val, $digit, '.', ',');
    }

    /**
     * 書式[0除去]
     */
    public function formatZeroSuppress($val, $isNullToZero = true)
    {
        return number_format($val, 20, '.', '');
    }

    /**
     * 桁数取得[整数用]
     */
    public function getLength($val)
    {
        return strlen((string)$val);
    }

    /**
     * 桁数取得[小数点用]
     */
    public function getDecimalLength($val)
    {
        return strlen(substr(strrchr($val, '.'), 1));
    }

    /**
     * 符号取得
     */
    public function getSign($val)
    {
        return sign($this->invalid2zr($val));
    }
}
