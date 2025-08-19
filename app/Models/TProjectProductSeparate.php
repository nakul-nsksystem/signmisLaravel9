<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TProjectProductSeparate extends BaseModel
{
    //protected $unsetChildren = ["m_process_category"] ; 

    protected $guarded = ['id', 'created_at', 'updated_at'];
    //
    protected $casts = [
        'is_w'   => 'bool',        
        'pos'    => 'double',
        
    ];
    



}
