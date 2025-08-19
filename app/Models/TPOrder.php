<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TPOrder extends BaseModel
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    // protected $with = array("PurchaseDetails") ; 
   
    protected $guarded = ['id', 'created_at', 'updated_at' , 'deleted_at'] ;

    protected $childModels = 
    [
        "TPOrderDetails" =>  "App\Models\TPOrderDetail" ,
    ] ; 

    protected $unsetChildren = ["m_branch" ,"supplier_m_customer" , "m_user","created_m_user","updated_m_user","is_unuse_mail","isTProject"] ; 


    public function TPOrderDetails() 
    {
        return $this->hasMany('App\Models\TPOrderDetail')
            ->orderby('id') ;
            // ->withTrashed();
    }
    
    public function SupplierMCustomer() 
    {
        return $this->belongsTo('App\Models\MCustomer', 'supplier_m_customer_id')
            ->orderby('id');
            // ->withTrashed();
    }

    public function MBranch() 
    {
        return $this->belongsTo('App\Models\MBranch', 'm_branch_id')
            ->orderby('id')
            ->withTrashed();
    }

    public function MUser() 
    {
        return $this->belongsTo('App\User', 'm_user_id')
            ->orderby('id')
            ->withTrashed();
    }
    

}
