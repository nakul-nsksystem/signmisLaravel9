<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use Illuminate\Http\Request;
use App\Models\TProductionResult;
use App\Models\TProjectProductProcess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TProductionResultApiController extends BaseApiController
{
    
    private $processCategoryColumns = 
                ":id," . 
                "order_no," . 
                "name," . 
                "is_production," . 
                "is_main_material," . 
                "is_lami_material," .
                "production_m_kv_id" 
                ;
               
    

    private $projectColumns = 
                ":id," . 
                "m_branch_id," . 
                "type_flg," . 
                "cd," . 
                "name," . 
                "m_customer_id," .
                "sales_m_user_id," .
                "ordered_at," .
                "memo" 
                ;


    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = TProductionResult::class ;
    }

    protected $filters = array(
        // 開始日
        "started_at_from" => array(
            "operation" => ">="  ,
            "column" => "started_at" ,
        ) ,
        "started_at_to" => array(
            "operation" => "<="  ,
            "postfix" => " 23:59:59" ,            
            "column" => "started_at" ,
        ) ,
        "m_production_id" => array() ,
        "m_production" => array(
            "operation" => "table" ,
            "relation_name" => "MProduction" ,
            "m_branch_id" => array() ,            
        ) ,
        
    ) ;

    protected function getWith() {
        $groups                 = "TProductionDayGroups" ; 
        $processesProduct       = "TProjectProductProcesses.TProjectProduct:id,t_project_id,name,m_product_category_id,qty,sqm,total_sqm";
        $processesProject       = "TProjectProductProcesses.TProjectProduct.TProject:id,name,m_branch_id,cd,name,m_customer_id,sales_m_user_id" ; 
        $processesProjectCust   = "TProjectProductProcesses.TProjectProduct.TProject.MCustomer:id,name,short_name" ; 
        $processesProjectPdtCad = "TProjectProductProcesses.TProjectProduct.MProductCategory:id,name" ; 
        
        $processesCat           = "TProjectProductProcesses.MProcessCategory{$this->processCategoryColumns}" ; 


        
        $rtn = [
            "MProduction:id,name,m_branch_id" ,
            "MProduction.MBranch:id,name,short_name" ,

            "TProductionDayGroup.TProjectProductProcesses" . TProjectProductProcess::getProductionSummaryColumnStr() , 
            "TProductionDayGroup." .$processesProject  ,
            "TProductionDayGroup." .$processesProduct , 
            "TProductionDayGroup." .$processesProjectCust  ,
            "TProductionDayGroup." .$processesProjectPdtCad  ,
            "TProductionDayGroup." .$processesCat  ,            
            "TProjectProductProcess" . TProjectProductProcess::getProductionSummaryColumnStr() ,
            
            "TProjectProductProcess.TProjectProduct:id,t_project_id,name,m_product_category_id" , 
            "TProjectProductProcess.TProjectProduct.TProject{$this->projectColumns}" , 
            "TProjectProductProcess.TProjectProduct.TProject.MCustomer:id,name,short_name" , 
            "TProjectProductProcess.TProjectProduct.MProductCategory" , 
            "TProjectProductProcess.MProcessCategory{$this->processCategoryColumns}" , 
            
        ] ; 
        $nestCnt = 5 ; 

        for ($i = 1; $i <= $nestCnt; $i++) {
            $gStr = "TProductionDayGroup." ; 
            for ($j = 1; $j <= $i; $j++) {
                $gStr .= $groups . "." ; 
            }
            
            $gstrProcess = $gStr . "TProjectProductProcesses" ; 
            $rtn[$gstrProcess] =
                function($query){
                    // $query->tProjectOrdered() ; 
                    $query->select(TProjectProductProcess::getProductionSummaryColumnsWithTName())  ;                     
                } ; 
                
            // array_push($rtn , $gStr . $processes ) ;            
            // array_push($rtn , $gStr . $processProductFile ) ; 
            
            array_push($rtn , $gStr . $processesProject ) ; 
            array_push($rtn , $gStr . $processesProduct ) ; 
            array_push($rtn , $gStr . $processesProjectPdtCad ) ;             
            array_push($rtn , $gStr . $processesProjectCust ) ;   
            // array_push($rtn , $gStr . $processesProcPlan ) ; 
            
            array_push($rtn , $gStr . $processesCat ) ; 
            
        }
        //   Log::debug($rtn) ; 

        return $rtn ; 

    }

    public function retrieve4summary(Request $req) { 
        
        $reqProcesses = $req["t_project_product_process"] ;
        unset($req["t_project_product_process"]) ;

        // 検索フィルター
        $query = $this->getFiltered($req) ; 
        $query->whereNotNull("m_production_id") ; 

        $productionMKvId = intval($reqProcesses["m_process_category"]["production_m_kv_id"]) ; 
        $productCategoryIds = $reqProcesses["t_project_product"]["m_product_category_ids"] ; 

        // 加工カテゴリー
        if ( $productionMKvId !== 0 ){       
            $query->ByProductionMKvId($productionMKvId)   ;  
        }
        // 商品カテゴリー
        if (is_array($productCategoryIds) && count($productCategoryIds) > 0){
            $query->ByMProductCategoryIds($productCategoryIds)   ;  
        }

        // 取得
        $query->with($this->getWith()) ;

        $query->select(
            [
                "id" ,
                "m_production_id" ,
                "t_production_day_group_id" , 
                "t_project_product_process_id" ,
                "result_type_flg" , 
                "input_type_m_kv_id" , 
                "started_at" , 
                "ended_at" , 
                "minutes" , 
                "qty" , 
                "loss_qty" ,
                
            ]);
        
        $list  = $query->get() ; 

        // $sql = preg_replace_array('/\?/', $query->getBindings(), $query->toSql());
        // Log::debug($sql) ;        


        //
        foreach ($list as &$result){
            // $result->append('target_t_project_product_processes') ; 
            $result->append('target_t_project_product_processes') ;             
            $result->append('m_product_category_name') ; 
            $result->append('production_m_branch_name') ; 

            // 商品、物件をロード
            foreach ($result->TargetTProjectProductProcesses as $process){                
                 $process->TProjectProduct->TProject->makeHidden(
                    [
                        "TProjectDeliveries" ,
                        "min_delivery" ,
                        "max_arrival" ,
                        "estimate_formatted_no" ,
                        "display_estimate_delivery_date" ,
                        "estimate_formatted_no" ,
                        "display_estimate_delivery_address" ,
                        "display_estimate_condition" ,
                        "display_estimate_term" ,

                    ]) ; 
                
                $process->TProjectProduct->makeHidden(
                    [
                        "separate_base64_svg" ,
                        "board_layout_base64_svg" ,
                    ]) ;

            }
            $result->makeHidden(["TProductionDayGroup" ,"target_t_project_product_processes_for_summary"]) ;
        }


        return $list ; 
    }


}
