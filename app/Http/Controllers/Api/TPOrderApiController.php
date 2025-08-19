<?php

namespace App\Http\Controllers\Api;
use App\Models\TPOrderDetail;
use App\Models\TPOrder;
use App\Models\MCustomer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;  
use App\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\TPOrderMail;

use App\Exceptions\DbSaveErrorException ; 
use App\Exceptions\NotFoundErrorException ; 

use App\Http\Controllers\Api\Traits\MailSendTrait;
use App\Http\Controllers\Api\Traits\LocalFileStorageTrait;


class TPOrderApiController extends BaseApiController
{ 
    use MailSendTrait ;
    use LocalFileStorageTrait ;

    protected $filters = array(

        "supplier_m_customer_id" => array() ,
        "m_branch_id" => array() ,
        "m_user_id" => array() , 
        
        "is_t_project_order" => array(
            "operation" => "ignore"
        ) ,

        // 発注日     
        "order_date_from" => array(
            "operation" => ">="  ,
            "column" => "order_date" ,
        ) ,
        "order_date_to" => array(
            "operation" => "<="  ,
            "column" => "order_date" ,
        ) ,

        "is_same_invoice_price" => array(
            "operation" => "ignore"
        ) ,
        //資材区分、名称、金額
        "t_p_order_details" => array(
            "operation" => "table" ,
            "id" => array() ,
            "relation_name" => "TPOrderDetails" ,
            "material_name" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" ,            
            ) ,
            "po_material_name" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" ,            
            ) ,
            "total_price_from" => array(
                "operation" => ">=" ,
                "column" => "total_price" ,
                "is_zero_enabled" => "true" ,

            ) ,
            "total_price_to" => array(
                "operation" => "<=" ,
                "column" => "total_price" ,
                "is_zero_enabled" => "true" ,
            ) ,
            "approved" => array() ,
            "t_project" => array(
                "operation" => "table" ,
                "relation_name" => "TProject" ,
                "name" => array(
                    "operation" => "like"  ,
                    "prefix" => "%" ,
                    "postfix" => "%" , 
                ),
            ) ,
            "m_material_detail" => array(
                "operation" => "table" ,
                "relation_name" => "MMaterialDetail" ,
                "m_material" => array(
                    "operation" => "table" ,
                    "relation_name" => "MMaterial" ,
                    "category_m_kv_id" => array(),
                    "is_stocked" => array(
                        "is_zero_enabled" => "true",

                    )
                ),
            ),
        ) ,
    ) ;


    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TPOrder" ;
        $this->detailModel = "App\Models\TPOrderDetail" ;
        $this->mCustomerModel = "App\Models\MCustomer" ;

        //$this->middleware('auth');
    }

    public function index()
    {

        $data = $this->model
            ::with('TPOrderDetails.UnitMKv')
            ->with('TPOrderDetails.MMaterialDetail.MMaterial.CategoryMKv')
            ->with('MBranch')
            ->with('SupplierMCustomer')
            ->with('MUser')
            ->get()->sortBy("id" ) ;
        
        return $data->values()->all();
    }

    public function retrieveWithDetails(Request $req)
    {

        $reqAll = $req->all() ; 
        $isTProject = $reqAll["is_t_project_order"] ?? null ;
        $isSameInvoiceP = $reqAll["is_same_invoice_price"] ?? null ;

        $res = $this->getFiltered($req)
            ->with([
                "MBranch:id,name,short_name",
                "SupplierMCustomer:id,name,short_name",
                "MUser:id,first_name,last_name,full_name",
                "TPOrderDetails",
                "TPOrderDetails.UnitMKv:id,kv_name",
                "TPOrderDetails.MMaterialDetail.MMaterial.CategoryMKv:id,kv_name",
                "TPOrderDetails.MMaterialDetail.MMaterial.SubCategoryMKv:id,kv_name",
                "TPOrderDetails.TProject:id,cd,name",
                // "TPOrderDetails.TProject.MCustomerPerson",
                "TPOrderDetails.TProjectProductProcesses:id,t_project_product_id",
                "TPOrderDetails.TProjectProductProcesses.TProjectProduct:id,t_project_id",
                "TPOrderDetails.TProjectProductProcesses.TProjectProduct.TProject:id,cd,name",
                "TPOrderDetails.TPInvoiceDetails:id,t_p_order_detail_id,t_p_invoice_id,price"
            ])
            //発注明細がないデータを取得しない
            ->whereHas('TPOrderDetails', function ($query) use ($isTProject,$isSameInvoiceP) {
                if($isTProject == 1) {
                    //物件紐づけがない発注
                    $query->whereNull("t_project_id")
                          ->doesntHave('TProjectProductProcesses');
                } elseif($isTProject == 2) {
                    //物件紐づけがある発注
                    $query->has("TProject") 
                          ->orHas('TProjectProductProcesses');
                }

                // if($isSameInvoiceP){
                //     $query->whereHas('TPInvoiceDetails' ,function($invoiceQ) use ($query) {
                //         // $invoiceQ->whereRaw('price != :param', ['param' => '`t_p_order_details`.`price`']) ;
                //         $invoiceQ->whereRaw('price != `t_p_order_details`.`price`') ;
                //     });
                // }
                
            })
            ->orderBy('order_date','desc') 
            ->orderBy('id','desc')  
            // ->toSql() ;
            ->paginate() ;
        // $sql = preg_replace_array('/\?/', $res->getBindings(), $res->toSql());
        // log::debug($sql) ;
        return $res; 
    }

    public function show($id)
    {
        $row = $this->model
            ::with('TPOrderDetails.UnitMKv')
            ->with('TPOrderDetails.MMaterialDetail.MMaterial.CategoryMKv')
            ->with('TPOrderDetails.TProject')
            ->with('TPOrderDetails.TPInvoiceDetails')
            ->with('TPOrderDetails.TProjectProductProcesses:id')
            // ->with('TProjectProductProcessOrderDetail')
            ->with('MBranch')
            ->with('SupplierMCustomer')
            ->with('MUser')
            ->find($id) ;

            if (! $row) {
                $error = new NotFoundErrorException() ; 
                throw $error ; 
            }
    
            return $row ; 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $tPurchases = $request->all() ;
        $returnArr = array() ;

        DB::beginTransaction();
        foreach ($tPurchases as $tPurchase){
           
            $tPurchaseRow = new $this->model() ;
            
            $rtn = $this->saveRow($tPurchase , $tPurchaseRow)   ;
            $returnArr[] = $rtn ;

            if ( $rtn == false )
            {
                DB::rollBack() ;
                abort(404);
            }
            
        }

        
        DB::commit();

        return $returnArr ;

    }

    
    protected function saveRow($tPurchase , $row )
    {   
        //メール発注を使用するか？発注更新でメールを使用しないケースあり
        $unuseMailFlg = isset($tPurchase["is_unuse_mail"]);

        //物件からの発注か？
        $isTProject = isset($tPurchase["isTProject"]);
        $isTIvt = isset($tPurchase["isTIvt"]);
        
        
        $row->fillIncChildren($tPurchase) ; 
        
        try {
            $row->push();
            $tempcd = $row["id"] ; 
            $tPurchase['order_cd'] = $tempcd ;          

            if ( !$unuseMailFlg ) {

                $supEMail = null ;

                if($isTProject || $isTIvt) {
                    //物件からの発注は仕入先情報が十分に取得できていない為、idから取得する
                    $supMCus = $this->mCustomerModel::where("id","=",$tPurchase["supplier_m_customer_id"])->first(['id','po_email']) ;
                    $supEMail = $supMCus["po_email"] ?? null ;

                } else {
                    $supEMail = $tPurchase["supplier_m_customer"]['po_email'] ;
                    
                }

                $savedTPOrder = $this->show($row["id"]) ;
                
                
                $mailInfos =  $this->setSendTo($supEMail,8010201) ;
                $mails = $mailInfos["mails"] ;
                $warnings = $mailInfos["warnings"] ;

                $savedTPOrder["isNew"] = !isset($tPurchase["id"]) ;
                        
                $tpMail = new TPOrderMail($savedTPOrder) ;

                $mBranchMail = $this->systemMailValid($savedTPOrder->MBranch['t_p_order_email'],8010201) ;
                
                Mail::to($mails["to"])->cc($mBranchMail)->bcc($mails["cc"])->send($tpMail) ;
                
                //メール送信時のエラー
                if( count(Mail::failures()) > 0 ) {
                    foreach(Mail::failures() as $email) {
                        log::debug($email) ;
                    }
                    return false ; 
                }
            } 

        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException) ; 
            return false ; 
        }
        // catch (\Exception $e) { 
        //     //DB::rollBack();
        //     Log::debug($e) ; 
        //     return false ; 
        // }

        $savedTPOrder = $this->show($row["id"]) ;
        $savedTPOrder["warnings"] = $warnings ?? [] ;

        return $savedTPOrder ;

    } 

    public function update(Request $request , $id)
    {
        $row = $this->model::find($id) ;

        DB::beginTransaction();

        //$tPurchaseRow = new $this->model() ;
        $data = $request->all() ; 
        $rtn = $this->saveRow($data , $row ) ; 

        
        if (! $row) {

            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        DB::commit();

        

        return $rtn;
        
        //$updated= $this->model::where("id" , $id)->get() ;
        

        //return $updated ;
        

    }

    //発注書レイアウトデバッグ用
    public function createPO($id, $view = null)
    {
        $det = $this->detailModel
            ::where("t_p_order_id",$id)
            ->with("MMaterialDetail")
            ->with("UnitMKv")
            ->with("TProject")
            ->get() ;
        

        $head = $this->model
            ::with('MBranch')
            ->with('SupplierMCustomer')
            ->with('MUser')
            ->find($id) ;

        $isTProject = false ;

        foreach($det as $PODetail){
            if($PODetail["t_project_id"]){
                $isTProject = true ;
            }
        }
        $head["order_cd"] = $head["id"] ;

        $header = json_decode(json_encode($head) ,true) ; 
        $details = json_decode(json_encode($det) ,true) ; 

        //発注書ごとに物件は1件なので共通物件を設定
        if($isTProject) {
            $header["common_t_project"] = $details[0]["t_project"] ;
        }


        $reportLogo = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.report_logo'),true) ;

        
        if (isset($view)) {
            $isView = true ;
            // View(blade)で開く
            return view('t_p_order.po', compact('header','details','isView','isTProject','reportLogo')) ;

        } else {
            // Laravel-SnappyPDFを利用
            $po = \SnappyPDF::loadView('t_p_order.po', compact('header','details','isTProject','reportLogo')) ;
            return $po->stream() ;
        }
    }


}
