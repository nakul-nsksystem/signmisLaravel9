<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TProductionResult extends BaseModel
{
    use SoftDeletes ; 

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'minutes' => "double" , 
        
    ];
    

    protected $childModels = 
        [
            "TProductionResultStops" =>  "App\Models\TProductionResultStop" ,
            "TProductionResultUsers" =>  "App\Models\TProductionResultUser" ,
        ] ; 

    
    protected $delInsChildModels = 
        [
            "TProductionResultUsers" =>  "App\Models\TProductionResultUser" ,
        ] ; 

    
        
    public function MProduction()
    {
        return $this
            ->belongsTo(MProduction::class , "m_production_id")
            ->withTrashed();
    }

    
    public function MProduction4Summary()
    {
        return $this
            ->belongsTo(MProduction::class , "m_production_id")
            ->select(["id" ,"m_branch_id" , "name"])
            ->withTrashed();
    }


    public function TProductionDayGroup()
    {
        return $this
            ->belongsTo(TProductionDayGroup::class , "t_production_day_group_id")
            ->withTrashed();
    }

    
    public function TProjectProductProcess()
    {
        return $this
            ->belongsTo(TProjectProductProcess::class , "t_project_product_process_id")
            ->withTrashed();
    }
    
    
    public function TProjectProductProcess4Summary()
    {
        return $this
            ->belongsTo(TProjectProductProcess::class , "t_project_product_process_id")
            ->select(TProjectProductProcess::getProductionSummaryColumnsWithTName())
            ->withTrashed();
    }
    
    

    public function TProductionResultStops() : HasMany
    {        
        return $this
            ->hasMany( TProductionResultStop::class)
            ->orderby("started_at") ; 
            
    }

    public function TProductionResultUsers() : HasMany
    {        
        return $this
            ->hasMany(TProductionResultUser::class); 
            
    }



    protected $appends = ['m_production_name' ];
    
    /**
     * 生産先名
     */
    public function getMProductionNameAttribute()
    {        
        if ( empty($this->MProduction)) return "" ; 

        $branchName = $this->MProduction->MBranch->shortNameOrName ; 
        $name = "{$branchName} - {$this->MProduction->name}" ; 
        return $name ;
    }    

    /**
     * 商品カテゴリー　違うカテゴリーが混ざらない前提
     *  貼りなど混ざるような場合は個別で生産実績を入れてもらう運用
     */
    public function getMProductCategoryNameAttribute()
    {        

        if ( count($this->target_t_project_product_processes) === 0 ) return "" ; 
        return $this->target_t_project_product_processes[0]->TProjectProduct->MProductCategory->name  ; 
    }    

    /**
     * 生産拠点
     */
    public function getProductionMBranchNameAttribute()
    {        
        return empty($this->MProduction) ? "" : $this->MProduction->MBranch->shortNameOrName ;          
    }    
    
    
    /**
     * 関連するtProjectProductProcessesを取得 必要に応じてappends ( 集計用 )
     */
    public function getTargetTProjectProductProcessesAttribute(){
        $processes = [] ; 
        if ( $this->TProjectProductProcess) {
            $processes[] = $this->TProjectProductProcess ; 
            
        }
        else { 
            $processes = $this->getChildProcesses($this->TProductionDayGroup ,true) ; 
        }
        return $processes ; 
        
    }    


    protected function getChildProcesses($dayGroup ){
        
        if ( count($dayGroup->TProjectProductProcesses) > 0 ){
            return $dayGroup->TProjectProductProcesses ; 
        }
        else {             
            if (count($dayGroup->TProductionDayGroups) == 0  ) return [] ; 
            $processes = [] ; 
            foreach ($dayGroup->TProductionDayGroups as $group){
                $rows = $this->getChildProcesses($group ) ; 
                foreach ($rows as $row){
                    $processes[] = $row ; 
                }
                
            }
            return $processes ; 
            
        }
    }

    /**
     * Scopes
     */


    /**
     * 加工カテゴリー
     */
    public function scopeByProductionMKvId($query ,$productionMKvId ) { 

        if ($productionMKvId == 0 ) return $query ; 

        // 工程レベルでの実績
        $q = $query->whereExists(function ($query) use ($productionMKvId ){
                $query->select(DB::raw(1))
                    ->from('t_project_product_processes')
                    ->join('m_process_categories as m_process_category' ,function($joinQuery){
                        $joinQuery
                            ->on("t_project_product_processes.m_process_category_id" , "=" ,"m_process_category.id"); 
                    })
                    ->where('m_process_category.production_m_kv_id', $productionMKvId) 
                    ->whereColumn(
                        't_production_results.t_project_product_process_id', 
                        't_project_product_processes.id') ;

            }) ; 

        // グループレベルでの実績
        $loopCnt = 5 ;         
        for ($i = 1; $i <= $loopCnt; $i++) {
            $q = $q->orWhereExists(function ($query) use ($productionMKvId ,$i){
                $query->select(DB::raw(1))
                    ->from("t_production_day_groups as t_production_day_group_1") ;
                
                for ($j = 1; $j <= $i; $j++) {                    
                    $planName       = "t_production_process_plans_"  . $j ; 
                    $dayGroupName   = "t_production_day_group_"      . $j ; 
                    $processName    = "t_project_product_processes_" . $j ; 
                    $mProcessCategoryName = "m_process_category_"    . $j ;                      

                    
                    if ($j != 1){
                        $parentDayGroupName = "t_production_day_group_" . ( $j - 1 ) ; 
                        $query->join("t_production_day_groups as " . $dayGroupName ,
                            $dayGroupName . ".parent_t_production_day_group_id", 
                            '=', 
                            $parentDayGroupName . ".id" ) ;                        
                    }

                    // Log::debug($planName) ;    

                }

            
                $query->join("t_production_process_plans as " . $planName ,
                    $planName . ".t_production_day_group_id", 
                    '=', 
                    $dayGroupName . ".id" ) 
                ->join("t_project_product_processes as " . $processName ,
                    $planName . ".t_project_product_process_id", 
                    '=', 
                    $processName . ".id" )  
                ->join("m_process_categories as " . $mProcessCategoryName ,
                    $processName . ".m_process_category_id" , 
                    "=" ,
                    $mProcessCategoryName . ".id" ) 
                ->where(
                    $mProcessCategoryName . ".production_m_kv_id", $productionMKvId) 
                ->whereColumn(
                    't_production_results.t_production_day_group_id', 
                    't_production_day_group_1.id') ;                    
            }) ; 
        }

        return $q ; 
    }


    /**
     * 商品カテゴリー
     */
    public function scopeByMProductCategoryIds($query ,$mProductCategoryIds ) { 

        if (! is_array($mProductCategoryIds) || count($mProductCategoryIds) == 0  ) return $query ; 

        // 工程レベルでの実績
        $q = $query->whereExists(function ($query) use ($mProductCategoryIds ){
                $query->select(DB::raw(1))
                    ->from('t_project_product_processes')
                    ->join('t_project_products as t_project_product' ,function($joinQuery){
                        $joinQuery
                            ->on("t_project_product_processes.t_project_product_id" , "=" ,"t_project_product.id"); 
                    })
                    ->whereIn('t_project_product.m_product_category_id', $mProductCategoryIds) 
                    ->whereColumn(
                        't_production_results.t_project_product_process_id', 
                        't_project_product_processes.id') ;

            }) ; 

        // グループレベルでの実績
        $loopCnt = 5 ;         
        for ($i = 1; $i <= $loopCnt; $i++) {
            $q = $q->orWhereExists(function ($query) use ($mProductCategoryIds ,$i){
                $query->select(DB::raw(1))
                    ->from("t_production_day_groups as t_production_day_group_1") ;
                
                for ($j = 1; $j <= $i; $j++) {                    
                    $planName       = "t_production_process_plans_"  . $j ; 
                    $dayGroupName   = "t_production_day_group_"      . $j ; 
                    $processName    = "t_project_product_processes_" . $j ; 
                    $productName    = "t_project_product_"    . $j ;                      

                    
                    if ($j != 1){
                        $parentDayGroupName = "t_production_day_group_" . ( $j - 1 ) ; 
                        $query->join("t_production_day_groups as " . $dayGroupName ,
                            $dayGroupName . ".parent_t_production_day_group_id", 
                            '=', 
                            $parentDayGroupName . ".id" ) ;                        
                    }

                    // Log::debug($planName) ;    

                }

            
                $query->join("t_production_process_plans as " . $planName ,
                    $planName . ".t_production_day_group_id", 
                    '=', 
                    $dayGroupName . ".id" ) 
                ->join("t_project_product_processes as " . $processName ,
                    $planName . ".t_project_product_process_id", 
                    '=', 
                    $processName . ".id" )  
                ->join("t_project_products as " . $productName ,
                    $processName . ".t_project_product_id" , 
                    "=" ,
                    $productName . ".id" ) 
                ->whereIn(
                    $productName . ".m_product_category_id", $mProductCategoryIds) 
                ->whereColumn(
                    't_production_results.t_production_day_group_id', 
                    't_production_day_group_1.id') ;                    
            }) ; 
        }

        return $q ; 
    }


    

}
