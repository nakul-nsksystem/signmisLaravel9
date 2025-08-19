<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MTagCategory extends BaseModel
{
    use SoftDeletes;
    //
    protected $table = 'm_tag_categories';


    protected $hidden = [
        'created_at',
        'updated_at',
        "deleted_at"
    ];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */


    protected $guarded = ['id' , 'created_at', 'updated_at' ,'deleted_at'];

    public function MTags() 
    {
        return $this->hasMany('App\Models\MTag')->orderby("order_no");
    }
    
}
