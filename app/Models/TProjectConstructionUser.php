<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TProjectConstructionUser extends BaseModel
{

    protected $guarded = ['id', 'created_at','updated_at'];


    protected $casts = [
        'num_of_out_source_people' => 'int' , 
        'out_source_price'   => 'double',
        'out_source_total_price'   => 'double',
    ] ;
    protected $childModels = 
    [
        "TPOrderDetail" =>  "App\Models\TPOrderDetail" ,
    ] ; 


    //protected $with = ['MUser:id,cd,order_no,last_name,first_name,full_name,m_branch_id'];
    protected $unsetChildren = ["m_user" ,"out_source_m_customer"] ; 

    public function TProjectDelivery()
    {
        return $this->belongsTo('App\Models\TProjectDelivery');
    }

    public function MUser()
    {
        return $this
            ->belongsTo('App\User' ,'m_user_id' ,'id')
            ->withTrashed();
    }

    public function OutSourceMCustomer()
    {
        return $this
            ->belongsTo('App\Models\MCustomer')
            ->withTrashed();
            
    }

    public function TPOrderDetail()
    {
        // return $this->belongsTo('App\Models\TPOrderDetail') ;
        return $this->hasOne('App\Models\TPOrderDetail','t_project_construction_user_id') ;
    }

}
