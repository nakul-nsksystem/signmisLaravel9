<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProductionDayGroup extends BaseModel
{

    use SoftDeletes ; 

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [
        "planned_day" => "date"
    ];
    

    protected $childModels = 
        [
            "TProductionResults" =>  "App\Models\TProductionResult" ,
            "TProductionDayGroups" => "App\Models\TProductionDayGroup" , 
            "TProjectProductProcesses" => TProjectProductProcess::class , 
        ] ; 

    protected $delInsChildModels = 
        [
            //"TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
        ] ; 

    protected $unDeleteIncChildren = 
        [
            "TProductionDayGroups" ,
        ] ;

    protected $syncPivotModels = 
        [
            "TProjectProductProcesses" => 
                [
                    "modelClass" => TProductionProcessPlan::class , 
                    "pivotName" => "t_production_process_plan" ,
                    "foreignKey" => "t_production_day_group_id" ,
                    "isSaveSelf" => true ,
                    "selfModel" => TProjectProductProcess::class , 
                ] ,
            
            //"TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
        ] ; 

    

    public function MProduction()
    {
        return $this
            ->belongsTo('App\Models\MProduction' , "m_production_id")
            ->withTrashed();
    }
    
    
    public function ParentTProductionDayGroup()
    {
        return $this
            ->belongsTo('App\Models\TProductionDayGroup' , "parent_t_production_day_group_id")
            ->withTrashed();
    }

    
    public function TProductionDay()
    {
        return $this
            ->belongsTo('App\Models\TProductionDay' , "t_production_day_id")            ;
    }
    
    
    public function TProductionDayGroups() : HasMany
    {        
        return $this
            ->hasMany(TProductionDayGroup::class ,"parent_t_production_day_group_id")
            ->orderby("order_no") ; 
            
    }

    public function TProductionResults() : HasMany
    {        
        return $this
            ->hasMany('App\Models\TProductionResult')
            ->whereNull("t_project_product_process_id")
            ->orderby("started_at") ; 
            
    }

    /**
     * Pivot経由の工程
     */
    public function TProjectProductProcesses()
    {
        $bToMany = $this
                    ->belongsToMany('App\Models\TProjectProductProcess' ,'App\Models\TProductionProcessPlan' )                
                    ->as("t_production_process_plan")
                    // ->withTimestamps()
                    ->withPivot(['id' ,'order_no' , 'qty' ])
                    ->orderBy("order_no") ;

        // Log::debug($bToMany) ; 
        // $bToMany->t_production_process_plan->results ; 
        return $bToMany ; 

    }

    
    /**
     * Pivot経由の工程
     */
    public function TProjectProductProcesses4Summary()
    {
        $columns = TProjectProductProcess::getProductionSummaryColumnsWithTName()  ; 
        $bToMany = $this
                    ->belongsToMany('App\Models\TProjectProductProcess' ,'App\Models\TProductionProcessPlan' )                
                    ->as("t_production_process_plan")
                    // ->withTimestamps()
                    ->withPivot(['id' ,'order_no' , 'qty' ])
                    ->orderBy("order_no")
                    ->select($columns) ;

        // Log::debug($bToMany) ; 
        // $bToMany->t_production_process_plan->results ; 
        return $bToMany ; 

    }
    
    
    // protected $appends = ['planned_day'  ];

    // public function getPlannedDayAttribute(){       
        
    //     if ( $this->TProductionDay == null ){
    //         $temp = $this->ParentTProductionDayGroup ; 
            
    //         $i = 0 ; 
    //         while ( $i < 5){
    //             if ( $temp->TProductionDay == null  ){
    //                 $temp = $temp->ParentTProductionDayGroup ; 
    //             }
    //             else { 
    //                 return $temp->TProductionDay["day"] ; 
    //             }
    //         }
            
    //     }
    //     else { 
    //         return $this->TProductionDay["day"] ; 
    //     }


    // }

    
    // public function toArray()
    // {
    //     $array = parent::toArray();
    //     return $array;
    // }
    


    

}
