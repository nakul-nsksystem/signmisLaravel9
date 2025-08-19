<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MMatrix extends BaseModel
{
    use SoftDeletes;
    //
    
    protected $childModels = 
        [
            "MMatrixDetails" =>  "App\Models\MMatrixDetail" ,
        ] ; 
    
    public function MMatrixDetails() : HasMany
    {
        return $this->hasMany('App\Models\MMatrixDetail')->orderBy("order_no");
    }
}
