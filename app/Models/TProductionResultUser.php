<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProductionResultUser extends BaseModel
{

    const UPDATED_AT = null;
    
    protected $guarded = ['id', 'created_at' ];

    protected $casts = [
        
    ];
    

    protected $childModels = 
        [
            //"TProductionResults" =>  "App\Models\TProductionResult" ,
        ] ; 

    protected $delInsChildModels = 
        [
            //"TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
        ] ; 

    
        

    public function TProductionResult()
    {
        return $this
            ->belongsTo('App\Models\TProductionResult' , "t_production_result_id")
            ->withTrashed();
    }
    

    

}
