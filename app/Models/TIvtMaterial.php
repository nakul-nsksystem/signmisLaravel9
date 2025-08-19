<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TIvtMaterial extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at'] ;
    protected $casts = [ 
        'qty' => 'double',
        'price' => 'double',
        'total_price' => 'double',
        'sum_qty' => 'double',
        'sum_total_price' => 'double',
        'm_material_unit_price' => 'double'
    ] ;

    protected $childModels = 
    [
        "TIvtMaterialComplete"  =>  "App\Models\TIvtMaterialComplete",
    ] ; 

    
    public function TPInvoiceDetail() 
    {
        return $this->belongsTo('App\Models\TPInvoiceDetail');
            // ->withTrashed();
    }
    public function TPOrderDetail() 
    {
        return $this->belongsTo('App\Models\TPOrderDetail');
            // ->withTrashed();
    }
    public function MMaterialDetail() 
    {
        return $this->belongsTo('App\Models\MMaterialDetail');
            // ->withTrashed();
    }

    public function TIvtMaterialComplete() 
    {
        return $this->belongsTo('App\Models\TIvtMaterialComplete','id','t_ivt_material_id');
    } 


    //最新の在庫締データ
    public function LatestTIvtMaterialComplete() 
    {
        return $this->hasMany('App\Models\TIvtMaterialComplete') ;
    }    

}
