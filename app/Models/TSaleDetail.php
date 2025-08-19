<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TSaleDetail extends BaseModel
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
        'product_size_x'        => 'double',
        'product_size_y'        => 'double',
    ] ;

    public function TSale()
    {
        return $this->belongsTo('App\Models\TSale') ;
    }

    public function TProject()
    {
        return $this->belongsTo('App\Models\TProject') ;
    }

    public function TProjectProduct()
    {
        return $this->belongsTo('App\Models\TProjectProduct') ;
    }

    // 単位区分
    public function UnitMKv()
    {
        return $this->belongsTo('App\Models\MKv', 'unit_m_kv_id');
    }

    // 売上区分
    public function ShipMKv()
    {
        return $this->belongsTo('App\Models\MKv', 'ship_m_kv_id');
    }

}
