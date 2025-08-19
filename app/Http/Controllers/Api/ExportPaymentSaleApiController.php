<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\NotFoundErrorException;
use App\Http\Controllers\Api\Traits\CsvExportTrait;
use App\Http\Controllers\Api\Traits\ExportPaymentTrait;

class ExportPaymentSaleApiController extends BaseApiController
{

    use CsvExportTrait ;
    use ExportPaymentTrait;

    protected $dealingMKvId = 1010001 ;

    protected $filters = array(
        // 拠点
        "m_branch_id" => array(
            "column" => "t_complete_details.m_branch_id" ,
        ) ,
        // 取引先
        "m_customer_id" => array(
            "column" => "t_complete_details.m_customer_id" ,
        ) ,
        // 売上id Min
        "id_min" => array(
            "operation" => ">=" ,
            "column" => "t_complete_details.t_complete_id" ,
        ) ,
        // 売上id Max
        "id_max" => array(
            "operation" => "<=" ,
            "column" => "t_complete_details.t_complete_id" ,
        ) ,
        // 日付Min
        "day_min" => array(
            "operation" => ">=" ,
            "column" => "t_complete_details.payment_day" ,
        ) ,
        // 日付Max
        "day_max" => array(
            "operation" => "<=" ,
            "column" => "t_complete_details.payment_day" ,
        ) ,

        // データ出力済み
        "is_csv_output" => array(
            "is_zero_enabled" => "true",
            "column" => "t_complete_details.is_csv_output" ,
        ) ,

    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TCompleteDetail";
    }

    // 検索
    public function retrieve(Request $req)
    {
        return $this->getQuery($req)->paginate(); 
    }

    // データ取得
    private function getQuery(Request $req)
    {
        // 検索(retrieve + paginate処理)とCSV出力(export + cursor処理)でデータの取得方法を共有実装してます
        return 
            $this->getFiltered($req)
                ->selectRaw('
                    t_complete_details.payment_day                          AS payment_day,
                    DATE_FORMAT(t_complete_details.payment_day, "%Y%m%d")   AS ex_payment_day,
                    t_complete_details.m_branch_id                          AS m_branch_id,
                    t_complete_details.id                                   AS id,
                    t_complete_details.t_complete_id                        AS t_complete_id,
                    t_complete_details.payment_m_kv_id                      AS payment_m_kv_id,
                    kv2.kv_name                                             AS payment_m_kv_name,
                    m_customers.id                                          AS m_customer_id,
                    IFNULL(m_customers.short_name, m_customers.name)        AS customer_name,
                    DATE_FORMAT(t_complete_details.payment_day, "%y%m%d")   AS ex_bill_due_day,
                    t_complete_details.bill_no                              AS bill_no,
                    t_complete_details.payment_price                        AS price
                ')

                ->join('m_customers', 't_complete_details.m_customer_id', '=', 'm_customers.id')
                ->join('m_kvs AS kv2', 't_complete_details.payment_m_kv_id', '=', 'kv2.id')
                ->where('t_complete_details.dealing_m_kv_id',$this->dealingMKvId) 
                ->where('t_complete_details.t_complete_id' , '<>' , 0 )
                ->orderBy('t_complete_details.t_complete_id')
                ->orderBy('t_complete_details.id')
                ->get() ;

    }

    // エクスポート
    public function export(Request $req)
    {

        $data = [] ;
        $custmerId = 0 ;
        $lastDate = "" ;
        foreach($this->getQuery($req) as $row) {
            //借方科目コード cd1
            //貸方科目コード cd2
            //貸方部門コード cd3

            
            if($row->m_branch_id == 1) {
                $cd1 = 131 ;
                $cd2 = 153 ;
                $cd3 = "001" ;
            }
            elseif($row->m_branch_id == 2) {
                $cd1 = 133 ;
                $cd2 = 154 ;
                $cd3 = "002" ;
            }
            elseif($row->m_branch_id == 3) {
                $cd1 = 131 ;
                $cd2 = 155 ;
                $cd3 = "003" ;
            }

            //入金区分手数料の時
            if($row->payment_m_kv_id == 1150008) $cd1 = 754 ;
            //入金区分値引きの時
            if($row->payment_m_kv_id == 1150006) $cd1 = 521 ;
            
            $date = $row->ex_payment_day ;

            //取引先が一致するものは、日付ごとに会計では同じ伝票にまとめる 
            if($row->m_customer_id !== $custmerId && $row->ex_payment_day == $lastDate) $date = '*' . $date ;

            $memo = "伝票No" . $row->t_complete_id . " " .  $row->customer_name ; 

            $data[] = [
                $date ,
                "" ,
                "000",
                $cd1,
                "",
                "00",
                $row->price,
                0,
                $cd3,
                $cd2,
                "",
                "00",
                $row->price,
                0,
                $memo,
                $row->ex_bill_due_day,
                $row->bill_no
            ] ;

            $custmerId = $row->m_customer_id ;
            $lastDate = $row->ex_payment_day ;

            $this->updateOne($row->id) ;

        }

        $response = $this->createCsv($data, $this->pcaHeader);

        return $response;

    }


}
