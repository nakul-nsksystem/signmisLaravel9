<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Support\Facades\Log;

use App\Consts\TIvtMaterialConst;

class TPOrderDetail extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id' , 'created_at' , 'updated_at' , 'deleted_at'];

    protected $unsetChildren = [
        "size" ,
        "unit_m_kv" , 
        "cd" ,
        "is_able_to_input_size",
        "is_able_to_input_price" ,
        "m_material_detail",
        "t_p_invoice_details",
        "t_project" ,
        "t_project_product_process_id",
        "t_project_product_process_order_detail" ,
        "material_display_name"
    ]  ; 


    protected $syncPivotModels = 
    [
        "TProjectProductProcesses" => 
            [
                "modelClass" => TProjectProductProcessOrderDetail::class , 
                "pivotName" => "t_project_product_process_order_detail" ,
                "foreignKey" => "t_p_order_detail_id" ,
                // "isSaveSelf" => fa ,
                // "selfModel" => TProjectProductProcess::class , 

            ] ,
        
    ] ; 


    //集計用拠点名
    public function getMBranchNameAttribute()
    {
        if(!isset($this->TPOrder->MBranch)) return "" ;

        return $this->TPOrder->MBranch['shortNameOrName'] ;
        
    }

    //集計用拠点名
    public function getMaterialMKvNameAttribute()
    {
        if(!isset($this['m_material_detail_id'])) return "マスタ未登録" ;

        return $this->MMaterialDetail->MMaterial->CategoryMKv['kv_name'] ;
        
    }

    public function getSupplierMCustomerNameAttribute()
    {
        if(!isset($this->TPOrder->SupplierMCustomer)) return "" ;
        $supBranch =  $this->TPOrder->SupplierMCustomer->MBranch['shortNameOrName'] ;
        $supName = $this->TPOrder->SupplierMCustomer['short_name_or_name'] ;
        $res = "{$supBranch} - {$supName}" ; 

        return $res  ;
        
    }
    // protected $appends = ['display_matetrial_name'];
    // public function getDisplayMatetrialNameAttribute()
    // {   
    //     if (! is_null($this["m_material_detail_id"]))
    //     {
    //         return $this["MMaterialDetail"]["MMaterial"]["display_name"] . $this["MMaterialDetail"]["detail_name"] ;
    //     }
    //     else 
    //     {
    //         return $this["material_name"] ;
    //     }      
        
    // }   

    // The attributes that should be casted to native types.
    protected $casts = [
        'qty'                   => 'double',
        'invoice_qty'           => 'double',
        'remaining_qty'         => 'double',
        'price'                 => 'double',
        'total_price'           => 'double',
        'capacity'              => 'double',
        'material_size_x'       => 'double',
        'material_size_y'       => 'double',
        'po_qty'                => 'double'
    ];

    public function TPOrder() 
    {
        return $this->belongsTo('App\Models\TPOrder','t_p_order_id')
                    ->orderby('id');

    }

    public function MMaterialDetail() 
    {
        return $this->belongsTo('App\Models\MMaterialDetail' , 'm_material_detail_id')
                    ->orderby("id")
                    ->withTrashed();
    }

    public function CreateUser()
    {
        return $this->belongsTo('App\User' , 'created_m_user_id')
                    ->withTrashed();
            
    }

    public function TProject()
    {
        return $this->belongsTo('App\Models\TProject' , 't_project_id')
                    ->withTrashed();
    }

    // public function TProjectProductProcess()
    // {
    //     return $this->belongsTo('App\Models\TProjectProductProcess' , 't_project_product_process_id')
    //                 ->withTrashed();
    // }

    public function TProjectProductProcesses()
    {

        return $this
            ->belongsToMany('App\Models\TProjectProductProcess' ,'App\Models\TProjectProductProcessOrderDetail' )                
            ->as("t_project_product_process_order_detail")
            // ->withTimestamps()
            ->withPivot(['id' ,'order_no' , 'is_preceding']) ;
            // ->orderBy("order_no") ;

            //
    }
    
    public function UnitMKv()
    {
        return $this->belongsTo('App\Models\MKv' , 'unit_m_kv_id');
    }

    public function TPInvoiceDetails(){
        return $this->hasMany('App\Models\TPInvoiceDetail')
                    ->orderby('id');
    }
    
    public function TIvtMaterials(){
        return $this->hasMany('App\Models\TIvtMaterial');
    }

    //在庫入庫データのみ
    public function TIvtMaterialIns(){
        return $this->hasMany('App\Models\TIvtMaterial')
                    ->where('ivt_m_kv_id',TIvtMaterialConst::IVT_M_KV_ID_IN)
                    ->orderBy('conducted_at','desc');
    }
}
