<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException ; 
use App\Exceptions\NotFoundErrorException ; 

use Illuminate\Support\Facades\Mail;
use App\Mail\TProjectDeliveryMail;
use App\Http\Controllers\QRCodeController;

use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Api\Traits\MailSendTrait;


use DateTime;


class TProjectDeliveryApiController extends BaseApiController
{

    use MailSendTrait ;


    private $tProjectColumns = ":id,name,cd,m_customer_id,m_branch_id,is_order_lost,delivery_mail_to,customer_user_name,ss_order_cd" ;
    private $mCustomerColumns = ":id,name,short_name,m_branch_id,email" ;
    private $mCustomerColumns4Copy = ":id,name,short_name,zip,prefectures,address1,address2,tel,price_fraction_m_kv_id,m_branch_id,po_email";


    protected $filters = array(

        "delivery_m_customer_id" => array() ,
        "delivery_owner_m_customer_id" => array() ,
        "delivery_m_kv_id" => array() ,
        "m_branch_id" => array() ,

        "m_branch_id_4_sum" => array(
            "operation" => "ignore"
        ) ,

        "is_reuse" => array() ,

        "delivery_customer_name" => array(
            "operation" => "is not null"  ,
            "column" => "delivery_customer_name" ,
        ) ,
        "delivery_owner_name" => array(
            "operation" => "is not null"  ,
            "column" => "delivery_owner_name" ,
        ) ,

        // 発注日     
        "delivery_at_from" => array(
            "operation" => ">="  ,
            "column" => "delivery_at" ,
        ) ,
        "delivery_at_to" => array(
            "operation" => "<="  ,
            "column" => "delivery_at" ,
        ) ,
        "delivery_completed_at" => array(
            "operation" => "ignore"  ,
        ) ,

        "t_project" => array(
            "operation" => "table" ,
            "relation_name" => "TProject" ,
            "name" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" , 
            ),
            "cd" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" , 
            ),
        ) ,
        "t_project_products" => array(
            "operation" => "table" ,
            "relation_name" => "TProjectProducts" ,
            "name" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" , 
            ),
        ) ,
        "m_tags" => array(
            "operation" => "ignore"
        ) ,
    ) ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TProjectDelivery" ;
    }

    
    public function retrieve(Request $req)
    {
        $reqAll = $req->all() ; 
        $tags = null ;
        $status = null ;

        if(isset($reqAll["delivery_completed_at"])){
            $status = $reqAll["delivery_completed_at"] ;
        }

        if (!empty($reqAll["m_tags"])) {
            $tags = $reqAll["m_tags"] ; 
        }

        $res = $this->getFiltered($req)
                    ->with([
                        'DeliveryMKv' ,
                        'DeliveryMCustomer' . $this->mCustomerColumns,
                        'DeliveryOwnerMCustomer'. $this->mCustomerColumns, 
                        'TProject' . $this->tProjectColumns ,
                        'TProject.MCustomer'. $this->mCustomerColumns ,
                        // 'TProject.MCustomerPerson' ,
                        'TProject.SalesMUser:id,email,last_name,first_name' ,
                        'TProjectProducts:id,name,m_branch_id,is_partical_delivery,qty',
                        'MTags' ,
                    ]); 

        
        //完了しているかどうか
        if(! is_null($status)) {

            if($status) {

                $res->whereNotNull("delivery_completed_at");
            
            } else {
                $res->whereNull("delivery_completed_at");

            }
        }

        //タグフィルタ
        if (! is_null($tags)) {
            $res->where(function( $query ) use ($tags) {
                $query->whereHas('MTags', function ( $subquery ) use ($tags) {
                    $subquery->whereIn('m_tags.id', $tags );
                }) ; 
            }) ; 
        }
        
        $res->where(function( $query ) {
            $query->whereHas('TProject', function ( $subquery ) {
                $subquery->whereNotNull('ordered_at');
            }) ; 
        }) ; 



        $result = $res->paginate()  ;

        // foreach($result as $row) {
        //     $row->append(['display_customer_user_name','display_delivery_mail']) ;
        // }

        // return $res->get() ; 
        return $result ;
    }
    public function searchByYm($year ,$month)
    {
        $dateBase = DateTime::createFromFormat('Y-m-d', "${year}-${month}-01");
        $dateFrom = $dateBase->format('Y/m/d') ;
        $dateTo = $dateBase->format('Y/m/t') ;

        $fields = [
            'id','t_project_id' ,'delivery_at' ,"construction_start_time" ,"construction_end_time" ,"is_night_work" ,"is_holiday_work" ,
            "delivery_customer_name" ,"delivery_customer_address" , "memo"
        ] ; 


        $rows = $this->model::with("TProjectConstructionUsers") 
            ->with("TProject" . $this->tProjectColumns) 
            ->with("DeliveryMKv") 
            ->whereBetween("delivery_at" , [$dateFrom , $dateTo ])
            ->whereHas('DeliveryMKv', function($query) { 
                $query->where('g_01', 'construction') ; 
            })
            ->whereHas('TProject', function($query) { 
                $query->where('is_order_lost', 0) ; 
            }) 
            ->get($fields) ; 
        

        return $rows;
    }
    public function show($id)
    {
        $row = $this->model
            ::with('DeliveryMKv')
            ->with('DeliveryMCustomer'. $this->mCustomerColumns)
            ->with('DeliveryOwnerMCustomer'. $this->mCustomerColumns)
            ->with('TProject'. $this->tProjectColumns)
            ->with('TProject.MCustomer'. $this->mCustomerColumns)
            // ->with('TProject.MCustomerPerson')
            ->with('TProject.SalesMUser:id,email,last_name,first_name')
            ->with('MTags')
            ->with('TProjectProducts.TProjectDeliveries:id')

            ->find($id) ;
        
            if (! $row) {
                $error = new NotFoundErrorException() ; 
                throw $error ; 
            }
            
        // $row->append(['display_customer_user_name','display_delivery_mail']) ;
    
        return $row ; 
    }
    protected function saveByList($request, $row)
    {                
        $row->fill($request) ;
        
        try {
            $row->save();
        } catch (\PDOException $e) {
             $this->throwDbError($e) ; 
        }
        $saved = $this->show($row["id"]) ;

        return $saved ; 
    }

    public function showWithResults($id)
    {
        $row = $this->model
                    // ::with("TProjectConstructionUsers" . $this->constructionUserColumns )
                    ::with("TProjectConstructionUsers" )
                    ->with("TProjectConstructionUsers.MUser")
                    ->with("TProjectConstructionUsers.OutSourceMCustomer")
                    ->with("TProjectConstructionResults")
                    ->with("TProjectConstructionResults.TProjectConstructionResultUsers")
                    ->with("TProjectConstructionResults.TProjectConstructionResultUsers.MUser")
                    ->with("TProjectConstructionResults.TProjectConstructionResultUsers.OutSourceMCustomer")
                    ->with("TProjectConstructionResults.TProjectConstructionResultPictures")
                    ->with("TProjectConstructionResults.TProjectConstructionResultCosts")
                    ->with("TProject:id,m_branch_id,cd,name")
                    ->with("DeliveryMKv") 
                    ->whereHas('DeliveryMKv', function($query) { 
                        $query->where('g_01', 'construction') ; 
                    }) 
                    ->find($id) ;

        if (! $row)
        {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }
        return $row ;
    }

    //納品予定リスト更新
    public function changeByDeliveryList(Request $request)
    {   

        $tProjectDeliveries = $request->all() ;

        $returnArr = array() ;

        DB::beginTransaction();
        foreach ($tProjectDeliveries as $tProjectDelivery){
            
            $id = $tProjectDelivery["id"] ;
            if(!$id) continue ;

            $tProjectDeliveryRow = $this->model::find($id) ;
            
            $rtn = $this->saveByList($tProjectDelivery , $tProjectDeliveryRow)   ;
            $returnArr[] = $rtn ;

            // $mailRtn = $this->sendMail($tProjectDelivery) ;

            if ( $rtn == false  )
            {
                DB::rollBack() ;
                abort(404);
            }
            
        }

        DB::commit();

        return $returnArr ;        

    }

    public function sendMail(Request $req) {
        // $tProjectDelivery = $request->all() ;
        $req["mail_sent_at"] = date("Y-m-d H:i:s") ;
        try {
            $tProjectDelivery = $this->update($req,$req["id"]) ;
            $tProjectDelivery["mailed_m_user"] = $req["mailed_m_user"] ;
            $tProjectDelivery["m_branch"] = $req["m_branch"] ;
            
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException) ; 

            return ;
        }

        try {

            $mailInfos =  $this->setSendTo($tProjectDelivery->TProject["delivery_mail_to"],8010202) ;
            // log::debug($tProjectDelivery->TProject["delivery_mail_to"]) ;
            $mails = $mailInfos["mails"] ;
            $warnings = $mailInfos["warnings"] ;
            
            $mailClass = new TProjectDeliveryMail($tProjectDelivery) ;
            $salesMUserMail = $this->systemMailValid($tProjectDelivery->TProject->SalesMUser["email"],8010202) ;
            $mBranchMail = $this->systemMailValid($tProjectDelivery["m_branch"]['t_p_order_email'],8010202) ;
            // log::debug($salesMUserMail);
            // log::debug($mBranchMail);

            $isSsOrder = isset($tProjectDelivery->TProject['ss_order_cd']) ;
            
            if($isSsOrder) {
                Mail::mailer('smtp2')->to($mails["to"])->cc($mBranchMail)->bcc([$mails["cc"],$salesMUserMail])->send($mailClass) ;

            } else {
                //cc ログインユーザーと物件営業担当
                Mail::to($mails["to"])->cc($mBranchMail)->bcc([$mails["cc"],$salesMUserMail])->send($mailClass) ;
            
            }
            
            //メール送信時のエラー
            if( count(Mail::failures()) > 0 ) {
                foreach(Mail::failures() as $email) {
                    log::debug($email) ;
                }
                return false ; 
            }

            $tProjectDelivery["warnings"] = $warnings ?? [] ;

            return $tProjectDelivery ;

        } catch(\Exception $e) {
            Log::debug($e) ; 
            return false ;

        }
        

    }


    //納品集計
    public function retrieve4Summary(Request $req) {
        
        $reqAll = $req->all() ;
        // \DB::enableQueryLog();
        $MProcessCats = DB::table("m_process_categories")->select('id')->where('is_main_material','1')->get()->toArray() ;
        $catIds = array();
        foreach ($MProcessCats as $object) {
            $catIds[] = $object->id;
        }
        //modelから取得すると遅すぎるため変更
        $delivery = DB::table("t_project_deliveries")
            ->selectRaw(
                '
                t_project_deliveries.id, 
                t_project_deliveries.t_project_id AS t_project_id, 
                m_kvs.kv_name AS delivery_m_kv_name ,
                m_branches.short_name AS m_branch_name ,
                t_project_deliveries.delivery_at,
                t_project_deliveries.delivery_completed_at,
                m_customers.name AS m_customer_name ,
                t_projects.name AS t_project_name,
                JSON_ARRAYAGG(JSON_OBJECT(
                    "id", t_project_products.id ,
                    "name", t_project_products.name ,
                    "qty", t_project_products.qty ,
                    "is_needed_labels_for_fire_prevention", t_project_products.is_needed_labels_for_fire_prevention ,
                    "fire_prev_label_cd" , m_materials.fire_prev_label_cd
                )) AS t_project_products ,
                SUM(t_project_products.total_sqm) AS total_sqm,
                SUM(t_project_products.total_weight) AS total_weight
                '
            )
            // 物件
            ->join('t_projects', function ($join) {
                $join->on('t_project_deliveries.t_project_id', '=', 't_projects.id')
                ->whereNull('t_projects.deleted_at');
            })
            // 取引先
            ->join('m_customers', function ($join) {
                $join->on('t_projects.m_customer_id', '=', 'm_customers.id')
                     ->whereNull('m_customers.deleted_at');
            })
            ->join('m_kvs', 't_project_deliveries.delivery_m_kv_id', '=', 'm_kvs.id')
            ->join('m_branches', function ($join) {
                $join->on(DB::raw('IFNULL(t_project_deliveries.m_branch_id,t_projects.m_branch_id)'), '=', 'm_branches.id')
                     ->whereNull('m_branches.deleted_at');
            })
            ->leftJoin('t_project_construction_results', function ($join) {
                $join->on('t_project_construction_results.t_project_delivery_id', '=', 't_project_deliveries.id')
                     ->whereNull('t_project_construction_results.deleted_at');
            })
            ->leftJoin('t_project_delivery_product_links', 't_project_delivery_product_links.t_project_delivery_id', '=', 't_project_deliveries.id')

            ->leftJoin('t_project_products', function ($join) {
                $join->on('t_project_products.id' , '=' ,'t_project_delivery_product_links.t_project_product_id' ) 
                    ->whereNull('t_project_products.deleted_at');
            })
            ->leftJoin('t_project_product_processes', function ($join) use($catIds){
                $join->on('t_project_products.id' , '=' ,'t_project_product_processes.t_project_product_id' ) 
                    ->whereIn('t_project_product_processes.m_process_category_id',$catIds) 
                    ->whereNull('t_project_product_processes.deleted_at') ;
            })
            ->leftJoin('m_materials', function ($join){
                $join->on('m_materials.id' , '=' ,'t_project_product_processes.m_material_id_01' ) 
                    ->whereNull('m_materials.deleted_at') ;
            })
            //完了済のみを集計
            ->where(function($q) {
                $q->whereNotNull("t_project_deliveries.delivery_completed_at")
                    ->orWhereNotNull("t_project_construction_results.id") ;
            })
            //filter条件
            ->where(function($q) use($reqAll) {
                if(!empty($reqAll["m_branch_id_4_sum"])){
                    $q->whereRaw('IFNULL(t_project_deliveries.m_branch_id,t_projects.m_branch_id) = ?', [$reqAll["m_branch_id_4_sum"]]) ;
                }
                if(!empty($reqAll["delivery_at_from"])) {
                    $q->where('t_project_deliveries.delivery_at','>=',$reqAll["delivery_at_from"]) ;
                }
                if(!empty($reqAll["delivery_at_to"])) {
                    $q->where('t_project_deliveries.delivery_at','<=',$reqAll["delivery_at_to"]) ;
                }
                if(!empty($reqAll["delivery_m_kv_id"])) {
                    $q->where('t_project_deliveries.delivery_m_kv_id',$reqAll["delivery_m_kv_id"]) ;
                }
            })
            ->whereNull('t_project_deliveries.deleted_at')
            ->groupBy(['t_project_deliveries.id','m_branches.short_name'])
            ->orderBy('t_project_deliveries.delivery_at') 
            ->get()
            ->map(function ($row) {
                $productJson = array_filter(json_decode($row->t_project_products,true) , fn($v) => isset($v["id"]) )  ;
                $row->t_project_products = $productJson ;
                return $row;
            });

        // log::debug(\DB::getQueryLog());
        // log::debug($delivery->count());

        return $delivery ;
        
    }

    /**現場施工指示書 */
    public function createConstructionDirection($tProjectId, $view = null)
    {
        $qr = new QRCodeController ;

        $header = $this->model
            ::where("t_project_id",$tProjectId)
            ->with("TProject" . $this->tProjectColumns)
            ->with("DeliveryMKv")
            ->with("TProjectConstructionUsers.MUser")
            ->with("TProjectConstructionUsers.OutSourceMCustomer")
            ->whereHas('DeliveryMKv', function($query) { 
                $query->where('g_01', 'construction') ; 
            }) 
            ->get() ;

        //QRコード
        foreach($header as $construct){

            $construct->qrcode = $qr->generateQRCode4TProjectConstruction($construct->id) ;
            // $construct->t_project_cd = $construct->TProject->cd ;
        
        }

        
        $tProjectCd = $header[0]->TProject->cd ;

        $tProjectQr = $qr->generateQRCode4TProject($tProjectId) ;
        // $test = json_decode(json_encode($header), true) ;
        // log::debug($test) ;
        $date4filename = date("YmdHis");

        if (isset($view)) {
            $isView = true ;
            // View(blade)で開く
            return view('t_projects.construction_direction.construction_direction', compact('header',"tProjectQr",'isView')) ;

        } else {
            // Laravel-SnappyPDFを利用
            $constructionDirection = \SnappyPDF::loadView('t_projects.construction_direction.construction_direction', compact('header',"tProjectQr")) ;
            return $constructionDirection->stream('現場指示書-' .  $tProjectCd . '@' . $date4filename .'.pdf') ;
        }
    }


    public function getByIds4copy(Request $req){
        $reqData = $req->validate([
            'ids'     => 'array|nullable',            
            'prodIds' => 'array|nullable',            
        ]);
        $ids     = $reqData["ids"] ; 
        $prodIds = $reqData["prodIds"] ; 

        $res = $this->model::
            with([  
                    "TProjectProducts" 
                        => function($q) use($prodIds) { 
                            $q->select(
                                't_project_products.id',
                                't_project_products.name',
                                't_project_products.m_branch_id',
                                't_project_products.is_partical_delivery',
                                't_project_products.qty'
                            )->whereIn("t_project_products.id",$prodIds);
                        } ,
                    "DeliveryMKv" ,
                    "MTags" ,
                    "DeliveryMCustomer" . $this->mCustomerColumns4Copy ,
                    "DeliveryOwnerMCustomer" . $this->mCustomerColumns4Copy,
                    "TProjectConstructionUsers" ,
                    "TProjectConstructionUsers.MUser",
                    "TProjectConstructionUsers.OutSourceMCustomer" . $this->mCustomerColumns4Copy,                      
                ])
                ->whereIn("id" ,  $ids)
                ->get() ; 
        
        return $res ; 

        
    }

    public function completeByQr($id) {
        $row = $this->model::find($id) ;

        $row->delivery_completed_at = date("Y-m-d H:i:s");
        $row->delivery_completed_m_user_id = Auth::user()->id ;
        try {
            $row->save();
        } catch (\PDOException $e) {
             $this->throwDbError($e) ; 
        }

        return $this->show($row->id)  ;
    }
    
}
