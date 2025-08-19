<?php

namespace App\Frameworks;

use Illuminate\Support\Facades\Log;
use DateTime;

class ReportUtil
{

    /**
     * 改ページする必要があるか判定
	 * @$current        現在行の位置
	 * @$lines_per_page 1ページ明細行数
	 * @$is_est 見積明細行での改ページのために見積のみtrueにする
     * @return boolean
     */
	public static function isBreakPage(int $current, int $lines_per_page , bool $is_est = false)
    {
		// 改ページする必要があるか判定
		if ($current <= $lines_per_page) {
			// 現在行がページ行数に達してない
			return false ;

		} elseif ($lines_per_page == 1) {
			// ページ行数が1
			return true ;

		} elseif ($is_est) {
			// 見積の時
			return ($current % $lines_per_page) >= 1 ;

		}  
		else {
			// 剰余演算の結果が1の場合は改ページ
			return ($current % $lines_per_page) == 1 ;

		}
	}

    /**
     * 最終ページに必要な空行数を計算
	 * @$rowCount       全行数
	 * @$lines_per_page 1ページ明細行数
     * @return int
     */
	public static function emptyRowCount(int $rowCount, int $lines_per_page)
    {
		if ($rowCount == 0) {
			// データ件数が0の場合は全て空行数で返す
			return $lines_per_page ;

		} elseif ($rowCount % $lines_per_page == 0) {
			// 空行は無し
			return 0 ;

		} else {
			// 最終ページに必要な空行数を計算
			return $lines_per_page - ($rowCount % $lines_per_page) ;

		}
	}

    /**
     * 総ページ数を計算
	 * @$rowCount       全行数
	 * @$lines_per_page 1ページ明細行数
     * @return int
     */
	public static function totalPage(int $rowCount, int $lines_per_page)
    {
		// 総ページ数を計算
		return ($lines_per_page == 0) ? 0 : intdiv($rowCount - 1, $lines_per_page) + 1 ;
	}

	/**
	 * 0又はnullの場合はブランク、以外はnumber_formatで出力
	 * @$number   [nullable]フォーマットする数値
	 * @$decimals 小数点以下の桁数
	 * @return string
	 */
	public static function numberFormatZeroBlank(float $number = null, int $decimals = 0) {
		// 0はブランク出力、以外はnumber_formatで出力
		return ($number == null or $number == 0) ? "" : number_format($number, $decimals) ;
	}

	/**
	 * decimal型の表示用 
	 * ※浮動小数点数考慮できていません！小数第12位くらいまでいくと誤差が出てしまいます
	 * @$number 表示形式を変換する数字
	 * @$digits 表示する小数点以下の桁数
	 * @$isZeroBlank 0の場合に空欄にするかどうか(デフォルト[false：0で表示])
	 * @return array(formatted_num, postfix)
	 */
	public static function formatDecimal(float $number = null, int $digits, bool $isZeroBlank = false) {
		if ($number == null) {
			return array(
				"formatted_num" => "" ,
				"postfix"       => "" ,
			) ;
		}

		// 小数以下含む数字フラグ
		$isDecimal = $number - floor($number) != 0 && $digits > 0 ;
		
		// 0ではない最終桁数
		$existsDecimalNum = 0 ;
		// postfix（画面には描画しない）
		$postfix = "" ;

		if ($isDecimal) {
			// 小数点以下存在する場合
			// 指定の桁数分小数点以下を切り出し
			$decimal = explode(".", number_format($number, $digits))[1] ;

			// 切り出した数字を分割
			$decimalArr = str_split($decimal) ;
			
			// 0ではない最終桁数を取得
			foreach ($decimalArr as $index => $dec) {
				if ($dec > 0) $existsDecimalNum = $index + 1 ;
			}

			// number_formatの仕様で四捨五入されて整数になってしまう場合のpostfix調整 
			if ($decimal == "00") $postfix .= "." ;
			
		} else {
			// 整数の場合は小数点もpostfixに入れる
			$postfix .= "." ;
		}

		// postfixの生成
		for ($i = 1; $i <= $digits - $existsDecimalNum; $i++) {
			$postfix .= "0" ;
		}

		$formattedNum = number_format($number, $existsDecimalNum) ;

		// 値が0の場合に空欄にするかどうか判定
		if ($number == 0 && $isZeroBlank == true) {
			// 値が0で表示しないモード
			$formattedNum = " " ;
		}

		return array(
			"formatted_num" => $formattedNum ,
			"postfix"       => $postfix ,
		) ;
	}

    /**
     * PHP 日付フォーマットdate()を拡張
	 * @$date  		日付
	 * @$format		書式設定
	 * @$e			変換できない場合の初期値
     * @return string
     */
	public static function formatDate(string $date = null, string $format = null, string $e = null)
    {
		// デフォルトの書式を変更したい場合
		if ($format == null) {
			$format = 'Y/m/d';
		}

		if ($date == null || $date == '' || $date == '0000-00-00' || $date == '0000-00-00 00:00:00') {
			// NULL・MySQLなどにありがちな文字列はここで対応
			return $e;
		} else {
			//文字列を日付として解釈
			try {
				$date = new DateTime($date);
				return $date->format($format);
			} catch (Exception $_) {
				return $e;
			}
		}		
	}

}