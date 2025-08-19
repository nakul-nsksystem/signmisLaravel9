<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VUnclaimedPurchase extends BaseReportModel
{
    // 数値を型変換(キャスト)
    protected $casts = [
        'slip_cnt'      => 'double',
        'total_price'   => 'double',
        'payment_price' => 'double',
        'grand_total'   => 'double',
        'elapsed_month' => 'double',
    ];

    // 日付を型変換(キャスト)
    protected $dates = [
        'period',
        'accounting_date',
        'payment_day',
        'complete_day',
    ];

    // 画面およびcsvに表示しない検索用情報
    protected $hidden = [
        'm_branch_id',
        'm_branch_cd',
        'm_branch_name',
        'm_customer_id',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        'コード',
        '仕入先名',
        '締日',
        '担当者名',
        '対象仕入締日',
        '仕入伝票数',
        '最終仕入日',
        '仕入額',
        '最終支払日',
        '支払額',
        '最終仕入締日',
        '仕入締額',
        '経過月',
    ] ;
}
