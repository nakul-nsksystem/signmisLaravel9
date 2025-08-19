<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;


class MRoleUser extends pivot
{
    //use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $incrementing = true;
    protected $guarded = ['id', 'created_at', 'updated_at' , 'deleted_at'] ;

    
    protected $hidden = [
        'created_at',
        'updated_at',
        "deleted_at"
    ];
}
