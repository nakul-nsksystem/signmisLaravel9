<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TCompleteDetail extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    protected $casts = [
        'payment_price' => 'double',
    ] ;

    public function TComplete()
    {
        return $this->belongsTo('App\Models\TComplete') ;
    }

    public function MCustomer() 
    {
        return $this->belongsTo('App\Models\MCustomer', 'm_customer_id');
    }
    
    // 入金区分
    public function PaymentMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'payment_m_kv_id');
    }

}
