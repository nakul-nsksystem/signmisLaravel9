<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\MProcesses ;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class MProductionExtTool extends BaseModel
{

    protected $guarded = ['id' , 'created_at', 'updated_at' ];

    
    public function MProductions() : HasMany
    {
        return $this->hasMany(MProduction::class);
    }


}
