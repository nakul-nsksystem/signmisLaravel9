<?php

namespace App\Http\Controllers\Api;

use App\Models\TPInvoice;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\NotFoundErrorException;

class ExportTPInvoiceApiController extends BaseApiController
{
    protected $filters = array(
        // 拠点
        "m_branch_id" => array(
            "column" => "t_p_invoices.m_branch_id" ,
        ) ,
        // 仕入先
        "m_customer_id" => array(
            "column" => "t_p_invoices.supplier_m_customer_id" ,
        ) ,
        // 締日
        "closing_date" => array(
            "is_zero_enabled" => "true",
            "column" => "m_customers.closing_date" ,
        ) ,
        // 仕入id Min
        "id_min" => array(
            "operation" => ">=" ,
            "column" => "t_p_invoices.id" ,
        ) ,
        // 仕入id Max
        "id_max" => array(
            "operation" => "<=" ,
            "column" => "t_p_invoices.id" ,
        ) ,
        // 日付Min
        "day_min" => array(
            "operation" => ">=" ,
            "column" => "t_p_invoices.purchase_date" ,
        ) ,
        // 日付Max
        "day_max" => array(
            "operation" => "<=" ,
            "column" => "t_p_invoices.purchase_date" ,
        ) ,
        // データ出力済み
        "is_output" => array(
            "is_zero_enabled" => "true",
            "column" => "t_p_invoices.is_output" ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TPInvoice";
    }

    // 検索
    public function retrieve(Request $req)
    {
        return $this->getPurchases($req)->paginate(); 
    }

    // データ取得
    private function getPurchases(Request $req)
    {
        // 検索(retrieve + paginate処理)とCSV出力(export + cursor処理)でデータの取得方法を共有実装してます
        return 
            $this->getFiltered($req)
                ->selectRaw('   
                    0                                                                       AS slip_category,
                    t_p_invoices.purchase_date                                              AS purchase_date,
                    DATE_FORMAT(t_p_invoices.purchase_date, "%Y%m%d")                       AS purchase_date_export,
                    t_p_invoices.id                                                         AS id,
                    t_p_invoice_details.id                                                  AS detail_id,
                    m_customers.data_linkage_cd                                             AS data_linkage_cd,
                    IFNULL(m_customers.short_name, m_customers.name)                        AS customer_name,
                    t_projects.cd                                                           AS project_cd,
                    t_p_invoices.slip_memo                                                  AS remarks_column,
                    t_p_invoices.contact                                                    AS contact,
                    /* 記入用[*]か一般商品[S9000]かで商品CDを設定 */
                    IF(kv2.g_01 = 4, "*", "S9000")                                          AS product_cd,
                    multi_convert_string(t_p_invoice_details.material_name, 36)             AS product_name, 
                    t_p_invoice_details.qty                                                 AS qty, 
                    kv1.kv_name                                                             AS unit_m_kv_name, 
                    t_p_invoice_details.price                                               AS price, 
                    t_p_invoice_details.total_price                                         AS total_price, 
                    /* 1桁目か2桁目が[A]なら仕入科目:0 以外は仕入外科目:1 */
                    IF(SUBSTRING(m_customers.data_linkage_cd, 1, 2) REGEXP "A" = 1, 0, 1)   AS accounts_title_cd,
                    IFNULL(kv2.g_01, 0)                                                     AS classification_cd, 
                    multi_convert_string(IFNULL(t_projects.cd, ""), 20)                     AS slip_memo
                ')

                ->join('t_p_invoice_details', 't_p_invoices.id', '=', 't_p_invoice_details.t_p_invoice_id')
                ->join('m_customers', 't_p_invoices.supplier_m_customer_id', '=', 'm_customers.id')
                ->join('m_kvs AS kv1', 't_p_invoice_details.unit_m_kv_id', '=', 'kv1.id')
                ->join('m_kvs AS kv2', 't_p_invoice_details.purchase_m_kv_id', '=', 'kv2.id')
                ->leftjoin('t_projects', 't_projects.id', '=', 't_p_invoice_details.t_project_id')

                ->whereNull('t_p_invoice_details.deleted_at')
                
                ->orderBy('t_p_invoices.id')
                ->orderBy('t_p_invoice_details.order_no')
                ->orderBy('t_p_invoice_details.id')
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
                '仕入日',
                '伝票No',
                '仕入先CD',
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
                '科目区分', 
                'マスタ区分', 
                '備考',
            ], "\t");

            // データ取得：TSVで出力したいので第3引数にタブ[\t]を指定
            $models = $this->getPurchases($req);
            foreach ($models as $row) {
                fputcsv($stream, [
                    $row->slip_category,
                    $row->purchase_date_export,
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
                    $row->accounts_title_cd,
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

        return response()->streamDownload($callback, 'export_purchases.csv', $header);
    }

    private function updateOne(int $id) 
    {
        // データ出力済みに更新
        $model = $this->model::find($id);
        $model->is_output = 1;
        $model->update();
    }    

}
