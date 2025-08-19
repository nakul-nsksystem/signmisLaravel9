<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SmOption extends BaseModel
{
    //
    
    protected $guarded = ['id' , 'created_at', 'updated_at' ];


    protected $hidden = [
        'created_at',
        'updated_at',
    ];


    public function KeyMKv()
    {
        return $this
            ->belongsTo(MKv::class , "key_m_kv_id")
            ->withTrashed();
    }

}
