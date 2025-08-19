<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VDetailPurchase extends BaseReportModel
{
    // 数値を型変換(キャスト)
    protected $casts = [
        'material_size_x' => 'double',
        'material_size_y' => 'double',
        'capacity'        => 'double',
        'contents_qty'    => 'double',
        'qty'             => 'double',
        'price'           => 'double',
        'total_price'     => 'double',
    ];

    // 日付を型変換(キャスト)
    protected $dates = [
        'purchase_date',
    ];

    //画面およびcsvに表示しない検索用情報
    protected $hidden = [
        'm_branch_id',
        'm_branch_cd',
        'm_customer_id',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        '拠点名',
        '仕入日',
        '仕入伝票No',
        '仕入明細No',
        '取引先コード',
        '取引先名',
        '材料名',
        '幅',
        '流れ',
        '容量',
        '入数',
        '数量',
        '単位',
        '単価',
        '金額',
        '担当者名',
        '摘要',
        '備考',
    ] ;

}
