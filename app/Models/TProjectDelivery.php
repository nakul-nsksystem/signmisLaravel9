<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphToMany;


use Illuminate\Support\Facades\Log;


class TProjectDelivery extends BaseModel
{
    use SoftDeletes;
    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $unsetChildren = [
        "delivery_m_kv" ,
        "delivery_m_customer",
        "delivery_owner_m_customer",
        "is_delivery_completed",
        "mailFlg" ,
        "m_branch",
        "mailed_m_user",
        "t_project" ,
        "user_full_names" ,
        "user_last_names"
        ] ; 
    
    protected $syncPivotModels = 
    [
        "MTags" => 
            [
                "modelClass" => TProjectDeliveryMTag::class , 
                "pivotName"  => "t_project_delivery_m_tag" , 
                "foreignKey" => "t_project_delivery_id" , 
            ] ,

        "TProjectProducts" => 
            [
                "modelClass" => TProjectDeliveryProductLink::class , 
                "pivotName"  => "t_project_delivery_product_link" , 
                "foreignKey" => "t_project_delivery_id" , 
            ] ,
        
    ] ; 

    protected $childModels = 
    [
        // "TProjectConstructionUsers" =>  "App\Models\TProjectConstructionUser" ,
        "TProjectConstructionResults" =>  "App\Models\TProjectConstructionResult" ,
    ] ; 


    protected $delInsChildModels = 
    [
        // "TProjectConstructionUsers" =>  "App\Models\TProjectConstructionUser" ,
        // "TProjectConstructionResults" =>  "App\Models\TProjectConstructionResult" ,
    ] ; 

    protected $casts = [
        //'construction_at' => 'datetime',
        'construction_start_time' => 'datetime:H:i',
        'construction_end_time' => 'datetime:H:i',
    ] ; 

    protected $appends = ['user_full_names' , "user_last_names","is_delivery_completed"];


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

    public function getIsDeliveryCompletedAttribute()
    {   
        return isset($this["delivery_completed_at"]) ; 

        $isCompleted = false ;
        if($this->DeliveryMKv['g_01'] == 'construction') {
            
            if(!empty($this->TProjectConstructionResults)) {
                $isCompleted = true ; 
            }

        } 
        else {
            $isCompleted = isset($this["delivery_completed_at"]) ; 

        }
        
        return $isCompleted ;
    }


    //表示する取引先担当者名
    // public function getDisplayCustomerUserNameAttribute() 
    // {   
    //     $name = $this->TProject["is_input_customer_user"] ? $this->TProject["customer_user_name"] : $this->TProject->MCustomerPerson["name"] ;
    //     return $name ?? "" ;
    // }

    // //表示する取引先担当者メール
    // public function getDisplayDeliveryMailAttribute() 
    // {
    //     $email = $this->TProject["is_input_customer_user"] ? $this->TProject["delivery_mail_to"] : $this->TProject->MCustomerPerson["email"] ;
    //     return $email ?? "" ;
    // }

    //集計用拠点名
    public function getMBranchNameAttribute()
    {
        if($this->DeliveryMKv['g_01'] == 'construction' && !empty($this->TProjectConstructionUsers)) {
            // $arr = array() ;
            // foreach($this->TProjectConstructionUsers as $user) {
            //     if(isset($user['m_user_id'])) {
            //         array_push($arr,$user->MUser->MBranch['short_name']);
            //     }
            //     else {
            //         array_push($arr,$user->OutsourceMCustomer->MBranch['short_name']);
            //     }
            // }            
            // return implode(',' ,  array_unique($arr));
            if(!isset($this->TProject->MBranch)) return "" ;

            return $this->TProject->MBranch['shortNameOrName'] ;
        } 
        else {
            if(!isset($this['m_branch_id']) || !isset($this->MBranch)) return "" ;
            return $this->MBranch['shortNameOrName'] ; 
        }
        
    }


    //集計用形態名
    public function getDeliveryMKvNameAttribute()
    {
        if(!isset($this->DeliveryMKv)) return "" ;
        return $this->DeliveryMKv['kv_name'] ;
    }

    //

    // public function getDeliveryProductNamesAttribute()
    // {
    //     $tProductNames = [] ; 
        
    //     foreach ($this["TProjectProducts"] as $product)
    //     {
            
    //         if (! $product["is_partical_delivery"])
    //         {
    //             // User
    //             $tProductNames[] = $product["name"]; 
    //         }
    //         else
    //         {
    //             // OutSource
    //             $name = $product["name"] ; 
    //             $qty = $product->TProjectDeliveryProductLink["qty"] ?? $product["qty"]; 
    //             $tProductNames[] =  "{$name}({$qty})" ; 
                
    //         }

    //     }
        
    //     return implode(',' , $tProductNames);
    // }



    // public function TProject()
    // {
    //     return $this->belongsTo('App\Models\TProject');
    // }
    public function DeliveryMKv()
    {
        return $this->belongsTo('App\Models\MKv' ,"delivery_m_kv_id");
    }
    public function DeliveryMCustomer()
    {
        return $this->belongsTo('App\Models\MCustomer' ,"delivery_m_customer_id");
    }
    public function DeliveryOwnerMCustomer()
    {
        return $this->belongsTo('App\Models\MCustomer' ,"delivery_owner_m_customer_id");
    }
    public function MTags()
    {
        return $this
            ->belongsToMany('App\Models\MTag' ,'App\Models\TProjectDeliveryMTag' )                
            ->as("t_project_delivery_m_tag")
            ->withPivot(['id']);

    }
    public function TProject() 
    {
        return $this->belongsTo('App\Models\TProject' ,"t_project_id") 
                    ->withTrashed();
    }

    public function TProjectConstructionUsers()
    {
        return $this->hasMany('App\Models\TProjectConstructionUser');
    }

    public function TProjectConstructionResults()
    {
        return $this->hasMany('App\Models\TProjectConstructionResult');
    }

    public function MBranch()
    {
        return $this->belongsTo('App\Models\MBranch');
    }

    
    public function TProjectProducts()
    {
        return $this
            ->belongsToMany('App\Models\TProjectProduct' ,'App\Models\TProjectDeliveryProductLink' )
            ->as("t_project_delivery_product_link") 
            ->withPivot(['qty']);

    }


}
