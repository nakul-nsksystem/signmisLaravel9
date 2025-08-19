<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class MRole extends BaseModel
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
    
    protected $childModels = 
    [
        "MRoleDetails" =>  "App\Models\MRoleDetail" ,
    ] ; 

    protected $unsetChildren = ["m_role_details"] ; 
    
    public function users()
    {
        return $this->belongsToMany('App\User');
    }

    public function MRoleDetails() 
    {
        return $this->hasMany('App\Models\MRoleDetail');
    }
}
