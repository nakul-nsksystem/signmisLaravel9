<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VCompletePurchase extends BaseReportModel
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
        'accounts_title_m_kv_id',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        '科目コード',
        '勘定科目',
        'コード',
        '仕入先名',
        '仕入締No',
        '仕入締日',
        '前回仕入締額',
        '支払額',
        '繰越額',
        '仕入額',
        '消費税',
        '仕入合計',
        '今回仕入締額',
        '未払残',
        '支払予定日',
        '備考',
    ] ;

}
