<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VPaymentPurchase extends BaseReportModel
{
    // 数値を型変換(キャスト)
    protected $casts = [
        'payment_price' => 'double',
        'payment_total' => 'double',
        'balance'       => 'double',
        'sub_total'     => 'double',
    ];

    // 日付を型変換(キャスト)
    protected $dates = [
        'payment_day',
        'complete_day',
        'due_date',
    ];

    //画面およびcsvに表示しない検索用情報
    protected $hidden = [
        'm_branch_id',
        'm_branch_cd',
        'm_branch_name',
        'm_customer_id',
        't_complete_details_id',
        'payment_m_kv_id',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        '支払日',
        '仕入先コード',
        '仕入先名',
        '仕入先支払日',
        '支払額',
        '支払合計',
        '支払区分名',
        '対象仕入締日',
        '支払予定日',
        '仕入合計額',
        '支払備考',
        '販売管理備考',
    ] ;

}
