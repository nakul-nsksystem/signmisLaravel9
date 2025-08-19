<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VPaymentSale extends BaseReportModel
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
        '入金日',
        '取引先コード',
        '取引先名',
        '取引先支払日',
        '入金額',
        '入金合計',
        '入金区分名',
        '対象請求日',
        '入金予定日',
        '売上合計額',
        '入金備考',
        '販売管理備考',
    ];

}
