<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MBranchProductionRest extends BaseModel
{
    use SoftDeletes ; 
    
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function toArray()
    {
        $array = parent::toArray();
        if ( isset($array['started_at'])){
            $dtStart = new DateTime($array['started_at']) ; 
            $array['started_at'] = $dtStart->format('H:i');
        }

        if ( isset($array['ended_at'])){                
            $dtEnd = new DateTime($array['ended_at']) ; 
            $array['ended_at'] = $dtEnd->format('H:i');
            
        }
        return $array;
    }
}
