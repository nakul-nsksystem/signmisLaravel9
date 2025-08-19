<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProductionDay extends BaseModel
{

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [
        'day' => 'date',
    ];
    
    
    protected $childModels = 
        [
            "TProductionDayGroups" =>  "App\Models\TProductionDayGroup" ,

        ] ; 

    
    protected $unDeleteIncChildren = 
        [
            "TProductionDayGroups" ,
        ] ;


    protected $delInsChildModels = 
        [
            //"TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
        ] ; 

        
    

    public function MProduction()
    {
        return $this
            ->belongsTo('App\Models\MProduction' , "m_production_id")
            ->withTrashed();
    }
    

    public function TProductionDayGroups() : HasMany
    {        
        return $this
            ->hasMany('App\Models\TProductionDayGroup')
            ->orderby("order_no") ; 
            
    }
    

    public function toArray()
    {
        $array = parent::toArray();
        
        if ( isset($array['planed_start_at']) && ! empty($array['planed_start_at'])){
            
            $dtStart = new DateTime($array['planed_start_at']) ; 
            $array['planed_start_at'] = $dtStart->format('H:i');
        }

        if ( isset($array['planed_end_at']) && ! empty($array['planed_end_at'])){
            $dtEnd = new DateTime($array['planed_end_at']) ; 
            $array['planed_end_at'] = $dtEnd->format('H:i');
            return $array;
        }
    }
}
