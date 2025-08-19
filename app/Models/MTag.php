<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MTag extends Model
{
    use SoftDeletes;
    protected $table = 'm_tags';

    protected $hidden = [
        'created_at',
        'updated_at',
        "deleted_at"
    ];
    
    protected $with = array("TagColorMKv") ; 

     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id' , 'created_at' , 'updated_at' , 'deleted_at'] ;

    public function MTagCategories() 
    {
        return $this->belongsTo('App\Models\MTagCategory')->orderby("order_no") ;
    }

    public function TagColorMKv() 
    {
        return $this->belongsTo('App\Models\MKv')->orderby("order_no") ;
    }

    
    
}


