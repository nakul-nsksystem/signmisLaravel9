<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MKvCategory extends BaseModel
{
    use SoftDeletes;
    
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    //
    protected $childModels = 
        [
            "MKvs" =>  "App\Models\MKv" ,
        ] ; 

    public function MKvs() 
    {
        return $this->hasMany('App\Models\MKv');
    }

}
