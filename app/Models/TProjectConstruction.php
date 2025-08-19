<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProjectConstruction extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $appends = ['user_full_names' , "user_last_names"];
    
    protected $casts = [
        //'construction_at' => 'datetime',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ] ; 
    
    protected $childModels = 
    [
        "TProjectConstructionUsers" =>  "App\Models\TProjectConstructionUser" ,
        "TProjectConstructionResults" =>  "App\Models\TProjectConstructionResult" ,
    ] ; 


    protected $delInsChildModels = 
    [
        "TProjectConstructionUsers" =>  "App\Models\TProjectConstructionUser" ,
        "TProjectConstructionResults" =>  "App\Models\TProjectConstructionResult" ,
    ] ; 


    protected $unsetChildren = ["t_project" ,"user_full_names" ,"user_last_names"  ] ; 


    public function TProject()
    {
        return $this->belongsTo('App\Models\TProject');
    }

    public function TProjectConstructionUsers()
    {
        return $this->hasMany('App\Models\TProjectConstructionUser');
    }

    public function TProjectConstructionResults()
    {
        return $this->hasMany('App\Models\TProjectConstructionResult');
    }


    
    public function getUserLastNamesAttribute()
    {
        $mUserNames = [] ; 
        
        foreach ($this["TProjectConstructionUsers"] as $user)
        {
            
            if (! is_null($user["m_user_id"]))
            {
                // User
                $mUserNames[] = $user->MUser["last_name"]; 
            }
            else
            {
                // OutSource   
                $outsourceName = $user->OutSourceMCustomer["short_name_or_name"] ;              
                $mUserNames[] =  "{$outsourceName}({$user->num_of_out_source_people})" ; 
                
            }

        }
        
        return implode(',' , $mUserNames);
    }

    public function getUserFullNamesAttribute()
    {
        $mUserNames = [] ; 
        
        foreach ($this["TProjectConstructionUsers"] as $user)
        {
            
            if (! is_null($user["m_user_id"]))
            {
                // User
                $mUserNames[] = $user->MUser["full_name"]; 
            }
            else
            {
                // OutSource
                $outsourceName = $user->OutSourceMCustomer["short_name_or_name"] ; 
                $mUserNames[] =  "{$outsourceName}({$user->num_of_out_source_people})" ; 
                
            }

        }
        
        return implode(',' , $mUserNames);
    }

    

}
