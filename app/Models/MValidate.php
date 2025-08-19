<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MValidate extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    public function CateogryMKvs() 
    {
        return $this->belongsTo('App\Models\MKv', 'category_m_kv_id')
                    ->orderby('order_no');
    }

    public function SubCateogryMKvs() 
    {
        return $this->belongsTo('App\Models\MKv', 'sub_category_m_kv_id')
                    ->orderby('order_no');
    }
}
