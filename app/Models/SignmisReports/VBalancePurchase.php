<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VBalancePurchase extends BaseReportModel
{
    // CSVヘッダー
    public static $csvHeader = [
        '科目コード',
        '勘定科目',
        '取引先コード',
        '取引先名',
        '前回残高',
        '支払日',
        '振込',
        '手数料',
        '現金',
        '小切手',
        '手形',
        '相殺',
        '値引・その他',
        '支払合計',
        '仕入額',
        '消費税',
        '仮消費税',
        '仕入合計',
        '残高',
    ] ;

}
