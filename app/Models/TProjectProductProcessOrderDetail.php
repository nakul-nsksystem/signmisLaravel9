<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProjectProductProcessOrderDetail extends BaseModel
{

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [
        
    ];
    

    protected $childModels = 
        [
        ] ; 

    protected $delInsChildModels = 
        [
            //"TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
        ] ; 

    
    
    public function TProjectProductProcess()
    {
        return $this
            ->belongsTo('App\Models\TProjectProductProcess' , "t_project_product_process_id")
            ->withTrashed();
    }
    
    public function TPOrderDetail()
    {
        return $this
            ->belongsTo('App\Models\TPOrderDetail' , "t_p_order_detail_id")
            ->withTrashed();
    }
}