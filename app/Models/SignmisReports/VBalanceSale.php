<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VBalanceSale extends BaseReportModel
{
    // CSVヘッダー
    public static $csvHeader = [
        '取引先コード',
        '連携コード',
        '取引先名',
        '担当者名',
        '前回残高',
        '入金日',
        '振込',
        '手数料',
        '現金',
        '小切手',
        '手形',
        '相殺',
        '値引・その他',
        '入金合計',
        '売上額',
        '消費税',
        '仮消費税',
        '売上合計',
        '残高',
    ] ;

}
