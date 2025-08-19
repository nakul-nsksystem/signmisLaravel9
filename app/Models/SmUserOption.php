<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class SmUserOption extends BaseModel
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
            ->belongsTo('App\Models\MKv' , "key_m_kv_id")
            ->withTrashed();
    }

}
