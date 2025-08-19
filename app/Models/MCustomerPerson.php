<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MCustomerPerson extends BaseModel
{
    use SoftDeletes;
    protected $table = 'm_customer_persons';

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at'];

    // protected $appends = ['kana_or_name', "short_name_or_name","display_address"];


    protected $unsetChildren = [
    ] ; 

    // 顧客
    public function MCustomer() 
    {
        return $this->belongsTo( MCustomer::class, 'm_customer_id');
    }

    

}
