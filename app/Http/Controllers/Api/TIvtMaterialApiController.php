<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DateTime;


use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Exceptions\DbSaveErrorException ; 
use App\Exceptions\NotFoundErrorException ; 

use App\Http\Controllers\Api\TIvtMaterialCompleteApiController;

use App\Consts\TIvtMaterialConst;
use Illuminate\Pagination\Paginator;

class TIvtMaterialApiController extends BaseApiController
{ 

    protected $filters = array(

        //発注明細
        "ivt_material_name" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" , 
        ) ,

        "m_material_detail_id" => array(
            "column" => "t_ivt_materials.m_material_id" ,
        ),
        "m_material_id" => array(
            "column" => "m_material_details.m_material_id" ,
        ),

        
        //発注
        "supplier_m_customer_id" => array(
            "column" => "t_ivt_materials.supplier_m_customer_id" ,
        ) ,
            
        "m_branch_id" => array(
            "column" => "t_ivt_materials.m_branch_id" ,
        ) ,

        "conducted_at" => array(
            "operation" => "<="  ,
            "column" => "t_ivt_materials.conducted_at" ,
        ) ,

        //材料
        "category_m_kv_id" => array(
            "column" => "m_materials.category_m_kv_id" ,
        ),
        "sub_category_m_kv_id" => array(
            "column" => "m_materials.sub_category_m_kv_id" ,
        ),

    ) ;


    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TIvtMaterial" ;
        $this->completeModel = "App\Models\TIvtMaterialComplete" ;
        $this->invoiceModel = "App\Models\TPInvoiceDetail" ;

    }

    public function query4Show() {
        $row = $this->model::with("TIvtMaterialComplete")
            ->selectRaw(
                "
                t_ivt_materials.id,
                t_ivt_materials.ivt_m_kv_id,
                t_ivt_materials.m_material_detail_id,
                t_ivt_materials.m_branch_id,
                t_ivt_materials.supplier_m_customer_id,
                t_ivt_materials.lot_no ,
                t_ivt_materials.qty ,
                t_ivt_materials.price ,
                t_ivt_materials.total_price ,
                t_ivt_materials.conducted_at ,
                t_p_invoice_details.id AS t_p_invoice_detail_id,
                t_p_invoice_details.t_p_invoice_id AS t_p_invoice_id,
                t_p_order_details.id AS t_p_order_detail_id ,
                t_p_order_details.t_p_order_id AS t_p_order_id ,
                IFNULL(m_customers.short_name, m_customers.name) AS supplier_m_customer_name ,
                m_material_details.m_material_id,
                m_material_details.unit_price AS m_material_unit_price,
                m_material_details.unit_m_kv_id AS po_unit_m_kv_id ,
                m_material_details.ivt_div_m_kv_id AS material_ivt_div_m_kv_id ,
                CONCAT(IFNULL(m_materials.display_name, m_materials.name), m_material_details.detail_name) AS ivt_material_name
                "
            )
            // 材料系
            ->join('m_material_details', function ($join) {
                $join->on('t_ivt_materials.m_material_detail_id', '=', 'm_material_details.id')
                    ->whereNull('m_material_details.deleted_at');
            })
            ->join('m_materials', function ($join) {
                $join->on('m_material_details.m_material_id', '=', 'm_materials.id')
                    ->whereNull('m_materials.deleted_at');
            })
            // 取引先
            ->join('m_customers', function ($join) {
                $join->on('t_ivt_materials.supplier_m_customer_id', '=', 'm_customers.id')
                    ->whereNull('m_customers.deleted_at');
            })
            // 仕入明細
            ->leftJoin('t_p_invoice_details', function ($join) {
                $join->on('t_ivt_materials.t_p_invoice_detail_id', '=', 't_p_invoice_details.id')
                    ->whereNull('t_p_invoice_details.deleted_at');
            })
            // 発注明細
            ->leftJoin('t_p_order_details', function ($join) {
                $join->on('t_ivt_materials.t_p_order_detail_id', '=', 't_p_order_details.id')
                    ->whereNull('t_p_order_details.deleted_at');
            }) ;

        return $row ;
    }

    public function show($id)
    {
        $row = $this->query4Show()->find($id);

        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        return $row;
    }
    public function showByQr($id)
    {
        $row = $this->query4Show()
            ->where('t_p_order_details.id',$id)
            //入庫のみ
            ->where('t_ivt_materials.ivt_m_kv_id',5010010)
            ->first();

        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        return $row;
    }


    //在庫集計データ検索
    public function retrieve(Request $req)
    {
        $request = $req->all() ; 

        //指定日(デフォルト今日)のデータも対象に含めたいので時間を23:59:59に固定
        if(!isset($request['conducted_at'])) {
            $dateTime = new DateTime();
        } 
        else {
            $dateTime = new DateTime($request['conducted_at']);            
        }
        $dateTime->setTime(23, 59, 59);
        $date = $dateTime->format('Y-m-d H:i:s');
        $param = [
            'conducted_at1'            => $date ,
            'conducted_at2'            => $date ,
            'm_branch_id'             => $request['m_branch_id']            == 0  ? null : $request['m_branch_id'] ,
            'supplier_m_customer_id'  => $request['supplier_m_customer_id'] == 0  ? null : $request['supplier_m_customer_id'] ,
            'ivt_material_name'       => empty($request['ivt_material_name'])     ? "%%" : '%'. $request['ivt_material_name'] . '%' ,
            'category_m_kv_id'        => $request['category_m_kv_id']       == 0  ? null : $request['category_m_kv_id'] ,
            'sub_category_m_kv_id'    => $request['sub_category_m_kv_id']   == 0  ? null : $request['sub_category_m_kv_id'] ,
        ] ;
        
        $res = DB::select(<<<__SQL_EOT__
            WITH
                q_ivt_completes_newest AS (
                    SELECT
                        comps.m_material_detail_id AS m_material_detail_id,
                        MAX(comps.completed_at)    AS completed_at 
                    FROM t_ivt_material_completes AS comps
                        WHERE comps.deleted_at   IS NULL                                                       
                          AND comps.completed_at <= :conducted_at1
                        GROUP BY comps.m_material_detail_id 
                ),
                q_ivt_completes AS (
                    SELECT
                        comps.m_material_detail_id AS m_material_detail_id,
                        comps.completed_at    AS completed_at ,
                        comps.qty                    AS qty ,
                        comps.total_price            AS total_price ,
                        comps.id
                    FROM t_ivt_material_completes AS comps
                        INNER JOIN q_ivt_completes_newest AS sub ON comps.m_material_detail_id = sub.m_material_detail_id AND comps.completed_at = sub.completed_at
                        WHERE comps.deleted_at   IS NULL 
                ),
                /* 本体 */
                q_body AS (
                    SELECT
                        ivts.m_material_detail_id,
                        ivts.m_branch_id,
                        ivts.supplier_m_customer_id,
                        IFNULL(MAX(q_ivt_completes.qty),0) + SUM(
                            CASE WHEN ivts.ivt_m_kv_id = 5010010 THEN ivts.qty 
                                 WHEN ivts.ivt_m_kv_id = 5010020 THEN ivts.qty * -1 
                                 ELSE 0 END
                        ) AS sum_qty,
                        IFNULL(MAX(q_ivt_completes.total_price),0) + SUM(
                            CASE WHEN ivts.ivt_m_kv_id = 5010010 THEN ivts.total_price 
                                 WHEN ivts.ivt_m_kv_id = 5010020 THEN ivts.total_price * -1 
                                 ELSE 0 END
                        ) AS sum_total_price,
                        MAX(IF(ivts.ivt_m_kv_id = 5010010 , ivts.conducted_at , NULL )) AS last_ivt_in_at,
                        MAX(IF(ivts.ivt_m_kv_id = 5010020 , ivts.conducted_at , NULL )) AS last_ivt_out_at,
                        MAX(q_ivt_completes.completed_at) AS last_completed_at,
                        m_material_details.m_material_id,
                        CONCAT(IFNULL(m_materials.display_name, m_materials.name), m_material_details.detail_name) AS ivt_material_name,
                        CONCAT(m_materials.name, m_material_details.detail_name)                                   AS po_material_name,
                        m_materials.category_m_kv_id,
                        m_materials.sub_category_m_kv_id,
                        m_material_details.width AS po_material_w ,
                        m_material_details.height AS po_material_h ,
                        m_material_details.unit_price AS po_unit_price ,
                        m_material_details.unit_m_kv_id AS po_unit_m_kv_id ,
                        m_material_details.ivt_div_m_kv_id AS material_ivt_div_m_kv_id 
                    FROM t_ivt_materials AS ivts
                    INNER JOIN m_material_details ON m_material_details.id                = ivts.m_material_detail_id AND m_material_details.deleted_at IS NULL
                    INNER JOIN m_materials        ON m_material_details.m_material_id     = m_materials.id AND m_materials.deleted_at IS NULL AND m_materials.is_stocked = 1
                     LEFT JOIN q_ivt_completes    ON q_ivt_completes.m_material_detail_id = ivts.m_material_detail_id
                    WHERE ivts.deleted_at IS NULL                                                       
                      AND ivts.conducted_at >= IFNULL(q_ivt_completes.completed_at , "")
                      AND ivts.conducted_at <= :conducted_at2
                    GROUP BY ivts.m_material_detail_id , ivts.m_branch_id ,ivts.supplier_m_customer_id
                )
            SELECT 
                q_body.m_material_detail_id                      AS id,
                q_body.m_material_detail_id                      AS m_material_detail_id,
                q_body.m_branch_id                               AS m_branch_id,
                q_body.supplier_m_customer_id                    AS supplier_m_customer_id,
                IFNULL(m_customers.short_name, m_customers.name) AS supplier_m_customer_name ,
                m_customers.tax_fraction_m_kv_id                 AS tax_fraction_m_kv_id,
                m_customers.account_m_kv_id                      AS account_m_kv_id,
                CAST(q_body.sum_qty AS SIGNED)                   AS sum_qty,
                CAST(q_body.sum_total_price AS SIGNED)           AS sum_total_price,
                q_body.m_material_id                             AS m_material_id,
                q_body.ivt_material_name                         AS ivt_material_name,
                q_body.po_material_name                          AS po_material_name,
                q_body.last_ivt_in_at                            AS last_ivt_in_at,
                q_body.last_ivt_out_at                           AS last_ivt_out_at,
                q_body.last_completed_at                         AS last_completed_at,
                q_body.po_material_w                             AS po_material_w,
                q_body.po_material_h                             AS po_material_h,
                q_body.po_unit_price                             AS po_unit_price,
                q_body.po_unit_m_kv_id                           AS po_unit_m_kv_id,
                q_body.material_ivt_div_m_kv_id                  AS material_ivt_div_m_kv_id  
            FROM q_body
            INNER JOIN m_customers ON q_body.supplier_m_customer_id   = m_customers.id AND m_customers.deleted_at IS NULL
            /* 条件未指定時は無条件で取得 */
            WHERE q_body.m_branch_id               = IFNULL(:m_branch_id              , q_body.m_branch_id            ) /* 拠点id   */
              AND q_body.supplier_m_customer_id    = IFNULL(:supplier_m_customer_id   , q_body.supplier_m_customer_id ) /* 取引先id */
              AND q_body.ivt_material_name      LIKE :ivt_material_name  
              AND q_body.category_m_kv_id          = IFNULL(:category_m_kv_id         , q_body.category_m_kv_id       ) 
              AND q_body.sub_category_m_kv_id      = IFNULL(:sub_category_m_kv_id     , q_body.sub_category_m_kv_id   ) 
        
            ORDER BY q_body.m_branch_id, q_body.m_material_id, q_body.m_material_detail_id
    
        __SQL_EOT__,$param);

        return collect($res)->paginate() ; 

        // return $res; 
    }

    //材料明細Idから在庫情報取得
    public function getByMMaterialDetailId( $mMatDsId , $date = null ){

        //指定日(デフォルト今日)のデータも対象に含めたいので時間を23:59:59に固定
        if(!isset($date)) {
            $dateTime = new DateTime();
        } 
        else {
            $dateTime = new DateTime($date);            
        }
        $dateTime->setTime(23, 59, 59);
        $date = $dateTime->format('Y-m-d H:i:s');

        //最新締データ取得
        $complete = $this->completeModel::where('m_material_detail_id', $mMatDsId)
            ->where('completed_at','<=',$date)
            ->latest('completed_at')
            ->first();

        $res = $this->model::with('TIvtMaterialComplete')
            ->selectRaw(
                "
                t_ivt_materials.id ,
                t_ivt_materials.ivt_m_kv_id ,
                t_ivt_materials.m_material_detail_id ,
                t_ivt_materials.m_branch_id ,
                t_ivt_materials.supplier_m_customer_id ,
                t_ivt_materials.qty ,
                t_ivt_materials.price ,
                t_ivt_materials.total_price ,
                t_ivt_materials.lot_no ,
                t_ivt_materials.conducted_at ,
                t_p_invoice_details.id AS t_p_invoice_detail_id ,
                t_p_invoice_details.t_p_invoice_id AS t_p_invoice_id ,
                t_p_order_details.id AS t_p_order_detail_id ,
                t_p_order_details.t_p_order_id AS t_p_order_id ,
                IFNULL(m_customers.short_name, m_customers.name) AS supplier_m_customer_name ,
                m_material_details.m_material_id ,
                m_material_details.unit_price AS m_material_unit_price ,
                m_material_details.unit_m_kv_id AS po_unit_m_kv_id ,
                m_material_details.ivt_div_m_kv_id AS material_ivt_div_m_kv_id ,
                CONCAT(IFNULL(m_materials.display_name, m_materials.name), m_material_details.detail_name) AS ivt_material_name
                "
            )
            // 材料系
            ->join('m_material_details', function ($join) {
                $join->on('t_ivt_materials.m_material_detail_id', '=', 'm_material_details.id')
                    ->whereNull('m_material_details.deleted_at');
            })
            ->join('m_materials', function ($join) {
                $join->on('m_material_details.m_material_id', '=', 'm_materials.id')
                    ->whereNull('m_materials.deleted_at');
            })
            // 取引先
            ->join('m_customers', function ($join) {
                $join->on('t_ivt_materials.supplier_m_customer_id', '=', 'm_customers.id')
                    ->whereNull('m_customers.deleted_at');
            })
            // 仕入明細
            ->leftJoin('t_p_invoice_details', function ($join) {
                $join->on('t_ivt_materials.t_p_invoice_detail_id', '=', 't_p_invoice_details.id')
                    ->whereNull('t_p_invoice_details.deleted_at');
            })
            // 発注明細
            ->leftJoin('t_p_order_details', function ($join) {
                $join->on('t_ivt_materials.t_p_order_detail_id', '=', 't_p_order_details.id')
                    ->whereNull('t_p_order_details.deleted_at');
            })
            ->where( function($q) use ($mMatDsId,$date,$complete){
                $condition = array(
                    array('t_ivt_materials.m_material_detail_id',$mMatDsId),
                    array('t_ivt_materials.conducted_at','<=', $date),
                ) ;
                if(isset($complete->completed_at)) {
                    array_push($condition,array('t_ivt_materials.conducted_at' ,'>=',$complete->completed_at)) ;
                }
                $q->where($condition) ;
            })
            
            ->orderBy('t_ivt_materials.conducted_at') 
            // ->paginate() ;
            ->get() ;
        // ->toSql() ;
        // log::debug($res) ;

        return $res ;
    }

    public function saveMultiRow(Request $request)
    {   

        $req = $request->all() ;

        $res = array() ;
        foreach($req as $r) {
            $row = new $this->model;

            if(isset($r["id"])) {
                $row = $this->model::find($r["id"]);
            }
            $row->fill($r) ;
        
            try {
                $row->save();
                
                if(!empty($r["t_ivt_material_complete"])){
                    $this->saveCompleteRow($r["t_ivt_material_complete"],$row->id) ;
                }

                if(!isset($row->deleted_at)) {
                    $res[] = $this->show($row->id) ;
                }


            } catch (\PDOException $e) {
                $this->throwDbError($e) ; 
            }
        }

        return $res ; 
    }
    protected function saveRow($request, $row)
    {   
        $req = $request->all() ;
        $row->fill($req) ;
        
        try {
            $row->save();
            
            if(!empty($req["t_ivt_material_complete"])){
                $this->saveCompleteRow($req["t_ivt_material_complete"],$row->id) ;
            }

        } catch (\PDOException $e) {
             $this->throwDbError($e) ; 
        }

        return $this->show($row->id) ;; 
    }

    protected function saveCompleteRow($req,$parentId){
        $ivtComModel = null ;
        if(!isset($req["id"])) {
            $req["t_ivt_material_id"] = $parentId ; 
            $ivtComModel = new $this->completeModel ; 
        } 
        else {
            $ivtComModel = $this->completeModel::find($req['id']) ;
        }  
        
        $ivtComModel->fill($req) ;
        try {
            $ivtComModel->save();
        } catch (\PDOException $e) {
            $this->throwDbError($e) ; 
        }

    }

        /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $row = $this->model::find($id) ;

        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        $deleted = $row->delete() ;

        $ivtComModel = $this->completeModel
            ::where("t_ivt_material_id",$row->id)
            ->whereNull('deleted_at')
            ->first() ;
            
        if(!empty($ivtComModel)) $ivtComModel->delete() ;

        return compact('deleted') ;
    }



    //在庫 最終仕入原価法の時（未使用）
    public function getLastPrice(Request $req){
        $reqAll = $req->all() ;
        // log::debug($reqAll) ;
        $res = $this->invoiceModel::selectRaw(
            "t_p_invoice_details.id,
                t_p_invoice_details.t_p_invoice_id,
                t_p_invoice_details.m_material_detail_id,
                t_p_invoice_details.unit_m_kv_id,
                t_p_invoice_details.qty,
                t_p_invoice_details.price,
                t_p_invoice_details.total_price,
                t_p_invoices.purchase_date
                "
        )
        ->join('t_p_invoices', 't_p_invoice_details.t_p_invoice_id', '=', 't_p_invoices.id')
        ->where("t_p_invoice_details.m_material_detail_id" ,$reqAll["m_material_detail_id"])
        ->where("t_p_invoices.purchase_date" , '<=' ,$reqAll["date"])
        ->orderByRaw("t_p_invoices.purchase_date desc")
        ->first() ;


        return $res ;


    }


    //QRラベル　アウトプット用設定　DB? 
    protected $opSetting = [
        
        //タックラベルシート名称（DB化するときに入れる）
        'sheet_name' => '' ,
        //用紙サイズ
        'sheet_size' => 'A4' ,
        //用紙横余白 mm
        'sheet_offset_w' => 19.3 ,
        //用紙縦余白 mm
        'sheet_offset_h' => 21.5 ,
        
        //ラベル面数
        'label_qty' => 24 ,
        //ラベル列数
        'label_col' => 2 ,
        //ラベル横サイズ mm
        'label_w' => 83.8 ,
        //ラベル縦サイズ mm
        'label_h' => 21.2 ,
        //ラベル横余白 mm
        'label_offset_w' => 3.8 ,
        //ラベル縦余白 mm
        'label_offset_h' => 0 ,
    ] ;

    
    public function createQrLabel(Request $req, $view = null) {

        $reqAll = $req->all() ;
        $data = $reqAll["exList"] ;

        //オフセット空データ
        $empRow = array(
            "name" => "" ,
            "label_no" => "" ,
            "material_cd" => "" ,
        ) ;
        // log::debug($data) ;
        
        $counter = 1 ;
        $dateTime = new DateTime();

        foreach($data as &$d) {

            $mId = $d["m_material_detail_id"] ?? "" ;
            $oId = $d["t_p_order_detail_id"] ?? "" ;
            $labelNo = $dateTime->format('ymdHis') . "-" . "$counter" ;
            $d["label_no"] = $labelNo ;

            $qrdata = "$mId" .';'. "$oId" .';' . "$labelNo"  ;
            
            $d["qr"] = base64_encode(\QrCode::generate($qrdata)) ;
            
            $counter ++ ;
        }

        for($i = 0; $i < $reqAll["offset"]; $i++) {
            array_unshift($data,$empRow) ;
        }

        $setting = $this->opSetting ;

        $isView = isset($view) ;  
        if($isView) {
            $html = view('t_ivt_materials.qr_label', compact('data','setting','isView'))->render();
            return response()->json(['html' => $html]);
        }
        else {
            // Laravel-SnappyPDFを利用
            $pdf = \SnappyPDF::loadView('t_ivt_materials.qr_label', compact('data','setting')) 
            ->setOption('margin-top'   , $setting["sheet_offset_h"] . 'mm') 
            ->setOption('margin-right' , $setting["sheet_offset_w"] . 'mm') 
            ->setOption('margin-left'  , $setting["sheet_offset_w"] . 'mm') 
            ->setOption('margin-bottom', $setting["sheet_offset_h"] . 'mm') ;

            return $pdf->stream('test.pdf') ;
        }    
        
    }
    



}


