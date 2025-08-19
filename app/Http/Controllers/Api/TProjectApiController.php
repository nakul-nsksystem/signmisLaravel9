<?php

namespace App\Http\Controllers\Api;

use App\Models\TProject;
use App\Models\TProjectProduct;
use App\Models\TProjectProductEstimateDetail;
use App\Models\TProjectFile;
use App\Models\TProjectMail;
use App\Models\TProjectDelivery;
use App\Models\TProjectConstructionUser;
use App\Models\MNumberingRule ;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\NotFoundErrorException ;
use App\Models\BaseModel;
use App\Models\TProjectProductProcess;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Dropbox\Client as DropboxClient;

use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Api\Traits\LocalFileStorageTrait;

use App\Http\Controllers\QRCodeController;


class TProjectApiController extends BaseApiController
{   
    
    protected $productModel = "" ;

    private $tProjectColums = ["id" ,"name"] ;
    //private $tProjectConstructionsColumns = ":id,t_project_id,construction_at,start_time,end_time,construction_to,construction_address,memo" ;
    private $tProjectConstructionsColumns = "" ;
    //private $tProjectConstructionUsersColumns = ":id,t_project_construction_id,m_user_id,out_source_m_kv_id,out_source_m_branch_id,num_of_out_source_people" ;
    private $tProjectConstructionUsersColumns = "" ;
    private $tProjectDeliveryCustomersColumns = ":id,name" ;
    private $tPOrderDsInvoiceDsColumns = ":t_p_invoice_details.id" ;

    private $mCustomerColumns = ":id,name,short_name,zip,prefectures,address1,address2,tel,price_fraction_m_kv_id,m_branch_id,po_email,closing_date";

    protected $filters = array(
        "cd" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,
            "column"    => "t_projects.cd" ,
        ) ,
        "name" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,
            "column" => "t_projects.name" ,
        ) ,
        "customer_user_name" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,
            "column" => "t_projects.customer_user_name" ,
        ) ,
        "sales_m_user_id" => array(
            "column" => "t_projects.sales_m_user_id" ,
        ) ,
        "m_branch_id" => array(
            "column" => "t_projects.m_branch_id" ,
        ) ,

        "profit_per_from" => array(
            "operation" => ">="  ,
            "column" => "profit_per" ,
        ) ,
        "profit_per_to" => array(
            "operation" => "<="  ,
            "column" => "profit_per" ,
        ) ,
        // 受注日
        "ordered_at_from" => array(
            "operation" => ">="  ,
            "column" => "ordered_at" ,
        ) ,
        "ordered_at_to" => array(
            "operation" => "<="  ,
            "column" => "ordered_at" ,
        ) ,
        "m_customer" => array(
            "operation" => "table" ,
            "relation_name" => "MCustomer" ,
            "name" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" ,
            ) ,
            "zip" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" ,
            ) ,
            "closing_date" => array() ,
            
        ) ,
        "t_project_products" => array(
            "operation" => "table" ,
            "relation_name" => "TProjectProducts" ,
            "name" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" ,
            ) ,
            "cost_from" => array(
                "operation" => ">="  ,
                "column" => "cost" ,
            ) ,
            "cost_to" => array(
                "operation" => "<="  ,
                "column" => "cost" ,
            ) ,
            "m_product_category_id" => array() ,
            "operator_m_user_id" => array() ,
            "t_project_product_processes" => array(
                "operation" => "table" ,
                "relation_name" => "TProjectProductProcesses" ,
                "total_cost" => array(
                    "operation" => ">="  ,
                ) ,
                "m_branch_id" => array()
            ) ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TProject" ;
        $this->productModel = "App\Models\TProjectProduct" ;
        $this->estimateDetailModel = "App\Models\TProjectProductEstimateDetail" ;
        $this->numberingRuleModel = MNumberingRule::where('category_m_kv_id', 1700002)->first() ;
    }

    public function index()
    {
        $data = $this->model::all();
        return $data;
    }

    public function retrieve(Request $req)
    {
        $stateMKvId = $req["state_m_kv_id"] ;         
        unset($req["state_m_kv_id"] ) ; 

        $query = $this->getFiltered($req)
            ->with([
                "TProjectProducts:id,t_project_id,name,m_product_category_id,cost" ,
                "TProjectProducts.TProjectProductProcesses:id,t_project_product_id,m_process_category_id" ,
                ])

            ->selectRaw("t_projects.id,
                         t_projects.cd,
                         t_projects.name,
                         m_users.full_name AS m_users_full_name,
                         t_projects.m_branch_id,
                         t_projects.m_customer_id,
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                         m_customers.kana,
                         t_projects.customer_user_name,
                         t_projects.sales_completed_at,
                         t_projects.is_order_lost,
                         t_projects.ordered_at,
                         t_projects.profit_per,
                         t_projects.est_approved_at,
                         t_projects.inc_children_updated_at,
                         t_projects.internal_quotation_memo,
                         t_projects.memo,
                         MAX(t_project_deliveries.delivery_at) AS max_delivery_at"
                         )

            ->join('m_customers', 't_projects.m_customer_id', '=', 'm_customers.id')
            ->join('m_users', 't_projects.sales_m_user_id', '=', 'm_users.id')
            ->leftJoin('t_project_deliveries' , function($q){
                $q->on('t_projects.id','=','t_project_deliveries.t_project_id')
                  ->whereNull("t_project_deliveries.deleted_at" ) ;
            })
            ->active() ; 

        if ( ! empty($stateMKvId) && $stateMKvId !== 0 ){
            switch ($stateMKvId) {
                case 3610001 :  // 案件
                    $query->where("is_order_lost" , false ) ; 
                    $query->whereNull("ordered_at" ) ; 
                    $query->whereNull("sales_completed_at" ) ; 

                    break ; 

                case 3610002 :  // 受注済み
                    $query->whereNotNull("ordered_at" ) ; 
                    $query->whereNull("sales_completed_at" ) ; 
                    break ; 
                case 3610003 :  // 売上済み
                    $query->whereNotNull("sales_completed_at" ) ; 
                    break ; 

                case 3610004 :  // 失注
                    $query->where("is_order_lost" , true ) ; 
                    break ; 
            }

        }  

        $res = $query
            ->orderByRaw($this->orderByClause($req, 'inc_children_updated_at DESC'))
            ->groupBy('t_projects.id')
            ->paginate() ;

        return $res ;
    }

    /**
     * 商品検索用
     */
    public function retrieve4TProducts(Request $req){
        $reqData = $req->validate([
            'm_branch_id' => 'integer|nullable',            
            'name' => 'string|nullable',
            'product_name' => 'string|nullable',            
            'm_customer_name' => 'string|nullable',
        ]);

        $mBranchId        = $reqData["m_branch_id"] ; 
        $name             = $reqData["name"] ; 
        $productName      = $reqData["product_name"] ; 
        $mCustomerName    = $reqData["m_customer_name"] ; 



        $query = $this->model::with([
                "TProjectProducts" 
                    => function($query) 
                    use ($productName) {

                        $query->where("name" , "like" , "%$productName%")  ;
                    },
                "TProjectProducts.TProjectProductProcesses" 
                    => function($query){
                        $query->enabled() ; 
                        $query->select(TProjectProductProcess::$productionColumns)  ; 
                    },
                "TProjectProducts.TProjectProductSeparates" ,
                "TProjectProducts.TProjectProductBoardlayouts" ,
                "TProjectProducts.TProjectProductBoardlayouts.MMaterialDetail.UnitMKv:id,kv_name" ,
                "TProjectProducts.TProjectProductBoardlayouts.MMaterialDetail.MMaterial:id,supplier_m_customer_id,name" ,
                "TProjectProducts.TProjectFile" , 
                "TProjectProducts.MProductCategory" , 
                "TProjectProducts.TProjectDeliveries:id,delivery_at,delivery_time,delivery_m_kv_id" , 
                "TProjectProducts.TProjectDeliveries.DeliveryMKv:id,kv_name" , 
                "MCustomer:id,name,short_name,zip,address1,address2,tel" ,
            ])            
            ->active(); 


            // 該当の商品がない場合、物件自体を出さない
        $query->whereExists(function ($query) 
            use ($productName ) {
            $query->select(DB::raw(1))
                ->from('t_project_products')
                ->whereColumn('t_project_products.t_project_id', 't_projects.id'); 

            // 商品名
            if ( ! empty($productName)){ 
                $query->where("t_project_products.name" ,"like" ,"%$productName%") ; 
            } 

        }) ; 
                

        if ( ! empty($mBranchId) && $mBranchId !== 0 ){
            $query->where("m_branch_id" , $mBranchId) ; 
        }
        
        if ( ! empty($name)  ){
            $query->where("name" , 'like' , "%$name%") ; 
        }

        if ( ! empty($mCustomerName)  ){
            $query->whereHas("MCustomer" ,function($query) use ($mCustomerName){
                $query->where("name" , 'like' , "%$mCustomerName%") ; 
            }) ; 
        }

        if ( ! empty($productName)  ){
            $query->whereHas("TProjectProducts" ,function($query) use ($productName){
                $query->where("name" , 'like' , "%$productName%") ; 
            }) ; 
        }


        $res = $query
                ->orderByRaw($this->orderByClause($req, 'inc_children_updated_at DESC'))
                ->get() ; 

        foreach ($res as $tProject) {
            $this->loadProductMaterials($tProject) ; 
            $this->loadCalcedDeliveryDate($tProject) ;
            $this->loadMinDelAndMaxArrival($tProject) ; 
            $this->loadBase64StorageThumbnail($tProject) ; 
            

        }
    
        
    
        

        // Log::debug($res) ; 
        return $res; 

        

    }

    /**
     * main/lamiのマテリアルロード
     */
    protected function loadProductMaterials($tProject){
        if (isset($tProject->TProjectProducts)) {
            $tProject->TProjectProducts->sortBy('order_no') ;
            foreach ($tProject->TProjectProducts as $tProduct) {
                if ( count($tProduct->TProjectProductProcesses) > 0 ){
                    $tProduct->append('main_material_with_relations') ;
                    $tProduct["main_material"] = $tProduct["main_material_with_relations"] ; 

                    // protected $hidden = ['main_material_with_relations' ,'lami_material_with_relations'];

                    $tProduct->append('lami_material_with_relations') ;
                    $tProduct["lami_material"] = $tProduct["lami_material_with_relations"] ; 
                    $tProduct->setHidden(['main_material_with_relations' ,'lami_material_with_relations']) ; 

                }
            }
        }        

    }

    
    /**
     * 納期のロード
     */
    protected function loadCalcedDeliveryDate($tProject){
        if (isset($tProject->TProjectProducts)) {
            foreach ($tProject->TProjectProducts as $tProduct) {
                // $tProduct->TProject() ; 
                $tProduct->append('calced_delivery_date') ;
            }
        }        

    }

    /**
     * 最短納期・最遅着日のロード
     * 
     */
    protected function loadMinDelAndMaxArrival($tProject) {
        $tProject->append(["min_delivery","max_arrival"]) ;
        if (isset($tProject->TProjectProducts)) {
            foreach($tProject->TProjectProducts as $tProduct){
                $tProduct->TProject->append(["min_delivery","max_arrival"]) ;
            }
        }

    }

    
    /**
     * 物件サムネイルのロード
     * 
     */
    protected function loadBase64StorageThumbnail($tProject) {
        if (isset($tProject->TProjectFiles)) {
            foreach($tProject->TProjectFiles as $tFile){
                $tFile->append("base64_thumbnail") ;
            }
        }

    }
    

    /**
     * 生産管理用
     */
    public function retrieve4Production(Request $req){
        $reqData = $req->validate([
            'm_branch_id' => 'integer|nullable',            
            'operator_m_user_id' => 'integer|nullable',
            'm_product_categories' => 'array|nullable' , 
            'delivery_date_from' => 'date|nullable',
            'delivery_date_to' => 'date|nullable',
        ]);

        $mBranchId        = $reqData["m_branch_id"] ; 
        $operatorMUserId  = $reqData["operator_m_user_id"] ; 
        $mProductCategories  = $reqData["m_product_categories"] ; 
        $deliveryFrom = $reqData["delivery_date_from"] ; 
        $deliveryTo   = $reqData["delivery_date_to"] ;   
        
        $deliveryDateCName = 
            "IFNULL(
                delivery_date , 
                (select MIN(t_project_deliveries.delivery_at) from t_project_deliveries where `t_project_deliveries`.`t_project_id` = `t_project_products`.`t_project_id` ) 
            )" ; 



        $query = $this->model::with([
                "TProjectProducts" 
                    => function($query) 
                    use ($mBranchId ,$operatorMUserId ,$mProductCategories , $deliveryFrom , $deliveryTo ,$deliveryDateCName) {

                        if ( count($mProductCategories) > 0){                            
                            $query->whereIn("m_product_category_id" ,$mProductCategories) ; 
                        }

                        if ( ! empty($mBranchId) && $mBranchId !== 0 ){
                            $query->whereExists(function ($query) use ($mBranchId) {
                                $query->select(DB::raw(1))
                                    ->from('t_project_product_processes')
                                    ->whereColumn('t_project_product_processes.t_project_product_id', 't_project_products.id')
                                    ->where("t_project_product_processes.m_branch_id" , $mBranchId)  ;                                 

                            }) ; 
                        }


                        if ( ! empty($operatorMUserId) && $operatorMUserId !== 0 ){
                            $query->where("operator_m_user_id" , $operatorMUserId) ; 
                        }


                        // 納期
                        if (! empty($deliveryFrom ) || ! empty($deliveryTo )){
                            
                            // Log::debug("Noki -A") ; 
                            if ( ! empty($deliveryFrom ) && ! empty($deliveryTo ) ){
                                // from ~ to
                                // Log::debug("Noki -from ~ to") ; 
                                $query->whereRaw("{$deliveryDateCName} BETWEEN ? AND ? " ,[$deliveryFrom , $deliveryTo] );
                            }
                            else if ( empty($deliveryFrom )){
                                // ～ to
                                // Log::debug("Noki -~ to") ; 
                                $query->whereRaw("{$deliveryDateCName} <= ? " ,[$deliveryTo ] );
                            }
                            else if ( empty($deliveryTo )){
                                // from ~ 
                                // Log::debug("Noki -from ~ ") ; 
                                $query->whereRaw("{$deliveryDateCName} >= ? " ,[$deliveryFrom ] );
                            }                    

                        }                                         


                    },
                "TProjectProducts.TProjectProductProcesses" 
                    => function($query){
                        $query->enabled() ; 
                        $query->select(TProjectProductProcess::$productionColumns)  ; 
                    },
                "TProjectProducts.TProjectProductProcesses.TProductionProcessPlans" ,
                "TProjectProducts.TProjectProductSeparates" ,
                "TProjectProducts.TProjectProductBoardlayouts" ,
                "TProjectProducts.TProjectProductBoardlayouts.MMaterialDetail.UnitMKv:id,kv_name" ,
                "TProjectProducts.TProjectProductBoardlayouts.MMaterialDetail.MMaterial:id,supplier_m_customer_id,name" ,
                "TProjectProducts.MProductCategory" , 
                "TProjectProducts.TProjectFile" , 
                "TProjectProducts.TProjectDeliveries:id,delivery_at,delivery_time,delivery_m_kv_id" , 
                "TProjectProducts.TProjectDeliveries.DeliveryMKv:id,kv_name" , 
                "MCustomer:id,name,short_name,zip,address1,address2,tel" ,
            ])            
            ->active()
            ->ordered() ; 


            // 該当の商品がない場合、物件自体を出さない
            $query->whereExists(function ($query) 
                use ($mBranchId ,$operatorMUserId , $mProductCategories , $deliveryFrom , $deliveryTo ,$deliveryDateCName) {
                $query->select(DB::raw(1))
                    ->from('t_project_products')
                    ->whereColumn('t_project_products.t_project_id', 't_projects.id'); 

                // 商品カテゴリー
                if ( count($mProductCategories) > 0){ 
                    $query->whereIn("m_product_category_id" ,$mProductCategories) ; 
                } 

                // Operator 
                if ( ! empty($operatorMUserId) && $operatorMUserId !== 0 ){
                    $query->where("operator_m_user_id" , $operatorMUserId)  ; 
                } 

                // 拠点
                if ( ! empty($mBranchId) && $mBranchId !== 0 ){
                    $query->join('t_project_product_processes' ,"t_project_product_processes.t_project_product_id" , "=" , "t_project_products.id" )
                        ->where("t_project_product_processes.m_branch_id" , $mBranchId)  
                        ->where("t_project_product_processes.is_enabled" , 1)  ; 
                    
                }

                // 納期
                if (! empty($deliveryFrom ) || ! empty($deliveryTo )){
                    
                    // Log::debug("Noki -A") ; 
                    if ( ! empty($deliveryFrom ) && ! empty($deliveryTo ) ){
                        // from ~ to
                        // Log::debug("Noki -from ~ to") ; 
                        $query->whereRaw("{$deliveryDateCName} BETWEEN ? AND ? " ,[$deliveryFrom , $deliveryTo] );
                    }
                    else if ( empty($deliveryFrom )){
                        // ～ to
                        // Log::debug("Noki -~ to") ; 
                        $query->whereRaw("{$deliveryDateCName} <= ? " ,[$deliveryTo ] );
                    }
                    else if ( empty($deliveryTo )){
                        // from ~ 
                        // Log::debug("Noki -from ~ ") ; 
                        $query->whereRaw("{$deliveryDateCName} >= ? " ,[$deliveryFrom ] );
                    }                    

                }                 
                    
            }) ; 
    




        $res = $query->get() ; 

        foreach ($res as $tProject) {
            $this->loadProductMaterials($tProject) ;             
            $this->loadCalcedDeliveryDate($tProject) ;
            $this->loadMinDelAndMaxArrival($tProject) ; 
            $this->loadBase64StorageThumbnail($tProject) ; 

        }
    

        // Log::debug($res) ; 
        return $res; 

    }

    public function findBySmUserOptions(Request $req){
        $options = $req->all() ;
        $results = array();

        foreach ( $options as $option) {
            $params = json_decode($option["value"],true) ;

            $request = new Request;
            $request->merge($params);
            // $query = $this->retrieve($request,true);

            $stateMKvId = $request["state_m_kv_id"] ;         
            unset($request["state_m_kv_id"] ) ; 

            $query = $this->getFiltered($request)
                ->with([
                    "MCustomer:id,name,short_name" ,
                    "TProjectDeliveries:id,t_project_id,delivery_at,delivery_time,delivery_m_kv_id" ,
                ])
                ->where('type_flg',0)
                ->active() ; 


            if ( ! empty($stateMKvId) && $stateMKvId !== 0 ){
                switch ($stateMKvId) {
                    case 3610001 :  // 案件
                        $query->where("is_order_lost" , false ) ; 
                        $query->whereNull("ordered_at" ) ; 
                        $query->whereNull("sales_completed_at" ) ; 

                        break ; 

                    case 3610002 :  // 受注済み
                        $query->whereNotNull("ordered_at" ) ; 
                        $query->whereNull("sales_completed_at" ) ; 
                        break ; 
                    case 3610003 :  // 売上済み
                        $query->whereNotNull("sales_completed_at" ) ; 
                        break ; 

                    case 3610004 :  // 失注
                        $query->where("is_order_lost" , true ) ; 
                        break ; 
                }

            }
            //システム側で作成した営業担当のみのプリセットの場合 
            elseif($option["is_system_created"]) {
                // log::debug("is_system_created") ;
                $query->whereNull('sales_completed_at') ;
            }

            $res = $query
                ->orderByRaw($this->orderByClause($request, 'inc_children_updated_at DESC'))
                ->limit(10)
                ->get(['id','name','cd','ordered_at','sales_completed_at','is_order_lost','profit_per','m_customer_id','est_approved_at','internal_quotation_memo']) ;            
            
            foreach($res as $tProject) {
                $tProject->append("min_delivery") ; 
            }
            $res["option_name"] = $option["name"] ;
            $res["m_user_option_id"] = $option["id"] ;
            $res["order_no"] = $option["order_no"] ;
            array_push($results,$res);
        }

        return $results ;

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {   
        $row = $this->model::
            with([
                    // "UpdatedMUser" ,
                    "MCustomer" . $this->mCustomerColumns ,
                    // "MCustomerPerson" ,
                    "WhenOrderedTProject:id,ordered_t_project_id,type_flg" ,
                    "TProjectProducts" ,
                    "TProjectProducts.TProjectProductProcesses" ,
                    "TProjectProducts.TProjectProductProcesses.TProductionProcessPlans" ,
                    "TProjectProducts.TProjectProductProcesses.MProcessCategory" ,
                    "TProjectProducts.TProjectProductProcesses.MMaterial01.MMaterialDetails" ,
                    "TProjectProducts.TProjectProductProcesses.TPOrderDetails.TPOrder.SupplierMCustomer" . $this->mCustomerColumns ,
                    "TProjectProducts.TProjectProductProcesses.TPOrderDetails.TPOrder.MUser" ,
                    "TProjectProducts.TProjectProductProcesses.TPOrderDetails.UnitMKv:id,kv_name" ,
                    "TProjectProducts.TProjectProductProcesses.TPOrderDetails.TPInvoiceDetails:id,t_p_order_detail_id" ,
                    "TProjectProducts.TProjectProductSeparates" ,
                    "TProjectProducts.TProjectProductBoardlayouts" ,
                    "TProjectProducts.TProjectProductBoardlayouts.MMaterialDetail.UnitMKv:id,kv_name" ,
                    "TProjectProducts.TProjectProductBoardlayouts.MMaterialDetail.MMaterial:id,supplier_m_customer_id,name" ,
                    "TProjectProducts.TProjectProductBoardlayouts.MMaterialDetail.MMaterial.Supplier:id,name,short_name" ,
                    // "TProjectProducts.TProjectFile:id,uid" ,
                    "TProjectProducts.WarrantyMKv" ,
                    "TProjectProducts.SpecifiedMKv" ,
                    "TProjectProducts.MProductCategory.LinkProcessCategoriesPivot" ,
                    "TProjectProducts.TProjectProductEstimateDetails" ,
                    "TProjectProducts.TProjectDeliveries:id,delivery_at,delivery_time,delivery_m_kv_id" ,
                    "TProjectProducts.TProjectDeliveries.DeliveryMKv:id,kv_name" ,
                    "TProjectMails.TProjectFiles:id,t_project_mail_id" ,
                    "TProjectFiles.MTags" ,
                    "TProjectFiles.Children" ,
                    "TProjectDeliveries.TProject:id,name,m_customer_id,m_branch_id,customer_user_name" ,
                    "TProjectDeliveries.TProjectProducts:id,name,m_branch_id,is_partical_delivery,qty" ,
                    "TProjectDeliveries.DeliveryMKv" ,
                    "TProjectDeliveries.MTags" ,
                    "TProjectDeliveries.DeliveryMCustomer" . $this->mCustomerColumns ,
                    "TProjectDeliveries.DeliveryOwnerMCustomer" . $this->mCustomerColumns,
                    "TProjectDeliveries.TProjectConstructionUsers" ,
                    "TProjectDeliveries.TProjectConstructionUsers.MUser",
                    "TProjectDeliveries.TProjectConstructionUsers.OutSourceMCustomer" . $this->mCustomerColumns,
                    "TProjectDeliveries.TProjectConstructionUsers.TPOrderDetail.TPOrder.SupplierMCustomer" . $this->mCustomerColumns ,
                    "TProjectDeliveries.TProjectConstructionUsers.TPOrderDetail.TPOrder.MUser" ,
                    "TProjectDeliveries.TProjectConstructionUsers.TPOrderDetail.UnitMKv:id,kv_name" ,
                    "TProjectDeliveries.TProjectConstructionUsers.TPOrderDetail.TPInvoiceDetails:id,t_p_order_detail_id" ,
                    "TProjectDeliveries.TProjectConstructionResults",
                    "TProjectDeliveries.TProjectConstructionResults.TProjectConstructionResultUsers",
                    "TProjectDeliveries.TProjectConstructionResults.TProjectConstructionResultUsers.MUser",
                    "TProjectDeliveries.TProjectConstructionResults.TProjectConstructionResultUsers.OutSourceMCustomer" . $this->mCustomerColumns,
                    "TProjectDeliveries.TProjectConstructionResults.TProjectConstructionResultPictures",
                    "TProjectDeliveries.TProjectConstructionResults.TProjectConstructionResultCosts",
                    "TSaleDetails"
                ])
                ->active()
                ->find($id);
        
        $row->append(['last_saved_sell_price' ,'last_saved_cost']) ;
                
        $this->loadProductMaterials($row) ; 
        $this->loadCalcedDeliveryDate($row) ; 
        $this->loadMinDelAndMaxArrival($row) ; 
        $this->loadBase64StorageThumbnail($row) ; 
        
        if (!$row) {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }
        
        return $row ;
    }

    public function store(Request $request)
    {
        $row = new $this->model() ;
        $this->saveRow($request, $row) ;

        return $this->show($row["id"]) ;
    }

    public function update(Request $request, $id)
    {
        $row = $this->model::find($id);

        $this->saveRow($request, $row) ;

        if (! $row) {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }

        return $this->show($row["id"]) ;
    }

    protected function saveRow($request, $row)
    {   
        // log::debug($request) ;
        $orderedAt = $row["ordered_at"] ;
        $afterOrderedAt = $request["ordered_at"] ;
        $data = $request->all() ; 

        /**物件側から売上完了日を保存できなくする */
        unset($data["sales_completed_at"]) ;

        if(!empty($data['t_project_products'])) {
            foreach($data['t_project_products'] as &$product ) {
                unset($product["sales_completed_at"]) ;
            }
        }
        unset($product) ;

        //施工実績写真
        $this->saveConstructionPic($data) ;

        // 子供ごとSave
        // Log::debug("step1") ;
        $row->fillIncChildren($data) ;

        // Log::debug("step2") ;
        //$this->fillIncChildren($row , $data) ;

        DB::beginTransaction();
        try {

            if (!isset($row->id)) {
                // 自動コード採番
                $cd = $row["cd"] ;
                if (!$cd) {
                    // cdがnullの場合は採番する
                    $row["cd"] = $this->numberingRuleModel->numberinglogic($row) ;
                }
            }
            $row->push();
            $rowArray  = json_decode(json_encode($row), true) ;
            
            /**受注時のデータ保存および削除 */
            if (is_null($orderedAt) && ! is_null($afterOrderedAt)) {
                // 受注時
                // $copiedRow = $row->replicateWithChildren() ;
                // $whenOrderedRow = new $this->model() ;
                // $whenOrderedRow->fillIncChildren($copiedRow->toArray()) ;

                $whenOrderedRow = $row->replicateWithChildrenAsNew() ;

                // 不要リレーション削除
                // unset($whenOrderedRow["t_project_constructions"]) ;
                // unset($whenOrderedRow["t_project_files"]) ;
                // unset($whenOrderedRow["t_project_mails"]) ;
                // unset($whenOrderedRow["t_project_deliveries"]) ;
                // unset($whenOrderedRow["t_sale_details"]) ;
                unset($whenOrderedRow->TProjectConstructions) ;
                unset($whenOrderedRow->TProjectFiles) ;
                unset($whenOrderedRow->TProjectMails) ;
                unset($whenOrderedRow->TProjectDeliveries) ;
                unset($whenOrderedRow->TSalesDetails) ;


                $whenOrderedRow["type_flg"] = 1 ;
                $whenOrderedRow["cd"] .= "-O" ;

                if(isset($whenOrderedRow["ss_order_cd"])) {
                    $whenOrderedRow["ss_order_cd"] .= "-O" ;
                }
                if(isset($whenOrderedRow["ss_order_id"])) {
                    $whenOrderedRow["ss_order_id"] .= "-O" ;
                }
                $whenOrderedRow["ordered_t_project_id"] = $row["id"] ;
                $whenOrderedRow->push();
                //Log::debug("Ordered !") ;
            }

            if (! is_null($orderedAt) && is_null($afterOrderedAt)) {
                // 受注キャンセル
                if (! is_null($row->WhenOrderedTProject) ) {
                    //$orderRowId = $row->WhenOrderedTProject["id"] ;
                    $row->WhenOrderedTProject->forceDelete() ;
                }
            }

        } catch (\PDOException $pdoException) {
            //Log::debug($pdoException->errorInfo[1]) ;
            if ( $pdoException->errorInfo[1] == 1062 ) {
                // Error：1062 キーが重複
                // 自動採番しなおし
                $row["cd"] = $this->numberingRuleModel->numberinglogic($row) ;
            }

            $this->throwDbError($pdoException) ;
        } catch (\PDOException $e) {
            // Log::debug("TProjectApiController Exceptions on saveRow") ;
            $this->throwDbError($e) ;
            DB::rollBack();
        }

        //添付ファイル系
        try { 
            $projectFiles = $rowArray["t_project_files"] ;

            //新規保存のファイルを正保存リンクへの保存やタグリンクを行う
            $this->saveFiles($rowArray,$data) ;
            //ディレクトリの移動をしたファイルを移動する
            $this->moveFiles($data["t_project_files"]) ;

            //新規保存のメールファイルを正保存リンクへの保存
            $this->saveMails($rowArray) ;

            $projectProducts = $rowArray['t_project_products'] ;

            // log::debug($projectProducts) ;
            // t_project_productsと、未保存のt_project_fileの紐づけ処理
            foreach ($projectProducts as $product) {
                if (array_key_exists( 't_project_file_uid', $product)) {
                    $fileLinkUid = $product['t_project_file_uid'] ;
                    if (isset($fileLinkUid)) {

                        //uidが一致するファイルデータと商品データを取得
                        $idx = array_search($fileLinkUid , array_column($projectFiles , 'uid')) ;
                        $matchedFileRow = $projectFiles[$idx] ;

                        // log::debug($matchedFileRow) ;
                        $product['t_project_file_id'] = $matchedFileRow['id'] ;
                        $product['t_project_file_uid'] = null ;

                        $productRow = new TProjectProduct() ;
                        $updateProductRow = $productRow::find($product['id']);
                        $updateProductRow->fill($product) ;

                        try {
                            $updateProductRow->save();
                        } catch (\Exception $e) {
                            $this->throwDbError($e) ;
                        }
                    }
                }
            }
            
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException) ;
        }


        //納品紐づけ

        try {
            $constructionUsers = array() ;

            foreach($data["t_project_deliveries"] as $reqDel) {
                $this->linkDeliveryProduct($reqDel,$rowArray) ;
                $constructionUsers = array_merge($constructionUsers ,$reqDel["t_project_construction_users"]) ;

            }
            $this->saveConstructionUsers($constructionUsers,$rowArray["t_project_deliveries"]) ;  

        }  catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException) ;
            DB::rollBack();

        }

        DB::commit() ;
        //log::debug("finish") ;
    }

    protected function saveFiles($savedProject,$reqProject)
    {
        //reqest時のt_project_files
        $reqProjectFiles = $reqProject["t_project_files"] ;
        
        //保存済のt_project_files
        $projectFiles = $savedProject["t_project_files"] ;
        //保存済のt_project_mails
        $projectMails = $savedProject["t_project_mails"] ;
        
        //添付ファイルの正保存リンクに物件コードが必要
        $cd4SaveFiles = $savedProject["cd"] ;
        
        $dropbox = app()->make('dropboxClient') ;

        $folderCodeArr = array_unique(array_column($reqProjectFiles ,"folder_code")) ;
        
        // log::debug($folderCodeArr) ;
        if (!empty($folderCodeArr)) {

            foreach($folderCodeArr as $folderCode) {
                $allFilepath = "public/temporary/t_project/$folderCode" ;
                //本保存先にまとめて移動
                $dropbox->move($allFilepath,"public/attachment_files/t_project/$cd4SaveFiles/$folderCode") ;
            }
            
        }

        foreach ($projectFiles as $file) {
            
            //deleted_atに値があればファイルとサムネイルを削除する
            if (isset($file["deleted_at"])) {
                // log::debug("deleted_at") ;
                if (Storage::exists($file["filepath"])) {
                    Storage::delete($file["filepath"]) ;
                }

                if(Storage::disk('public')->exists($file["src_thumbnailpath"])) {
                    Storage::disk('public')->delete($file["src_thumbnailpath"]) ;
                }
                continue ;
            }

            //base64データはfilncChildren後は残っていない為リクエスト時のデータから検索
            $reqIdx4Thum = array_search($file["uid"], array_column($reqProjectFiles, 'uid')) ;
            $matchedReqFileRow = $reqProjectFiles[$reqIdx4Thum] ;

            //正保存リンク
            $commonPath = "/public/attachment_files/t_project/$cd4SaveFiles/" ;

            //親ディレクトリがあるとき
            if (isset($file["file_dir"])) {
                
                $newFilePath = $commonPath . $file["file_dir"] . "/" . $file["filename"] ;
                
                if (isset($matchedReqFileRow["folder_code"])) {
                    $newFilePath = $commonPath . $matchedReqFileRow["folder_code"] . "/" . $file["file_dir"] . "/" . $file["filename"] ;
                }
            
            } else {

                $newFilePath = $commonPath . $file["filename"] ;
                if (isset($matchedReqFileRow["folder_code"])) {
                    $newFilePath =  $commonPath . $matchedReqFileRow["folder_code"] . "/" . $file["filename"] ;
                }
                // if (isset($folderCode)) {
                //     $newFilePath =  $commonPath . $folderCode . "/" . $file["filename"] ;
                // }
            }

            //pathを/で区切って配列化
            //"temporary"が含まれている場合は新規ファイル※保存済のためidでは判定できない
            $pathArr = explode("/",$file["filepath"]) ;

            if(!isset($file["src_thumbnailpath"])) {
                //サムネイルをサーバーローカルストレージに保存
                //フォルダの時 or サムネイルがnoimageの時は保存しない
                if(!$matchedReqFileRow["is_folder"] && $matchedReqFileRow["base64_thumbnail"] !== "img/noimage.png") {
                    $file["src_thumbnailpath"] = $this->saveThumbnail($matchedReqFileRow,$cd4SaveFiles) ;
                }

                //新規ファイルの時はfile同士のリレーションを設定
                if (array_search("temporary",$pathArr)) {
                    $file["filepath"] = $newFilePath ;

                    //file間のリレーション
                    if (isset($file['parent_id'])) {
                        $parentIdx = array_search($file['parent_id'], array_column($projectFiles, 'uid')) ;
                        if ($parentIdx >= 0) {
                            $matchedParentRow = $projectFiles[$parentIdx] ;
                            $file['parent_id'] = $matchedParentRow['id'] ;
                        }
                    }

                }

                //メールからの添付ファイル
            if(isset($file["t_project_mail_uid"])){
                //uidが一致する保存済のt_project_mailsのindexを取得
                $savedMailIdx = array_search($file["t_project_mail_uid"], array_column($projectMails, 'uid')) ;
                $file["t_project_mail_id"] = $projectMails[$savedMailIdx]["id"] ;

            }

                $this->saveFileRow($file) ;

            }

            

            // log::debug("fileend") ;
        }

        //tagLink
        foreach ($reqProjectFiles as $reqFile) {
            if (isset($reqFile["m_tag_links"])) {

                //紐づけられたタグ情報はリクエスト時のデータにしかない為検索する
                $idx4Tagink = array_search($reqFile["uid"], array_column($projectFiles, 'uid')) ;
                $matchedReqFileRow = $projectFiles[$idx4Tagink] ;

                $this->updateTagLink("App\Models\TProjectFile", $matchedReqFileRow["id"], $reqFile["m_tag_links"]) ;
            }
        }
    }

    protected function saveThumbnail($tProjectFile,$cd4SaveFiles) {
        $fileName = bin2hex(openssl_random_pseudo_bytes(16)) . ".jpeg";
        $storagePath = "t_project/$cd4SaveFiles/$fileName" ; 
        // $storagePath = "t_project/$cd4SaveFiles" . "/" . $tProjectFile["filename"] . ".jpeg"; 
        //base64データをストレージに保存する
        $fileData = base64_decode($tProjectFile["base64_thumbnail"]);
        Storage::disk('public')->put($storagePath, $fileData) ;

        return  $storagePath ;
    }


    //fillIncChildren後にt_project_fileを更新した際にファイルのみ更新する
    protected function saveFileRow($row) {
        $fileRow = new TProjectFile() ;
        $updateFileRow = $fileRow::find($row['id']) ;
        $updateFileRow->fill($row) ;

        try {
            $updateFileRow->save() ;
        } catch (\Exception $e) {
            $this->throwDbError($e) ;
        }
    }

    /**
     * 移動、編集時のファイル操作
     */
    protected function moveFiles($reqProjectFiles)
    {
        $dropbox = app()->make('dropboxClient') ;

        foreach ($reqProjectFiles as $file) {
            $isExistsFile = Storage::exists($file["filepath"]) ;

            if (isset($file["is_moved"])) {
                if (!$isExistsFile) {
                    $dropbox->move($file["src_filepath"], $file["filepath"]) ;
                }
            }

            if (isset($file["is_updated"])) {
                if ($isExistsFile) {
                    Storage::delete($file["filepath"]) ;
                    $dropbox->move($file["src_filepath"], $file["filepath"]) ;

                } ;

                //サムネイルのアップデート
                if (Storage::disk('public')->exists($file["src_thumbnailpath"]) ) {
                    Storage::disk('public')->delete($file["src_thumbnailpath"]) ;
                }
                if(!$file["is_folder"] && $file["base64_thumbnail"] !== "img/noimage.png") {
                    $fileData = base64_decode($file["base64_thumbnail"]);
                    Storage::disk('public')->put($file["src_thumbnailpath"], $fileData) ;
                }
                // $isExistsSrcFile = Storage::exists($file["src_filepath"]) ;

                // if ($isExistsSrcFile) {
                //     $dropbox->move($file["src_filepath"], $file["filepath"]) ;
                // }
            }
        }
    }

    protected function saveMails($savedProject)
    {
        
        //保存済のt_project_mails
        $projectMails = $savedProject["t_project_mails"] ;
        
        //添付ファイルの正保存リンクに物件コードが必要
        $cd4SaveMails = $savedProject["cd"] ;
        
        $dropbox = app()->make('dropboxClient') ;

        foreach ($projectMails as $mail) {
            
            //deleted_atに値があればメールを削除する
            if (isset($file["deleted_at"])) {
                // log::debug("deleted_at") ;
                if (Storage::exists($mail["mailpath"])) {
                    Storage::delete($mail["mailpath"]) ;
                }

                continue ;
            }

            //pathを/で区切って配列化
            //"temporary"が含まれている場合は新規メール※保存済のためidでは判定できない
            $pathArr = explode("/",$mail["mailpath"]) ;

            //新規ファイルの時はfile同士のリレーションを設定
            if (array_search("temporary",$pathArr)) {

                // log::debug($mail) ;
                //正保存リンク
                $newMailPath = "public/emails/t_project/$cd4SaveMails/" . $mail["mailname"] ;
                $dropbox->move($mail["mailpath"],$newMailPath) ;
                
                $mail["mailpath"] = "/$newMailPath" ;

                $mailRow = new TProjectMail() ;
                $updateMailRow = $mailRow::find($mail['id']);
                $updateMailRow->fill($mail) ;
                try {
                    $updateMailRow->save() ;
                } catch (\Exception $e) {
                    $this->throwDbError($e) ;
                }

            }

        }

    }

    //発注との紐づけの関係でidが変わるとまずいので施工人員のdeleteInsertはやめて個別で保存する
    protected function saveConstructionUsers($conUsers,$savedDel) {
        if(empty($conUsers)) return ;
        // log::debug($conUsers) ;

        //削除時の処理
        foreach($savedDel as $dlv) {
            
            foreach($dlv["t_project_construction_users"] as $cUser) {

                $savedCUserIdx = array_search($cUser["id"], array_column($conUsers, 'id')) ;

                if($savedCUserIdx === false ) {
                    $deletedCUModel = new TProjectConstructionUser() ;
                    $deletedCURow = $deletedCUModel::destroy($cUser["id"]) ;
                }
            }
        }
        


        foreach($conUsers as $user) {

            $id = $user["id"] ?? null ;

            if(isset($id)) {
                $matchedDeliveryId = $user["t_project_delivery_id"] ;
            } 
            else {
                $deliveryUid = $user["t_project_delivery_uid"] ;
                $savedDeliveryIdx = array_search($deliveryUid, array_column($savedDel, 'uid')) ;
                //一致する保存済の納品データ
                $matchedDeliveryId = $savedDel[$savedDeliveryIdx]["id"] ;
            }
            

            $constructionUserModel = new TProjectConstructionUser() ;

            $row = $constructionUserModel::updateOrCreate(
                ['id' => $id ],
                [
                    't_project_delivery_id' => $matchedDeliveryId ,
                    't_project_delivery_uid' => $user["t_project_delivery_uid"] ,
                    'm_user_id' => $user["m_user_id"] ?? null ,
                    'out_source_m_customer_id' => $user["out_source_m_customer_id"] ,
                    'out_source_person_name' => $user["out_source_person_name"] ,
                    'out_source_m_branch_id' => $user["out_source_m_branch_id"] ,
                    'num_of_out_source_people' => $user["num_of_out_source_people"] ,
                    'out_source_price' => $user["out_source_price"] ,
                    'out_source_total_price' => $user["out_source_total_price"] ,
                
                ]
            );
                
        }
    }
    /**
     * 施工実績写真
     */
    protected function saveConstructionPic(&$data)
    {
        $dropbox = app()->make('dropboxClient') ;
        $picPath =  Auth::user()->id . date("YmdHis");

        foreach($data["t_project_deliveries"] as &$del) {

            if(!isset($del["t_project_construction_results"])) continue ;

            foreach($del["t_project_construction_results"] as &$results) {

                $tProjectCd = $data["cd"] ;

                if(!isset($results["t_project_construction_result_pictures"])) continue ;

                foreach($results["t_project_construction_result_pictures"] as &$picture) {

                    $filepath4DBCli = substr($picture["filepath"], 1);
                    // log::debug($filepath4DBCli) ;

                    if(isset($picture["deleted_at"])) {

                        Storage::delete($filepath4DBCli) ;

                        if(Storage::disk('public')->exists(($picture["src_thumbnailpath"])) ) {
                            Storage::disk('public')->delete($picture["src_thumbnailpath"]);
                        }

                        continue ;

                    }
                    $thumbName = bin2hex(openssl_random_pseudo_bytes(16)) . ".jpeg";

                    //base64データをストレージに保存する
                    if(!isset($picture["src_thumbnailpath"]) && $picture["base64_thumbnail"] != "img/noimage.png") {
                        $picture["src_thumbnailpath"] = "$tProjectCd/t_project_construction/$thumbName" . ".jpeg" ;
                        $fileData = base64_decode($picture["base64_thumbnail"]);
                        Storage::disk('public')->put($picture["src_thumbnailpath"], $fileData);
                    }

                    $commonPath = "/public/t_project_construction/$tProjectCd/$picPath" ;
                    $commonPath4DBCli = substr($commonPath, 1);
                    // log::debug($commonPath4DBCli) ;

                    if(isset($picture["is_unsave"])) {
                        if($picture["is_unsave"]) {

                            $fileName = $picture['filename'] ;

                            try {

                                $dropbox->move($filepath4DBCli , "$commonPath4DBCli/$fileName") ;
                                $picture["filepath"] = "$commonPath/$fileName" ;


                            } catch (\PDOException $pdoException){
                                $this->throwDbError($pdoException);
                                $picture["filepath"] = "$commonPath/$fileName" ;

                            }


                        }


                    }
                }
                unset($picture) ;

            }
            unset($results) ;
            unset($del) ;
        }

    }

    /**
     * 納品先と商品の紐づけ処理
     * （未保存の商品の場合）
     * @param tDeliveryReq リクエスト時のt_project_deliveryの1行
     * @param tProjectSaved 保存済のデータ
     */
    protected function linkDeliveryProduct ($tDeliveryReq,$tProjectSaved) {
        
        //未保存の商品との紐づけがない場合はスルー
        if(empty($tDeliveryReq["_t_project_products"])) return ;

        //DBへ渡す用のデータ（商品リンク以外更新しないようにトリム）
        $updateData = array(
            "id" => $tDeliveryReq["id"] ?? null ,
            "t_project_products" => $tDeliveryReq["t_project_products"] ?? array() ,
        ) ;

        foreach($tDeliveryReq["_t_project_products"] as $linkProduct) {
            $productUid = $linkProduct["product_uid"] ;
            $deliveryUid = $linkProduct["delivery_uid"] ;
            
            $savedProductIdx = array_search($productUid, array_column($tProjectSaved["t_project_products"], 'uid')) ;
            $savedDeliveryIdx = array_search($deliveryUid, array_column($tProjectSaved["t_project_deliveries"], 'uid')) ;
            
            //一致する保存済の商品のid
            $matchedProductId = $tProjectSaved["t_project_products"][$savedProductIdx]["id"] ;
            //一致する保存済の納品データ
            $matchedDeliveryRow = $tProjectSaved["t_project_deliveries"][$savedDeliveryIdx] ;

            //DB更新用のデータにidがない場合、一致する保存済の納品データから取得する
            if(!isset($updateData["id"])) $updateData["id"] = $matchedDeliveryRow["id"] ;

            $linkdata = array(
                "id" => $matchedProductId ,
                "t_project_delivery_product_link" => array(
                    "t_project_delivery_id" => $matchedDeliveryRow["id"] ,
                    "t_project_product_id" => $matchedProductId ,
                    "created_m_user_id" => $linkProduct["created_m_user_id"] ,
                    "qty" => $linkProduct["t_project_delivery_product_link"]["qty"],
                ) ,
            ) ;
            
            array_push( $updateData["t_project_products"] , $linkdata ) ;

        }

        $deliveryModel = new TProjectDelivery() ;
        $updateModel = $deliveryModel::find($updateData['id']) ;

        $updateModel->fillIncChildren($updateData) ;

        try {
            $updateModel->push() ;
        } catch (\Exception $e) {
            $this->throwDbError($e) ;
            DB::rollBack();

        }



    }


    //見積承認
    public function approveEst($id,$type = "ok") {

        $row = $this->model::find($id) ;
        
        if($type == "ok" ) {
            $row->est_approved_m_user_id = Auth::user()->id ;
            $now = new DateTime();
            $row->est_approved_at = $now->format('Y-m-d H:i:s');
        }
        elseif ($type == "ng") {
            $row->est_approved_m_user_id = null ;
            $row->est_approved_at = null;
        }
        
        $row->save() ;

        return $row ;
    }
	
	 /**売上完了処理 */
    public function salesComplete(Request $request) {
        $data = $request->all() ;
        $row = $this->model::find($data['id']) ;
        if($row == null) {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }

        $row->updated_m_user_id = Auth::user()->id ;
        $row->sales_completed_at = $data['sales_completed_at'] ;

        $row->save() ;

        return $row ;
    }


    /**report系 */

    use LocalFileStorageTrait ;


    /**下げ札 */
    public function createHungTag($id, $view = null)
    {
        $details = $this->productModel::
            with([
                'TProject:id,name,m_customer_id,m_branch_id,ordered_at',
                'TProject.MCustomer:id,name',
                'MBranch:id,name,tel',
                'TProjectFile',
                'OperatorMUser:id,last_name',
                'TProjectProductProcesses:id,t_project_product_id,is_01,m_material_id_01,m_process_category_id,s_01,is_enabled',
                'TProjectProductProcesses.MProcessCategory:id,is_main_material,is_lami_material',
            ])
            ->selectRaw(
                '
                t_project_products.id ,
                t_project_products.name ,
                t_project_products.t_project_id ,
                t_project_products.t_project_file_id ,
                t_project_products.m_branch_id ,
                t_project_products.display_01 ,
                t_project_products.display_02 ,
                t_project_products.display_03 ,
                t_project_products.display_04 ,
                t_project_products.display_05 ,
                t_project_products.operator_m_user_id ,
                t_project_products.qty ,
                t_project_products.size_w ,
                t_project_products.size_h ,
                t_project_products.is_partical_delivery ,
                t_project_delivery_product_links.qty as delivery_qty ,
                t_project_deliveries.id as t_delivery_id ,
                t_project_deliveries.delivery_m_kv_id as delivery_m_kv_id ,
                t_project_deliveries.delivery_at as delivery_at ,
                t_project_deliveries.delivery_time as delivery_time ,
                t_project_deliveries.arrival_at as arrival_at ,
                t_project_deliveries.arrival_time as arrival_time ,
                m_kvs.kv_name as delivery_m_kv_name ,
                m_product_categories.is_delivery_needed  
                '
            )
            ->join('t_project_delivery_product_links','t_project_products.id','=','t_project_delivery_product_links.t_project_product_id')
            ->join('t_project_deliveries', function($q) {
                $q->on('t_project_delivery_product_links.t_project_delivery_id','=','t_project_deliveries.id')
                ->whereNull('t_project_deliveries.deleted_at') ;
            })
            ->join('m_kvs', function($q) {
                $q->on('m_kvs.id','=','t_project_deliveries.delivery_m_kv_id')
                ->whereNull('m_kvs.deleted_at') ;
            })
            ->join('m_product_categories', function($q) {
                $q->on('m_product_categories.id','=','t_project_products.m_product_category_id')
                ->whereNull('m_product_categories.deleted_at') ;
            })
            ->where('t_project_products.t_project_id',$id)
            //値引き等納品不要な商品を除く
            ->where('m_product_categories.is_delivery_needed',1)
            ->groupByRaw('t_project_deliveries.id,t_project_products.id ') 
            ->get() ;
        
        // $this->logJson($details) ;    
        // return ;

		$json = json_decode(json_encode($details), true) ;
        
        //複数件納品がある商品id
        $dupIds = array_keys(array_filter(array_count_values(array_column($json,'id')), fn ($v) => $v >= 2 )) ;

        $qr = new QRCodeController ;
        foreach($details as &$product) {

            $product->isPD = in_array($product->id, $dupIds);
            // サムネイル取得
            if (! is_null($product->TProjectFile )){
                $product->TProjectFile->append("base64_thumbnail") ;
            }
            //メイン材料・ラミを取得
            if ( count($product->TProjectProductProcesses) > 0 ){
                $product->append(['main_material' , 'lami_material' ]) ;
            }
            if($product->delivery_m_kv_id == 3710003) {
                $product->qr = $qr->generateQRCode4TProjectConstruction($product->t_delivery_id) ; 
            }
            else {
                $product->qr = $qr->generateQRCode4TProjectDelivery($product->t_delivery_id) ;
            }
        }
            
        // $productsArray  = json_decode(json_encode($details), true) ;
        // log::debug($productsArray) ;
        $reportLogo = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.report_logo'),true) ;

        if (isset($view)) {
            $isView = true ;
            // View(blade)で開く
            return view('t_projects.hung_tag.hung_tag', compact('details','reportLogo','isView')) ;

        } else {
            // Laravel-SnappyPDFを利用
            $hungTag = \SnappyPDF::loadView('t_projects.hung_tag.hung_tag', compact('details','reportLogo')) ;
            return $hungTag->stream() ;
        }
    }



    /**指示書 */
    public function getDirectionHeader($id) {
        $header = $this->model::
        with([
            'MBranch:id,name,short_name',
            'MCustomer:id,name,short_name',
            'SalesMUser:id,last_name,first_name,full_name',
            'TProjectDeliveries:id,t_project_id,delivery_at,delivery_time,arrival_at,arrival_time,delivery_customer_name,memo,delivery_m_kv_id',
            'TProjectDeliveries.DeliveryMKv'
        ])        
        ->find($id) ;

        $header->append(["min_delivery","max_arrival"]) ;

        return $header ;
    }
    public function getDirectionDetail($id) {
        //使用する工程カラム（改行するとエラー）
        $processColumns = ":id,t_project_product_id,is_01,m_material_id_01,m_process_category_id,s_01,is_enabled,m_branch_id,display_01,display_02,display_03,display_04,display_05,display_06,display_07,display_08,display_09,memo" ;
        $details = $this->productModel::where("t_project_id",$id)
            ->with([
                'TProjectProductBoardlayouts',
                'TProjectProductBoardlayouts.MMaterialDetail',
                'TProjectProductSeparates',
                'TProjectDeliveries:id,delivery_at,delivery_time,arrival_at,arrival_time,delivery_customer_name,memo,delivery_m_kv_id',
                'TProjectDeliveries.DeliveryMKv',
                'TProjectFile',
                'OperatorMUser:id,last_name,first_name,full_name',
                'SpecifiedMKv',
                'MProductCategory:id,name',
                "TProjectProductProcesses" . $processColumns , 
                'TProjectProductProcesses.MProcessCategory:id,name,is_main_material,is_lami_material',
                'TProjectProductProcesses.MBranch:id,name,short_name',
                
            ])
            ->where(function ($query) {
                $query->whereHas('MProductCategory', function ( $subquery ) {
                    $subquery->where('is_direction_sheet',1);
                }) ; 
            }) 
            ->orderBy("order_no")
            ->get() ;

        return $details ;
        
    }
    public function createDirection($id, $view = null)
    {   
        
        $header = $this->getDirectionHeader($id) ;
        $details = $this->getDirectionDetail($id) ;

        $date4filename = date("YmdHis");
        
        if (isset($view)) {
            $isView = true ;
            // View(blade)で開く
            return view('t_projects.direction.direction', compact('header', 'details', 'isView')) ;
        } else {
            // Laravel-SnappyPDFを利用
            $direction = \SnappyPDF::loadView('t_projects.direction.direction', compact('header','details'))
                                    ->setPaper('a4')->setOrientation('landscape')
                                    ->setOption('header-right', '[page]/[topage] page')
                                    // ->setOption('header-font-name', 'NotoSansJapanese')
                                    ->setOption('header-font-size', 8) ;
            return $direction->stream('指示書-' .  $header->cd . '@' . $date4filename .'.pdf') ;
        }
    }
    public function createDirectionNew($id, $view = null){

        $header = $this->getDirectionHeader($id) ;
        $details = $this->getDirectionDetail($id) ;

        $date4filename = date("YmdHis");

        if (isset($view)) {
            $isView = true ;
            // View(blade)で開く
            return view('t_projects.direction_new.direction', compact('header', 'details', 'isView')) ;
        } else {
            // Laravel-SnappyPDFを利用
            $pdf = \SnappyPDF::loadView('t_projects.direction_new.direction', compact('header','details')) 
                ->setOption('header-right',date('Y/m/d H:i') .  '   [page]/[topage] page')
                ->setOption('header-font-size', 8) ; 

            return $pdf->stream('指示書-' .  $header->cd . '@' . $date4filename .'.pdf') ;

        }
        
    }

    /**見積書出力 */
    public function createEstimate($id, $view = null)
    {
        $header = $this->model
            ::with('MBranch')
            ->with('MCustomer')
            // ->with('MCustomerPerson')
            ->with('TProjectProducts')
            ->with('TProjectDeliveries')
            ->with('SalesMUser')
            ->with('EstimateDeliveryMKv')
            ->find($id) ;

        //見積用の情報をappend
        $header->append([
            'display_estimate_delivery_date',
            'display_estimate_delivery_address',
            'display_estimate_condition',
            'display_estimate_term',
        ]) ;

        // $header->append("display_customer_user_name") ;


        $productsArray  = json_decode(json_encode($header), true) ;
        $productIds = array_column($productsArray["t_project_products"],'id') ;

        unset($header["t_project_products"]) ;

        $details = $this->productModel
            ::where("t_project_id",$id)
            ->with('UnitMKv')
            ->with('TProjectProductEstimateDetails')
            ->orderBy("order_no")
            ->get() ;

        // $details = $details->sortBy('TProjectProduct.order_no')->values();

        $totalPrice = $header->delivery_fee ;
        foreach ($details as &$data) {

            $totalPrice += $data->total_sell_price ;

            $data->display_content = $data->name ;
            
            //商品名
            if($data->size_w>0 && $data->size_h>0 && !$data->is_not_display_size_in_estimate) {
                $data->display_content .= '[ ' . $data->size_w . ' × ' . $data->size_h .' mm ]' ;
            }

        }
        unset($data) ;

        /**消費税端数 */
        $taxFraction = $header->MCustomer->tax_fraction_m_kv_id ;

        //未設定は四捨五入
        if(!isset($header->MCustomer->tax_fraction_m_kv_id)) $taxFraction = 1070002 ;

        if($taxFraction == 1070000 || $taxFraction == 1070001) {
            //未計算切り捨て
            $tax = floor($totalPrice/10) ;
            
        } else if ($taxFraction == 1070002) {
            //四捨五入
            $tax = round($totalPrice/10) ;

        } else if ($taxFraction == 1070003) {
            //切り上げ
            $tax = ceil($totalPrice/10) ;

        }



        //各情報をheaderにあてこみ
        $header["totalPrice"] = $totalPrice ;
        $header["tax"] = $tax ;
        $header["reportLogo"] = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.report_logo'),true) ;
        $header["companySeal"] = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.company_seal'),true) ;

        $date4filename = date("YmdHis");

        if (isset($view)) {
            $isView = true ;
            // View(blade)で開く
            return view('t_projects.estimate.estimate', compact('header','details','isView')) ;

        } else {
            // Laravel-SnappyPDFを利用
            $estimate = \SnappyPDF::loadView('t_projects.estimate.estimate', compact('header','details')) ;
            return $estimate->stream('見積書-' .  $header->estimate_formatted_no . '@' . $date4filename .'.pdf' ) ;
        }
    }

    private function logJson($obj) {
		$json = json_decode(json_encode($obj), true) ;
        log::debug($json) ;
	}

}
