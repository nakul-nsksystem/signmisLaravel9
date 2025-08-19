<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TIvtMaterialComplete extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at'] ;
    protected $casts = [ 
        'qty' => 'double',
        'price' => 'double',
        'total_price' => 'double',
    ] ;

    
    public function TIvtMaterial() 
    {
        return $this->belongsTo('App\Models\TPInvoiceDetail');
            // ->withTrashed();
    }

    public function MMaterialDetail() 
    {
        return $this->belongsTo('App\Models\MMaterialDetail');
            // ->withTrashed();
    }

}
