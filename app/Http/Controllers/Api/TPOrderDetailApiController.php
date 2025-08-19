<?php

namespace App\Http\Controllers\Api;

use App\Models\TPOrderDetail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException ; 
use App\Exceptions\NotFoundErrorException ; 

class TPOrderDetailApiController extends BaseApiController
{
    protected $filters = array(

        "material_name" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,            
        ) ,
        "po_material_name" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,            
        ) ,
        "total_price" => array(
            "operation" => ">=" ,
        ) ,
        "approved" => array() ,    
        "not_in_ids" =>array(
            "operation" => "ignore"
        ) ,
        "t_project_product_process_id" => array(
            "operation" => "is null"  ,
            "column"    => "t_project_product_process_id" ,
        ) ,

        "m_material_detail_id" => array(
            "operation" => "is null"  ,
            "column"    => "m_material_detail_id" ,
        ),

        "m_material_detail" => array(
            "operation" => "table" ,
            "relation_name" => "MMaterialDetail" ,
            "m_material" => array(
                "operation" => "table" ,
                "relation_name" => "MMaterial" ,
                "category_m_kv_id" => array(),
                "id" => array(),                
            ),
        ),
        "t_project" => array(
            "operation" => "table" ,
            "relation_name" => "TProject" ,
            "name" => array(
                "operation" => "like"  ,
                "prefix" => "%" ,
                "postfix" => "%" , 
            ),
        ) ,
        "t_p_order" => array(
            "operation" => "table" ,
            "relation_name" => "TPOrder" ,
            
            "supplier_m_customer_id" => array() ,
            
            "m_branch_id" => array() ,

            "m_user_id" => array() ,   

            // 発注日     
            "order_date_from" => array(
                "operation" => ">="  ,
                "column" => "order_date" ,
            ) ,
            "order_date_to" => array(
                "operation" => "<="  ,
                "column" => "order_date" ,
            ) ,
            
        ) ,
    ) ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TPOrderDetail" ;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = $this->model
            ::with('TPOrder.MUser')
            ->with('TPOrder.SupplierMCustomer')
            ->with('TPOrder.MBranch')
            ->with('CreateUser')
            ->with('UnitMKv')
            ->with('MMaterialDetail.MMaterial.CategoryMKv')
            ->with('MMaterialDetail.MMaterial.SubCategoryMKv')
            ->with('TProject')
            ->get()
            ->sortBy("id") ;
        
        return $data->values()->all() ;
    }
    
    public function retrieveWithParent(Request $req)
    {
        $reqAll = $req->all() ; 

        $notInIds = null ;
        if (!empty($reqAll["not_in_ids"])) {
            $notInIds = $reqAll["not_in_ids"] ; 
        }
        $res = $this->getFiltered($req)->with(
            [
                "TPOrder.MBranch" ,
                "TPOrder.SupplierMCustomer" ,
                "TPOrder.MUser" ,
                "MMaterialDetail.MMaterial.CategoryMKv" ,
                "TProject" ,
                "UnitMKv"
            ])->orderBy('created_at')  ; 
        
        //既に紐づけ済の発注明細を取得しない
        if(! is_null($notInIds)) {

            $res->whereNotIn("id",$notInIds);

        }        
        return $res->paginate() ; 
    }

    // public function retrieve4Summary(Request $req)
    // {
    //     // log::debug($req) ;

    //     $res = $this->getFiltered($req)
    //                 ->with([
    //                     "TPOrder:id,m_branch_id,supplier_m_customer_id,order_date" ,
    //                     "TPOrder.MBranch:id,name,short_name" ,
    //                     "TPOrder.SupplierMCustomer:id,name,short_name,m_branch_id" ,
    //                     "TPOrder.SupplierMCustomer.MBranch:id,name,short_name" ,
    //                     "MMaterialDetail:id,m_material_id" ,
    //                     "MMaterialDetail.MMaterial" => function($q){$q->select('id','category_m_kv_id')->withTrashed();} ,
    //                     "MMaterialDetail.MMaterial.CategoryMKv:id,kv_name" ,
    //                     "TProjectProductProcesses:id,t_project_product_id",
    //                     "TProjectProductProcesses.TProjectProduct:id,t_project_id,name",
    //                     "TProjectProductProcesses.TProjectProduct.TProject:id,name,m_customer_id",
    //                     "TProjectProductProcesses.TProjectProduct.TProject.MCustomer:id,name",
    //                 ])
    //                 ->select(
    //                     'id',
    //                     't_p_order_id',
    //                     'm_material_detail_id',
    //                     'po_material_name',
    //                     'qty',
    //                     'price',
    //                     'total_price',
    //                     't_project_product_process_id',
    //                     't_project_construction_user_id'
    //                 )
    //                 // ->orderBy('order_date')
    //                 ->get()  ; 

    //     foreach ($res as &$r){
    //         $r->append('m_branch_name') ;
    //         $r->append('material_m_kv_name') ;
    //         $r->append('supplier_m_customer_name') ;
    //     }
        
    //     return $res ; 
    // }

    public function show($id)
    {
        $row = $this->model
            ::with('TPOrder.MUser')
            ->with('TPOrder.SupplierMCustomer')
            ->with('TPOrder.MBranch')
            ->with('CreateUser')
            ->with('MMaterialDetail.MMaterial')
            ->with('UnitMKv')
            ->with('TProject')
            ->find($id) ;
        
            if (! $row) {
                $error = new NotFoundErrorException() ; 
                throw $error ; 
            }
    
            return $row ; 
    }


/**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request , $id)
    {
        $row = $this->model::find($id);

        
        //Log::debug($row); 
        
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        
        $this->saveRow($request , $row )   ; 
        //return $this->show($row["id"]) ;

        //$test =$this->show($row["id"] );  
        $updated = $this->model::where("id" , $id)->get();
        return $updated ;

    }
    

    protected function saveRow($request , $row )
    {

        $trimedRow = $request->all() ; 
        
        unset($trimedRow["t_p_order"]) ; 
        unset($trimedRow["create_user"]) ; 
        unset($trimedRow["m_material_detail"]) ; 
        unset($trimedRow["t_project"]) ;
        unset($trimedRow["unit_m_kv"]) ; 
        
        DB::beginTransaction();

        $row->fill($trimedRow);
        
        try {
            $row->save();
        } catch (\Exception $e) { 
            $this->throwDbError($e) ; 
        }

        DB::commit();

    }
    
}
