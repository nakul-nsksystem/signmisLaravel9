<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MKv extends BaseModel
{
    use SoftDeletes;

    protected $hidden = [
        "created_m_user_id" ,
        "updated_m_user_id" ,
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    //
}
