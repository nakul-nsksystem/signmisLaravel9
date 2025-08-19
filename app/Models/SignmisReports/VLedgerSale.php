<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VLedgerSale extends BaseReportModel
{


    public static $csvIgnore = [
        'tax_rate',
    ] ;
    // CSVヘッダー
    public static $csvHeader = [
        '取引日',
        '伝票No.',
        'カテゴリ',
        '商品名',
        '物件CD',
        '数量',
        '単位',
        '売上額',
        // '税率',
        '消費税',
        '入金額',
        '繰越残高',
    ] ;

}
