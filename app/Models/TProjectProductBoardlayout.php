<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TProjectProductBoardlayout extends BaseModel
{
    //protected $unsetChildren = ["m_process_category"] ; 

    protected $guarded = ['id', 'created_at', 'updated_at'];
    //
    protected $casts = [
        'm_material_detail_id'   => 'int',        
        'w'     => 'double' ,
        'h'     => 'double' ,
        'qty'   => 'int'    ,
        'price' => 'double' ,         
    ];

    protected $unsetChildren = ["products" , "m_material_detail"] ; 
    
    
    public function MMaterialDetail() 
    {
        return $this
            ->belongsTo('App\Models\MMaterialDetail'); 
            
    }



}
