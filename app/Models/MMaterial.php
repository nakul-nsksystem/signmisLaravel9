<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class MMaterial extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    protected $childModels = [
        "MMaterialDetails" =>  "App\Models\MMaterialDetail" ,
    ] ; 

    protected $unsetChildren = [
        "branches"                  ,
        "suppliers"                 , 
        "category_m_kvs"            ,
        "sub_category_m_kvs"        ,
        "total_price_calc_m_kvs"    ,
        "tags"                      ,
        "tag_links"                 ,
    ] ;

    protected $casts = [
        'thickness'             => 'double',
        'weight'                => 'double',
        'is_stocked'                => 'bool',
    ] ;

    public function Supplier() 
    {
        return $this->belongsTo('App\Models\MCustomer', 'supplier_m_customer_id');
    }

    public function MBranch() 
    {
        return $this->belongsTo('App\Models\MBranch', 'm_branch_id');
    }

    public function CategoryMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'category_m_kv_id');
    }

    public function SubCategoryMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'sub_category_m_kv_id');
    }

    public function TotalPriceCalcMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'total_price_calc_m_kv_id');
    }

    // 資材タグ
    public function MTags() : MorphToMany
    {
        return $this->morphToMany('App\Models\MTag', 'm_tag_link')
                    ->orderBy("order_no");
    }
    
    // 材料明細データ
    public function MMaterialDetails()
    {
        return $this->hasMany('App\Models\MMaterialDetail')
                    ->orderByRaw('order_no, id');
    }

}
