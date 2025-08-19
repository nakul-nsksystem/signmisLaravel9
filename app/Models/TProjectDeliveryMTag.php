<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\SoftDeletes;

class TProjectDeliveryMTag extends BaseModel
{

    protected $guarded = ['id', 'created_at', 'updated_at' ];    

    protected $childModels = 
    [
    ] ; 

    protected $delInsChildModels = 
    [
    ] ; 

    
    
    public function TProjectDelivery()
    {
        return $this
            ->belongsTo('App\Models\TProjectDelivery' , "t_project_delivery_id");
    }
    
    public function MTag()
    {
        return $this
            ->belongsTo('App\Models\MTag' , "m_tag_id");
    }
}