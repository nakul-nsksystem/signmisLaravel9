<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class MCustomerInfo extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    // protected $appends = ['kana_or_name', "short_name_or_name","display_address"];


    protected $unsetChildren = [
        "category_m_kv"          ,
    ] ; 

    // 顧客
    public function MCustomer() 
    {
        return $this->belongsTo( MCustomer::class, 'm_customer_id');
    }

    public function CategoryMKv() 
    {
        return $this->belongsTo( MKv::class, 'category_m_kv_id');
    }
    

}
