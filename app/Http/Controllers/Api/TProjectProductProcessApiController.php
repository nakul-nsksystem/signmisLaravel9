<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException ; 
use App\Exceptions\NotFoundErrorException ; 
use App\Http\Controllers\Controller;
use App\Models\TProjectProductProcess;
use DateTime;
use Ramsey\Uuid\Type\Integer;

class TProjectProductProcessApiController extends BaseApiController
{   
    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TProjectProductProcess" ;
    }

    protected $filters = array(

        "supplier_m_customer_id" => array() ,
        "m_branch_id" => array() ,
        "is_enabled" => array() ,
        "is_order_needed" => array() ,
        "is_use_stocked" => array() ,

        
        "t_project_product" =>array(
            "operation" => "table" ,
            "relation_name" => "TProjectProduct" ,

            "t_project" => array(
                "operation" => "table" ,
                "relation_name" => "TProject" ,
                "name" => array(
                    "operation" => "like"  ,
                    "prefix" => "%" ,
                    "postfix" => "%" , 
                ),
                "ordered_at_from" => array(
                    "operation" => ">="  ,
                    "column" => "ordered_at" ,
                ) ,
                "ordered_at_to" => array(
                    "operation" => "<="  ,
                    "column" => "ordered_at" ,
                ) ,
                "min_delivery_from" => array(
                    "operation" => ">="  ,
                    "column" => "min_delivery" ,
                ) ,
                "min_delivery_to" => array(
                    "operation" => "<="  ,
                    "column" => "min_delivery" ,
                ) ,
            ) ,

        ) ,
        //資材区分、名称、金額
        "t_p_order_details" => array(
            "operation" => "table" ,
            "relation_name" => "TPOrderDetails" ,
            "approved" => array() ,
        ) ,
    ) ;

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->model::with([
                "TProjectProduct.TProjectProductProcesses",
                "TProjectProduct.TProject",
                ])
                ->find($id) ;
        
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        return $row ; 
    }
    
    private $constructionUserColumns = ":id,t_project_construction_id,m_user_id" ; 
    private $tProjectColumns = ":id,m_branch_id,cd,name" ; 
                
    private function getWith4Production(){



        $query = $this->model::
            with([
                "MProcessCategory" , 
                "TProductionResults" ,
                "TProductionDayGroups.TProductionResults" ,
                // "MProcessCategory.MProcesses" , 
                // "MProcessCategory.MProcessMaterials" , 
                // "MProcessCategory.MProcessOutsources" ,
                // "MProcessCategory.MProcessLabels",
                //"TProductionDayGroups",
                "TProjectProduct.TProjectFile" , 
                "TProjectProduct.TProjectDeliveries:id,delivery_at,delivery_time,delivery_m_kv_id" , 
                "TProjectProduct.TProjectDeliveries.DeliveryMKv:id,kv_name" , 
                "TProjectProduct.MProductCategory" , 
                "TProjectProduct.WarrantyMKv" ,
                "TProjectProduct.SpecifiedMKv",                
                "TProjectProduct.TProjectFile",
                "TProjectProduct.TProjectProductSeparates" , 
                "TProjectProduct.TProjectProductBoardlayouts.MMaterialDetail" ,                                 
                "TProjectProduct.TProjectProductProcesses" 
                    => function($query){
                        $query->enabled() ; 
                        // $query->select($this->process4tProductChildrenColumns)  ; 
                        $query->select(TProjectProductProcess::$productionColumns)  ; 
                        
                        // $query->select(["id" ,"t_project_product_id"]) ; 
                        //$query->where('is_enabled', true) ; 
                    },
                "TProjectProduct.TProject.MCustomer" , 
                "TProjectProduct.TProject.SalesMUser" , 
                // "TProjectProduct.TProject.TProjectProducts.TProjectProductProcesses"
                //     => function($query){
                //         $query->enabled() ; 
                //         //$query->where('is_enabled', true) ; 
                //     },
                    
            ]) ; 
        return $query ; 
    }

    /**
     * 生産残の検索
     */
    public function searchRemains(Request $request){
                
        $data = $request->validate([
            'm_production_id' => 'required|integer',
            'm_process_category_ids' => 'required|array',
            'delivery_date_from' => 'date|nullable',
            'delivery_date_to' => 'date|nullable',
        ]);

        $mProductionId = $data["m_production_id"] ; 
        $mProcessCategoryIds = $data["m_process_category_ids"] ; 

        $deliveryDateFrom = $data["delivery_date_from"] ; 
        $deliveryDateTo = $data["delivery_date_to"] ;         
        
        $query = $this->getWith4Production() ;

        // 有効、工程
        $query
            ->enabled()
            ->whereIn("m_process_category_id" , $mProcessCategoryIds) ; 

        // 生産先
        $query->where(function($query) use($mProductionId){
            $query
                ->where('m_production_id_01', $mProductionId)
                ->orWhere('m_production_id_02', $mProductionId)
                ->orWhere('m_production_id_03', $mProductionId)
                ->orWhere('m_production_id_04', $mProductionId) ; 
        }) ; 

        // 納期
        if (! empty($deliveryDateFrom ) || ! empty($deliveryDateTo )){
            $query->tProjectActiveAndDelivery($deliveryDateFrom , $deliveryDateTo) ; 
        }
        else {         
            $query->tProjectActive() ;
        }

        // 実績入を除外
        $query->resultDoesntExists() ; 
        // $query->whereDoesntHave("TProductionDayGroups", function ($query) {

        //     return $query ; 
        //     // $query->whereExists(function ($query) {
        //     //     return $query;
        //     // }) ; 
        // }) ; 

        // 受注している物件のみ
        $query->tProjectOrdered() ; 
        $sql = preg_replace_array('/\?/', $query->getBindings(), $query->toSql(TProjectProductProcess::$productionColumns));
        // Log::debug($sql) ; 

        $rows = $query->get(TProjectProductProcess::$productionColumns) ; 
        
        return $rows; 
    } 

    /**
     * 生産先から取得
     */
    public function searchByMProduction(Request $request)
    {
        $data = $request->validate([
            'm_production_id' => 'required|integer',
            'm_process_category_ids' => 'required|array',
            'delivery_date_from' => 'date|nullable',
            'delivery_date_to' => 'date|nullable',
        ]);

        $mProductionId = $data["m_production_id"] ; 
        $mProcessCategoryIds = $data["m_process_category_ids"] ; 

        $deliveryDateFrom = $data["delivery_date_from"] ; 
        $deliveryDateTo = $data["delivery_date_to"] ; 
        
        // Log::debug(" deliveryDateFrom {$deliveryDateFrom} deliveryDateTo {$deliveryDateTo}") ; 

        $query = $this->getWith4Production() ;

        // 有効、工程
        $query
            ->enabled()
            ->whereIn("m_process_category_id" , $mProcessCategoryIds) ; 

        // 生産先
        $query->where(function($query) use($mProductionId){
            $query
                ->where('m_production_id_01', $mProductionId)
                ->orWhere('m_production_id_02', $mProductionId)
                ->orWhere('m_production_id_03', $mProductionId)
                ->orWhere('m_production_id_04', $mProductionId) ; 
        }) ; 

        // 予定済みを除外
        $query->whereDoesntHave("TProductionDayGroups", function ($query) {
            return $query ; 
            // $query->whereExists(function ($query) {
            //     return $query;
            // }) ; 
        }) ; 

        // 納期
        if (! empty($deliveryDateFrom ) || ! empty($deliveryDateTo )){
            $query->tProjectActiveAndDelivery($deliveryDateFrom , $deliveryDateTo) ; 
        }
        else {         
            $query->tProjectActive() ;
        }

        // 受注している物件のみ
        $query->tProjectOrdered() ; 
        
        // $columns = explode(',' ,$this->processColumns) ; 
        // Log::debug($columns) ; 
        // $sql = preg_replace_array('/\?/', $query->getBindings(), $query->toSql($columns));
        $sql = preg_replace_array('/\?/', $query->getBindings(), $query->toSql(TProjectProductProcess::$productionColumns));
        // Log::debug($sql) ; 
        
        // $rows = $query->get($columns) ; 
        $rows = $query->get(TProjectProductProcess::$productionColumns) ; 
        

        // Material Appends
        foreach ( $rows as $row){
            $row->TProjectProduct->append('main_material') ; 
            $row->TProjectProduct->append('lami_material') ; 
            $row->TProjectProduct->append('calced_delivery_date') ;
            if (! is_null($row->TProjectProduct->TProjectFile )){
                $row->TProjectProduct->TProjectFile->append("base64_thumbnail") ;
            }
    
        }
        
        
        return $rows; 
    }
    
    /**発注画面から検索 */
    public function retrieveWithTPOrderDetails(Request $req) {

        $res = $this->getFiltered($req) ;

        $res = $res->with(
            [
                "MBranch" ,
                "SupplierMCustomer" ,
                "MMaterial01.MMaterialDetails.UnitMKv:id,kv_name" ,
                "TProjectProduct.MProductCategory" ,
                "TProjectProduct.TProject" ,
                "TProjectProduct.TProjectProductSeparates" ,
                "TProjectProduct.TProjectProductBoardlayouts.MMaterialDetail.UnitMKv:id,kv_name" ,
                "TProjectProduct.TProjectProductBoardlayouts.MMaterialDetail.MMaterial:id,supplier_m_customer_id,name,display_name" ,
                "MProcessCategory" ,
                "TPOrderDetails",
            ])
            ->orderBy('id','desc')
            ->paginate() ;
        
        return $res ;



    }


    /**
     * 更新日付のチェック
     * 　データ取得からリクエスト時までに変更があったテータを返す
     */
    public function checkUpdatedAt(Request $req){

        $data = $req->validate([
            '*' => 'required|array',
            '*.id' => 'required|integer',
            '*.updated_at' => 'required|date',
        ]);


        // Idのみ取得
        $funcGetIds = function(array $value): int {
            return $value["id"];
        };
        $ids = array_map($funcGetIds , $data) ; 

        // DBからデータ取得
        $records = $this->model::whereIn("id" , $ids)->get()->toArray() ; 
        // Log::debug($records) ; 
        // return [] ; 

        // 変更がないかチェック
        $diffs = array() ; 
        foreach ($data as $row ) {
            $foundIndex = array_search($row["id"], array_column($records, 'id'));
            // Log::debug("foundIndex : " . $foundIndex) ; 
            if ($foundIndex === false){
                $diffs[] = array(
                    "id" => $row["id"] ,
                    "type" => "NotFound" ,
                    "updated_at" => null ,
                )  ;                 
            }
            else { 
                $dbUpdatedAt = $records[$foundIndex]["updated_at"] ; 
                // Log::debug($dbUpdatedAt . " : " . $row["updated_at"]) ; 
                if (  $dbUpdatedAt != $row["updated_at"] ){
                    $diffs[] = array(
                        "id" => $row["id"] ,
                        "type" => "Diff" ,
                        "updated_at" => $dbUpdatedAt ,
                    )  ;                 
                    }
                else { 
                    
                }

            }
            

        }

        return $diffs ; 
    }

    

    /**
     * バグによって生じたデータを再計算する用
     */
    public function get4updateCost(Request $req){

        $data = $req->validate([
            'limit' => 'required|integer',
            "m_process_category_id" => 'required|integer',
        ]);

        $limit = $data["limit"] ; 
        $mProcessCategoryId = $data["m_process_category_id"] ; 

        $query = $this->model
                    ::with("TProjectProduct","MProcessCategory")
                    ->where("predicted_work_hour" , ">" , "0") 
                    ->where("total_cost" ,  "0") 
                    ->where("is_enabled" ,  "1") 
                    ->limit($limit); 

        if (! empty($mProcessCategoryId ) && $mProcessCategoryId !== 0 ){
            $query = $query->where("m_process_category_id" ,  $mProcessCategoryId) ;  
        }
        

        return $query->get() ; 
    }

    /**
     * バグによって生じたデータを保存する
     */
    public function updateList(Request $req){
        $data = $req->all() ; 
        $rtn = [] ; 
        
        foreach ($data as $process){            
            $row = $this->model::find($process["id"]) ;
            if (! $row) {
                $error = new NotFoundErrorException() ; 
                throw $error ; 
            }

            $row->fill($process) ;            
            try {
                $row->save();
            } catch (\PDOException $e) {
                $this->throwDbError($e) ; 
            }
                
            $rtn[] = $row ; 
        }
        return $rtn ; 
    }


}
