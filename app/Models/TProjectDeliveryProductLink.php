<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\SoftDeletes;

class TProjectDeliveryProductLink extends BaseModel
{

    protected $guarded = ['id', 'created_at' ];    

    protected $childModels = 
    [
    ] ; 

    protected $delInsChildModels = 
    [
    ] ; 

    protected $casts = [
        'qty'    => 'double',
    ];

    
    
    public function TProjectDelivery()
    {
        return $this
            ->belongsTo('App\Models\TProjectDelivery' , "t_project_delivery_id");
    }
    
    public function TProjectProduct()
    {
        return $this
            ->belongsTo('App\Models\TProjectProduct' , "t_project_product_id");
    }
}