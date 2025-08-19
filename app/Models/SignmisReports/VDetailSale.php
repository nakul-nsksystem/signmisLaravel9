<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VDetailSale extends BaseReportModel
{
    // 数値を型変換(キャスト)
    protected $casts = [
        'qty'         => 'double',
        'price'       => 'double',
        'total_price' => 'double',
    ];

    // 日付を型変換(キャスト)
    protected $dates = [
        'accounting_date',
    ];

    //画面およびcsvに表示しない検索用情報
    protected $hidden = [
        'm_branch_id',
        'm_branch_cd',
        'm_customer_id',
        'm_user_id',
        'm_user_cd',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        '拠点',
        '売上日',
        '伝票No',
        '明細No',
        '取引先CD',
        '取引先名',
        '品名',
        '数量',
        '単位',
        '単価',
        '金額',
        '物件CD',
        '自社担当者',
        '客先注文No',
        '客先担当者',
        '摘要',
        '備考',
    ] ;

}
