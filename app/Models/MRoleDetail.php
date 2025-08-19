<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class MRoleDetail extends BaseModel
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
    
    public function MRoleKey() 
    {
        return $this->belongsTo('App\Models\MRoleKey','m_role_key_id');
    }


}
