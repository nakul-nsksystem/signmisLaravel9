<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MTax extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;
}
