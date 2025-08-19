<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;


class TProjectConstructionResultCost extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];   
    
    // protected $unsetChildren = ["base64_preview" ] ;   
    protected $casts = [
        'value' => 'double' ,
    ] ;      

}
