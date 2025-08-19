<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class VSummaryRemoteBranchProduct extends BaseReportModel
{
    // 数値を型変換(キャスト)
    protected $casts = [
        'qty'               => 'double',
        'cost'              => 'double',
        'total_cost'        => 'double',
        'sell_price'        => 'double',
        'total_sell_price'  => 'double',
    ];

    // 日付を型変換(キャスト)
    protected $dates = [
        'sales_complete_at',
        'complete_day',
    ];

    //画面およびcsvに表示しない検索用情報
    protected $hidden = [
        't_proejct_name',
        't_project_product_id',
        'm_branch_id',
        'm_branch_cd',
        'product_m_branch_id',
        'product_m_branch_cd',
        'm_customer_id',
        'm_customer_cd',
        'm_user_id',
    ] ;

    // CSVヘッダー
    public static $csvHeader = [
        '売上完了日',
        '請求予定日',
        '受注拠点',
        '生産拠点',
        '取引先名',
        '営業担当',
        '物件名',
        '商品名',
        '数量',
        '@原価',
        '原価金額',
        '@売価',
        '売価金額',
    ] ;

     // csvに含めないカラム
    public static $csvIgnore = [
        't_project_id',
    ] ;


}
