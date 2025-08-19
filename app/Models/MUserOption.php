<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class MUserOption extends BaseModel
{
    protected $guarded = ['id' , 'created_at', 'updated_at' ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    
    protected $unsetChildren = [
        "sm_user_option" ,
        "m_user" ,
        "is_apply" ,
        "is_target_apply" ,
    ] ; 
    
    protected $appends = [
        'is_target_apply',
     ];
    public function getIsTargetApplyAttribute()
    {   
        $is = false ;
        if($this->target_value == "1") $is = true ;

        return $is ; 
    }


    public function SmUserOption()
    {
        return $this
            ->belongsTo('App\Models\SmUserOption',"sm_user_option_id") ;
            // ->withTrashed();
    }

    public function MUser()
    {
        return $this
            ->belongsTo('App\User' , "m_user_id")
            ->withTrashed();
    }

}
