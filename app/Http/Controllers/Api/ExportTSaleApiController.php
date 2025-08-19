<?php

namespace App\Http\Controllers\Api;

use App\Models\TSale;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\NotFoundErrorException;

class ExportTSaleApiController extends BaseApiController
{
    protected $filters = array(
        // 拠点
        "m_branch_id" => array(
            "column" => "t_sales.m_branch_id" ,
        ) ,
        // 取引先
        "m_customer_id" => array(
            "column" => "t_sales.m_customer_id" ,
        ) ,
        // 締日
        "closing_date" => array(
            "is_zero_enabled" => "true",
            "column" => "m_customers.closing_date" ,
        ) ,
        // 売上id Min
        "id_min" => array(
            "operation" => ">=" ,
            "column" => "t_sales.id" ,
        ) ,
        // 売上id Max
        "id_max" => array(
            "operation" => "<=" ,
            "column" => "t_sales.id" ,
        ) ,
        // 日付Min
        "day_min" => array(
            "operation" => ">=" ,
            "column" => "t_sales.shipped_at" ,
        ) ,
        // 日付Max
        "day_max" => array(
            "operation" => "<=" ,
            "column" => "t_sales.shipped_at" ,
        ) ,
        // データ出力済み
        "is_output" => array(
            "is_zero_enabled" => "true",
            "column" => "t_sales.is_output" ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TSale";
    }

    // 検索
    public function retrieve(Request $req)
    {
        return $this->getSales($req)->paginate(); 
    }

    // データ取得
    private function getSales(Request $req)
    {
        // 検索(retrieve + paginate処理)とCSV出力(export + cursor処理)でデータの取得方法を共有実装してます
        return 
            $this->getFiltered($req)
                ->selectRaw('
                    0                                                       AS slip_category,
                    t_sales.shipped_at                                      AS shipped_at,
                    DATE_FORMAT(t_sales.shipped_at, "%Y%m%d")               AS shipped_at_export,
                    t_sales.id                                              AS id,
                    t_sale_details.id                                       AS detail_id,
                    m_customers.data_linkage_cd                             AS data_linkage_cd,
                    IFNULL(m_customers.short_name, m_customers.name)        AS customer_name,
                    t_projects.cd                                           AS project_cd,
                    t_sales.slip_memo                                       AS remarks_column,
                    t_sales.contact                                         AS contact,
                    /* 記入用[*]か一般商品[S9000]かで商品CDを設定 */
                    IF(kv2.g_01 = 4, "*", "S9000")                          AS product_cd,
                    multi_convert_string(t_sale_details.product_name, 36)   AS product_name, 
                    t_sale_details.qty                                      AS qty, 
                    kv1.kv_name                                             AS unit_m_kv_name, 
                    t_sale_details.price                                    AS price, 
                    t_sale_details.total_price                              AS total_price, 
                    IFNULL(kv2.g_01, 0)                                     AS classification_cd, 
                    multi_convert_string(IFNULL(t_projects.cd, ""), 20)     AS slip_memo
                ')

                ->join('t_sale_details', 't_sales.id', '=', 't_sale_details.t_sale_id')
                ->join('m_customers', 't_sales.m_customer_id', '=', 'm_customers.id')
                ->join('m_kvs AS kv1', 't_sale_details.unit_m_kv_id', '=', 'kv1.id')
                ->join('m_kvs AS kv2', 't_sale_details.ship_m_kv_id', '=', 'kv2.id')
                ->leftjoin('t_projects', 't_projects.id', '=', 't_sale_details.t_project_id')

                ->whereNull('t_sale_details.deleted_at')
                
                ->orderBy('t_sales.id')
                ->orderBy('t_sale_details.order_no')
                ->orderBy('t_sale_details.id')
                ->get() ;

        // Log::debug($query->toSql(), $query->getBindings()) ;
        // return $query->get() ;
    }

    // エクスポート
    public function export(Request $req)
    {
        // コールバック関数に１行ずつ書き込んでいく処理を記述
        $callback = function () use ($req) {
            // 出力バッファOpen
            $stream = fopen('php://output', 'w');
            
            // 文字コードはutf-8で実装(デフォルトなのでstream_filter_prependをoverrideしてません)
            // stream_filter_prepend($stream, 'convert.iconv.utf-8/utf-16le');

            // UTF-8 with BOM にする(Mac・WindowsでCSVファイルをExcelで開いた際の文字化け回避用BOM)
            fwrite($stream, "\xEF\xBB\xBF");

            // ヘッダー行：TSVで出力したいので第3引数にタブ[\t]を指定
            fputcsv($stream, [
                '伝票区分',
                '売上日',
                '伝票No',
                '取引先CD',
                '物件CD',
                '摘要',
                '客先担当者',
                '商品CD',
                '商品名', 
                '数量', 
                '単位', 
                '単価', 
                '金額', 
                '税区分', 
                '税込区分', 
                'マスタ区分', 
                '備考',
            ], "\t");

            // データ取得：TSVで出力したいので第3引数にタブ[\t]を指定
            $models = $this->getSales($req);
            foreach ($models as $row) {
                fputcsv($stream, [
                    $row->slip_category,
                    $row->shipped_at_export,
                    $row->id,
                    $row->data_linkage_cd,
                    $row->project_cd,
                    $row->remarks_column,
                    $row->contact,
                    $row->product_cd,
                    $row->product_name, 
                    $row->qty, 
                    $row->unit_m_kv_name, 
                    $row->price, 
                    $row->total_price, 
                    "1",    // 0:非課税 1:課税10%
                    "0",
                    $row->classification_cd,
                    $row->slip_memo,
                ], "\t");

                // データ出力済みに更新
                $this->updateOne($row->id) ;
            }

            fclose($stream);
        };
        
        // HTTPヘッダー情報
        $header = [
            'Content-type' => 'text/csv',   
        ];

        return response()->streamDownload($callback, 'export_sales.csv', $header);
    }

    private function updateOne(int $id) 
    {
        // データ出力済みに更新
        $model = $this->model::find($id);
        $model->is_output = 1;
        $model->update();
    }    

}
