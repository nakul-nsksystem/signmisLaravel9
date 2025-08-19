<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProductionResultStop extends BaseModel
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
