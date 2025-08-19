<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VUnclaimedSale extends BaseReportModel
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
        '取引先名',
        '締日',
        '担当者名',
        '対象請求日',
        '売上伝票数',
        '最終売上日',
        '売上額',
        '最終入金日',
        '入金額',
        '最終請求日',
        '請求額',
        '経過月',
    ] ;
}
