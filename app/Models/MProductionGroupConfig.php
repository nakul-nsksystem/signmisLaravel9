<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class MProductionGroupConfig extends BaseModel
{

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [
        'day' => 'date',
    ];
    
    
    

}
