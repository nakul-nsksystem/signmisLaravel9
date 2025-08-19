<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class MRoleKeyCategory extends BaseModel
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
   
    protected $guarded = ['id', 'created_at', 'updated_at' , 'deleted_at'] ;

    protected $hidden = [
        'created_at',
        'updated_at',
        "deleted_at"
    ];
    
    public function MRoleKeys() 
    {
        return $this->hasMany('App\Models\MRoleKey')->orderby("order_no");
    }



}
