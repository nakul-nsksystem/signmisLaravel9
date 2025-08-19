<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MProcessLabel extends BaseModel
{

    protected $guarded = ['id' , 'created_at', 'updated_at'];
    //

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    protected $casts = [
        'is_not' => 'bool',
    ];
}
