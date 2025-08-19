<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VSummaryProject extends BaseReportModel
{
    // CSVヘッダー
    public static $csvHeader = [
        '拠点',
        '営業担当',
        '取引先CD',
        '取引先名',
        '物件CD',
        '物件名',
        '商品数',
        '受注日',
        '初回売上日',
        '売上完了日',
        '請求予定日',
        '金額',
        '粗利',
        '利益率',
    ] ;

    // csvに含めないカラム
    public static $csvIgnore = [
        't_project_id',
    ] ;

}
