<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProductionProcessPlan extends BaseModel
{

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [
        
    ];
    

    protected $childModels = 
        [
        ] ; 

    protected $delInsChildModels = 
        [
            //"TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
        ] ; 

    
    
    public function TProductionDayGroup()
    {
        return $this
            ->belongsTo('App\Models\TProductionDayGroup' , "t_production_day_group_id")
            ->withTrashed();
    }
    
    public function TProjectProductProcess()
    {
        return $this
            ->belongsTo('App\Models\TProjectProductProcess' , "t_project_product_process_id")
            ->withTrashed();
    }
    
    
    /**
     * 生産実績データ ( t_project_product_processes への実績のみ )
     */
    public function TProductionResults() : HasMany
    {
        return $this
            ->hasMany(TProductionResult::class ,"t_project_product_process_id"); 
            
    }

    protected $appends = ['results'  ];

    public function getResultsAttribute(){
        $rtn = [] ; 
        //Log::debug(print_r($this->TProductionResults,false )) ; 
        if ( count($this->TProductionResults) != 0 ){
            //Log::debug("results " . $this->id) ; 
            
            foreach ($this->TProductionResults as $result   ){
                $result->TProductionResultUsers  ; 
                $result->TProductionResultStops  ; 
                $rtn[] = $result  ; 
            }
            //return $this->TProductionResults ; 
        }
        else { 
            //Log::debug("groups") ; 
            if ($this->TProductionDayGroup != null ){
                $level = $this->TProductionDayGroup->level ; 
                // Log::debug("level " . $level ) ; 
                $tempGroup = $this->TProductionDayGroup ; 

                for ( $i = 0 ; $i < $level + 1 ; $i++ ) { 
                    // Log::debug($i . " " . $tempGroup->id ) ; 
                    if (count($tempGroup->TProductionResults) != 0 ){
                        foreach ($tempGroup->TProductionResults as $result ){
                            $result->TProductionResultUsers  ; 
                            $result->TProductionResultStops  ; 
                            $rtn[] = $result  ; 
                       }
                       break ; 
                    }
                    $tempGroup = $tempGroup->ParentTProductionDayGroup ; 
                    
                }
                    //
                
            }
        }



        return $rtn ; 

    }

    
    

    

}
