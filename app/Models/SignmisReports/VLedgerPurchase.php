<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VLedgerPurchase extends BaseReportModel
{
    // CSVヘッダー
    public static $csvHeader = [
        '取引日',
        '伝票No.',
        'カテゴリ',
        '材料名',
        '物件CD',
        '数量',
        '単位',
        '仕入額',
        '税率',
        '消費税',
        '支払額',
        '繰越残高',
    ] ;

}
