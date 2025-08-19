<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TComplete extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    protected $childModels = 
    [
        "TCompleteDetails" => "App\Models\TCompleteDetail",
    ] ; 

    protected $casts = [
        'carry_over'            => 'double',
        'total_price'           => 'double',
        'total_price_normal'    => 'double',
        'total_price_reduced'   => 'double',
        'total_price_include'   => 'double',
        'price_discount'        => 'double',
        'tax'                   => 'double',
        'tax_normal'            => 'double',
        'tax_reduced'           => 'double',
        'payment_price'         => 'double',
        'grand_total'           => 'double',
        'sub_total'             => 'double',
    ] ;
    
    public function TCompleteDetails()
    {
        return $this->hasMany('App\Models\TCompleteDetail')
                    ->orderby('id');
    }

    public function MBranch() 
    {
        return $this->belongsTo('App\Models\MBranch', 'm_branch_id');
    }

    public function MCustomer() 
    {
        return $this->belongsTo('App\Models\MCustomer', 'm_customer_id') ;
    }

    public function TCompletes() 
    {
        // 請求日ごとの内容を取得したかったので自身を参照するModel追加
        // 呼出先のwhere関数[Eager load]で拠点('m_branch_id') 取引区分('dealing_m_kv_id', '1010001' or '1010002')の条件を追加する事
        return $this->hasMany(self::class, 'complete_day', 'complete_day') ;
    }

}
