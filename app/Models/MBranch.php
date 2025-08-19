<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class MBranch extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at'];
    
    protected $childModels = 
        [
            "MBranchProductionRests" =>  MBranchProductionRest::class ,

        ] ; 

    
    protected $appends = ['shortNameOrName'];
    public function getShortNameOrNameAttribute()
    {        
        return empty($this->short_name) ? $this->name : $this->short_name ;
    }    


    public function MBranchProductionRests() : HasMany
    {        
        return $this
            ->hasMany(MBranchProductionRest::class)
            ->orderby("started_at") ; 
            
    }

    
    public function toArray()
    {
        $array = parent::toArray();        
        if ( isset($array['production_start_at']) ){
            $dtStart = new DateTime($array['production_start_at']) ; 
            $array['production_start_at'] = $dtStart->format('H:i');
        
        }
        
        if ( isset($array['production_end_at']) ){
            $dtEnd = new DateTime($array['production_end_at']) ; 
            $array['production_end_at'] = $dtEnd->format('H:i');
            
        }
        return $array;
    }
    
}
