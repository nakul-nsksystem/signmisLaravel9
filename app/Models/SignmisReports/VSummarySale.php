<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VSummarySale extends BaseReportModel
{
    // 数値を型変換(キャスト)
    protected $casts = [
        'total_price'   => 'double',
        'sub_total'     => 'double',
        'payment_price' => 'double',
        'commission'    => 'double',
        'uncollected'   => 'double',
    ];

    // 日付を型変換(キャスト)
    protected $dates = [
        'complete_day',
        'due_date',
    ];

    //画面およびcsvに表示しない検索用情報
    protected $hidden = [
        'm_branch_id',
        'm_branch_cd',
        'm_branch_name',
        'm_customer_id',
        'm_user_id',
        'm_user_cd',
        'grouping_column',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        '担当者名',
        '取引先コード',
        '取引先名',
        '請求日',
        '入金予定日',
        '売上額',
        '売上合計',
        '入金額',
        '手数料',
        '未収残',
        '備考',
    ] ;
}
