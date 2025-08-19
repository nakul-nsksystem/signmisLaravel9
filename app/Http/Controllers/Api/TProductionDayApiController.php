<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\TProjectProductProcess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use stdClass;

class TProductionDayApiController extends BaseApiController
{
    private $mBranchColumns = ":m_branches.id,m_branches.order_no,m_branches.name" ; 
    private $mSpeedUnitKvColumns = ":m_kvs.id,m_kvs.kv_name" ; 
    private $mProcessCategoryColumns = ":m_process_categories.id,m_process_categories.cd,m_process_categories.name" ; 
    private $mProductCategoryColumns = ":m_product_categories.id,m_product_categories.cd,m_product_categories.name" ; 
    private $mProductionModesColumns = ":m_production_modes.id,m_production_modes.m_production_id,m_production_modes.order_no,m_production_modes.order_no,m_production_modes.name,m_production_modes.machine_mode_name,m_production_modes.prepare_sec_per_qty,m_production_modes.speed_per_hour,m_production_modes.speed_unit_m_kv_id,m_production_modes.description" ; 
    private $mProductionOptionsColumns = ":m_production_options.id,m_production_options.m_production_id,m_production_options.order_no,m_production_options.name,m_production_options.speed_rate,m_production_options.num_of_colors,m_production_options.num_of_colors_for_cost,m_production_options.num_of_white_for_cost,m_production_options.num_of_varnish_for_cost" ; 
    private $deliveryMKvColumns = ":m_kvs.id,m_kvs.kv_name" ; 

    private $processCategoryColumns = 
                ":id," . 
                "order_no," . 
                "name," . 
                "is_production," . 
                "is_main_material," . 
                "is_lami_material," .
                "production_m_kv_id," . 
                "production_color" 
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
        $this->model = "App\Models\TProductionDay" ;
    }

    private function getBuilder() : Builder
    {
        //return $this->model::query(); 
        return $this->model
            ::with(
                $this->getWith() 
            ); 
             
    }
    
    /**
     * 多改装NestのWith取得用
     */
    protected function getWith() {
        $groups                 = "TProductionDayGroups" ; 
        
        $processResultUsers     = "TProjectProductProcesses.TProductionResults.TProductionResultUsers"  ; 
        $processResults         = "TProjectProductProcesses.TProductionResults.TProductionResultStops"  ; 
        $processProductFile     = "TProjectProductProcesses.TProjectProduct.TProjectFile"  ; 
        $processesProject       = "TProjectProductProcesses.TProjectProduct.TProject{$this->projectColumns}" ; 
        $processesProjectCust   = "TProjectProductProcesses.TProjectProduct.TProject.MCustomer:id,name,short_name" ; 
        $processesProjectPdtCad = "TProjectProductProcesses.TProjectProduct.MProductCategory" ; 
        // $processesProdProcesses = "TProjectProductProcesses.TProjectProduct.TProjectProductProcesses" . TProjectProductProcess::getProductionColumnStr()  ; 
        $processesProdProcesses = "TProjectProductProcesses.TProjectProduct.TProjectProductProcesses"  ; 
        $processesProcCat       = "TProjectProductProcesses.TProjectProduct.TProjectProductProcesses.MProcessCategory{$this->processCategoryColumns}" ; 
        $processesProcPlan      = "TProjectProductProcesses.TProjectProduct.TProjectProductProcesses.TProductionProcessPlans" ; 
        
        $processesCat           = "TProjectProductProcesses.MProcessCategory{$this->processCategoryColumns}" ; 

        $processProductDelivery = "TProjectProductProcesses.TProjectProduct.TProjectDeliveries:id,delivery_at,delivery_time,delivery_m_kv_id"  ; 
        $processProductDeliveryKv = "TProjectProductProcesses.TProjectProduct.TProjectDeliveries.DeliveryMKv{$this->deliveryMKvColumns}"  ; 

        $stops = "TProductionResults.TProductionResultStops" ; 
        $users = "TProductionResults.TProductionResultUsers" ; 
        
        $rtn = [] ; 
        $nestCnt = 5 ; 

        for ($i = 1; $i <= $nestCnt; $i++) {
            $gStr = "" ; 
            for ($j = 1; $j <= $i; $j++) {
                $gStr .= $groups . "." ; 
            }
            
            array_push($rtn , $gStr . $stops ) ; 
            array_push($rtn , $gStr . $users ) ; 
            
            $gstrProcess = $gStr . "TProjectProductProcesses" ; 
            $rtn[$gstrProcess] =
                function($query){
                    // $query->tProjectOrdered() ; 
                    $query->select(TProjectProductProcess::getProductionColumnsWithTName())  ; 
                    
                } ; 
                
            // array_push($rtn , $gStr . $processes ) ;             
            array_push($rtn , $gStr . $processResults) ; 
            array_push($rtn , $gStr . $processResultUsers ) ; 
            
            
            array_push($rtn , $gStr . $processProductFile ) ; 
            
            array_push($rtn , $gStr . $processesProject ) ; 
            array_push($rtn , $gStr . $processesProjectPdtCad ) ; 
            
            array_push($rtn , $gStr . $processesProjectCust ) ;             
            array_push($rtn , $gStr . $processProductDelivery ) ;             
            array_push($rtn , $gStr . $processProductDeliveryKv ) ;             
            
            // array_push($rtn , $gStr . $processesProdProcesses ) ; 
            $gstrProdProcess = $gStr . $processesProdProcesses ; 
            $rtn[$gstrProdProcess] =
                function($query){
                    $query->enabled() ; 
                    // $query->select(TProjectProductProcess::getProductionColumnsWithTName())  ; 
                    $query->select(
                        [
                            "id",
                            "t_project_product_id",
                            "is_enabled",
                            "m_process_category_id",
                            "m_material_id_01" , 
                            "is_01" , 
                            "s_01" , 

                        ]) ; 
                    
                    
                } ; 
            // array_push($rtn , $gStr . $processesProcPlan ) ; 
            
            
            
            array_push($rtn , $gStr . $processesProcCat ) ; 
            array_push($rtn , $gStr . $processesCat ) ; 
            
        }
        //   Log::debug($rtn) ; 

        return $rtn ; 

    }

    public function index()
    {
        $data = $this->getBuilder()         
            ->orderBy("day" ,"asc")
            ->get()  ;
        
        return $data->values()->all();
        

    }

    
    /**
     * m_production_id と 日付から取得
     */
    public function searchByDay(Request $request){
        
        $data = $request->validate([
            'm_production_id' => 'integer',            
            'day' => 'string',
            'process_category_m_kv_id' => 'integer|nullable',            
        ]);
        
        // $data = $request->all() ; 
        // Log::debug($data) ; 
        $mProductionId = $data["m_production_id"] ; 
        $processCategoryMKvId = $data["process_category_m_kv_id"] ; 
        $day = $data["day"] ; 


        
        $query = $this->model
            ::with(
                $this->getWith() 
            )
            ->where("m_production_id" , $mProductionId) 
            ->where("process_category_m_kv_id" , $processCategoryMKvId) 
            ->whereDate("day" , $day) ; 
        
        $row = $query->first() ; 

        // Material Appends
        if ( $row && $row->TProductionDayGroups){
            foreach ( $row->TProductionDayGroups as $group){
                $this->appendMaterials($group) ;
                $this->appendCalcedDeliveryDate($group) ;
                $this->hiddenColumns($group) ; 
                $this->appendThumbnail($group) ; 
                // $this->appendTmpTargetProductionNo($group ,$mProductionId) ;
    
            }    
        }
        
        return $row ; 
    }

    /**
     * 子グループ含めて tProjectProductにmaterial系をappend
     */
    protected function appendMaterials($group){
        if ( count($group->TProjectProductProcesses) > 0 ){
            foreach ( $group->TProjectProductProcesses as $process){
                $process->TProjectProduct->append('main_material') ; 
                $process->TProjectProduct->append('lami_material') ;     
                // $process->TProjectProduct->makeHidden(
                //     [
                //         "separate_base64_svg" ,
                //         "board_layout_base64_svg" ,
                //     ]) ;
                // $process->TProjectProduct->makeHidden(
                //     [
                //         "separate_base64_svg" ,
                //         "board_layout_base64_svg" ,
                //         "TProjectFile"
                //     ]) ;

                // $process->TProjectProduct->TProject->makeHidden(
                //         [
                //             "TProjectDeliveries" ,
                //             "max_arrival"
                //         ]) ;
                
    

            }
        }
        else { 
            foreach ($group->TProductionDayGroups as $cGroup){
                $this->appendMaterials($cGroup) ; 
            }
        }
    }

    protected function appendCalcedDeliveryDate($group) { 
        if ( count($group->TProjectProductProcesses) > 0 ){
            foreach ( $group->TProjectProductProcesses as $process){
                $process->TProjectProduct->append('calced_delivery_date') ; 
            }
        }
        else { 
            foreach ($group->TProductionDayGroups as $cGroup){
                $this->appendCalcedDeliveryDate($cGroup) ; 
            }
        }        
    }
    

    /**
     * process tmp_target_production_no を設定
     */
    protected function appendTmpTargetProductionNo($group ,$mProductionId) { 
        if ( count($group->TProjectProductProcesses) > 0 ){
            foreach ( $group->TProjectProductProcesses as $process){
                $process->ReflectTmpTargetProductionNo($mProductionId) ; 
            }
        }
        else { 
            foreach ($group->TProductionDayGroups as $cGroup){
                $this->appendTmpTargetProductionNo($cGroup ,$mProductionId) ; 
            }
        }

    }

    
    protected function appendThumbnail($group) { 
        if ( count($group->TProjectProductProcesses) > 0 ){
            foreach ( $group->TProjectProductProcesses as $process){
                if (! is_null($process->TProjectProduct->TProjectFile )){
                    $process->TProjectProduct->TProjectFile->append("base64_thumbnail") ;
                }

            }
        }
        else { 
            foreach ($group->TProductionDayGroups as $cGroup){
                $this->appendThumbnail($cGroup) ; 
            }
        }        
    }

    protected function hiddenColumns($group){
        
        if ( count($group->TProjectProductProcesses) > 0 ){
            foreach ( $group->TProjectProductProcesses as $process){
                $process->TProjectProduct->makeHidden(
                    [
                        "separate_base64_svg" ,
                        "board_layout_base64_svg" ,
                    ]) ;
                // $process->TProjectProduct->makeHidden(
                //     [
                //         "separate_base64_svg" ,
                //         "board_layout_base64_svg" ,
                //         "TProjectFile"
                //     ]) ;

                $process->TProjectProduct->TProject->makeHidden(
                        [
                            "TProjectDeliveries" ,
                            "max_arrival"
                        ]) ;
                
            }
        }
        else { 
            foreach ($group->TProductionDayGroups as $cGroup){
                $this->hiddenColumns($cGroup) ; 
            }
        }
    }

    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->getBuilder()         
            ->find($id);
        
        if (! $row){
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        
        // Material Appends
        if ( $row && $row->TProductionDayGroups){
            foreach ( $row->TProductionDayGroups as $group){
                $this->appendMaterials($group) ;
                $this->appendCalcedDeliveryDate($group) ;
                $this->appendThumbnail($group) ; 
            }    
        }
        
        return $row ; 
    }

    protected function saveRow($request ,$row )
    {        
        $data = $request->all() ; 
        
        // 子供ごとSave
        $row->fillIncChildren($data) ;
        // Log::debug(print_r($row , true )) ; 
        
        DB::beginTransaction();
        try {
            $row->push();        
            } catch (\PDOException $pdoException)
        {
            $this->throwDbError($pdoException) ; 
        }        
        catch (\Exception $e) { 
            DB::rollBack();
            Log::debug($e) ; 
        }
        DB::commit() ; 
        return $row ; 
    } 
    

}
