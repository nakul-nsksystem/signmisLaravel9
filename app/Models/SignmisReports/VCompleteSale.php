<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VCompleteSale extends BaseReportModel
{
    // 数値を型変換(キャスト)
    protected $casts = [
        'total_price'   => 'double',
        'carry_over'    => 'double',
        'payment_price' => 'double',
        'balance'       => 'double',
        'tax'           => 'double',
        'sub_total'     => 'double',
        'grand_total'   => 'double',
        'uncollected'   => 'double',
    ];

    // 日付を型変換(キャスト)
    protected $dates = [
        'complete_day',
        'due_date',
    ];

    // 画面およびcsvに表示しない検索用情報
    protected $hidden = [
        'm_branch_id',
        'm_branch_cd',
        'm_branch_name',
        'm_customer_id',
        'data_linkage_cd',
        'm_customer_closing_date',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        'コード',
        '取引先名',
        '請求No',
        '請求日',
        '前回請求額',
        '入金額',
        '繰越額',
        '売上額',
        '消費税',
        '売上合計',
        '今回請求額',
        '回収残',
        '入金予定日',
        '備考',
    ] ;

}
