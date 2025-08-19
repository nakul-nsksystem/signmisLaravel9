<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TPInvoiceDetail extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    protected $casts = [
        'qty'                   => 'double',
        'shipped_qty'           => 'double',
        'cost'                  => 'double',
        'price'                 => 'double',
        'total_price'           => 'double',
        'tax'                   => 'double',
        'tax_rate'              => 'double',
        'capacity'              => 'double',
        'material_size_x'       => 'double',
        'material_size_y'       => 'double',
    ] ;

    public function TPInvoice()
    {
        return $this->belongsTo('App\Models\TPInvoice') ;
    }

    public function TProject()
    {
        return $this->belongsTo('App\Models\TProject') ;
    }

    public function MMaterialDetail()
    {
        return $this->belongsTo('App\Models\MMaterialDetail') ;
    }
    public function TPOrderDetail()
    {
        return $this->belongsTo('App\Models\TPOrderDetail') ;
    }

    public function TIvtMaterial()
    {
        return $this->belongsTo('App\Models\TIvtMaterial') ;
    }

    // 仕入区分
    public function PurchaseMKv()
    {
        return $this->belongsTo('App\Models\MKv', 'purchase_m_kv_id');
    }

}
