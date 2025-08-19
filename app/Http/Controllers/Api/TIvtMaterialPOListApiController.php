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
use App\Consts\TIvtMaterialConst;

//入庫予定検索コントローラー
class TIvtMaterialPOListApiController extends BaseApiController
{
    protected $filters = array(
        //発注明細
        "po_material_name" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,
            "column" => "t_p_order_details.po_material_name" ,
        ) ,

        "m_material_detail_id" => array(
            "column" => "t_p_order_details.m_material_detail_id" ,
        ),

        "is_ivt_in" => array(
            "operation" => "ignore"  ,
        ) ,
        //発注
        "supplier_m_customer_id" => array(
            "column" => "t_p_orders.supplier_m_customer_id" ,
        ) ,

        "m_branch_id" => array(
            "column" => "t_p_orders.m_branch_id" ,
        ) ,

        // 発注日
        "order_date_from" => array(
            "operation" => ">="  ,
            "column" => "t_p_orders.order_date" ,
        ) ,
        "order_date_to" => array(
            "operation" => "<="  ,
            "column" => "t_p_orders.order_date" ,
        ) ,


        // 納期
        "due_date_from" => array(
            "operation" => ">="  ,
            "column" => "t_p_order_details.due_date" ,
        ) ,
        "due_date_to" => array(
            "operation" => "<="  ,
            "column" => "t_p_order_details.due_date" ,
        ) ,

        //材料
        "category_m_kv_id" => array(
            "column" => "m_materials.category_m_kv_id" ,
        ),
        "sub_category_m_kv_id" => array(
            "column" => "m_materials.sub_category_m_kv_id" ,
        ),
        "is_stocked" => array(
            "column" => "m_materials.is_stocked" ,
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

    public function retrieve(Request $req)
    {
        $reqAll = $req->all() ;
        $is_invoiced = $req["is_invoiced"] ;
        $is_ivt_in = $req["is_ivt_in"] ;

        $res = $this->getFiltered($req)
            ->with('TIvtMaterialIns')
            ->selectRaw(
                "
                t_p_order_details.id,
                t_p_order_details.t_p_order_id,
                t_p_order_details.m_material_detail_id,
                t_p_order_details.po_material_name,
                t_p_order_details.qty AS po_qty,
                t_p_order_details.price,
                t_p_order_details.total_price,
                t_p_order_details.due_date,
                t_p_orders.m_branch_id,
                t_p_orders.supplier_m_customer_id,
                t_p_orders.order_date,
                IFNULL(m_customers.short_name, m_customers.name) AS supplier_m_customer_name ,
                m_material_details.m_material_id,
                m_material_details.unit_m_kv_id,
                m_material_details.ivt_div_m_kv_id AS material_ivt_div_m_kv_id ,
                m_material_details.contents_qty AS material_contents_qty ,
                m_materials.is_stocked,
                CONCAT(IFNULL(m_materials.display_name, m_materials.name),m_material_details.detail_name) AS display_name ,
                m_materials.cd AS material_cd ,
                MAX(t_p_invoice_details.id) AS t_p_invoice_detail_id
                "
            )
            // 発注親
            ->join('t_p_orders', function ($join) {
                $join->on('t_p_order_details.t_p_order_id', '=', 't_p_orders.id')
                    ->whereNull('t_p_orders.deleted_at');
            })
            // 材料系
            ->join('m_material_details', function ($join) {
                $join->on('t_p_order_details.m_material_detail_id', '=', 'm_material_details.id')
                    ->whereNull('m_material_details.deleted_at');
            })
            ->join('m_materials', function ($join) {
                $join->on('m_material_details.m_material_id', '=', 'm_materials.id')
                    ->where('m_materials.is_stocked','1')
                    ->whereNull('m_materials.deleted_at');
            })
            // 取引先
            ->join('m_customers', function ($join) {
                $join->on('t_p_orders.supplier_m_customer_id', '=', 'm_customers.id')
                    ->whereNull('m_customers.deleted_at');
            })
            ->leftJoin('t_p_invoice_details', function ($join) {
                $join->on('t_p_order_details.id', '=', 't_p_invoice_details.t_p_order_detail_id')
                    ->whereNull('t_p_invoice_details.deleted_at');
            })
            ->leftJoin('t_ivt_materials', function ($join) {
                $join->on('t_p_order_details.id', '=', 't_ivt_materials.t_p_order_detail_id')
                    ->where('t_ivt_materials.ivt_m_kv_id', "=", TIvtMaterialConst::IVT_M_KV_ID_IN)
                    ->whereNull('t_ivt_materials.deleted_at');
            })
            ->when(!$is_ivt_in , function($q){
                $q->HavingRaw('t_p_order_details.qty > SUM(t_ivt_materials.qty) OR MAX(t_ivt_materials.id) IS NULL');
            })
            ->groupBy('t_p_order_details.id' )
            ->orderByRaw('t_p_orders.m_branch_id, m_material_details.m_material_id ,t_p_order_details.m_material_detail_id,t_p_order_details.due_date DESC ,t_p_orders.order_date DESC ' )
            // ->toSql() ;
            // log::debug($res) ;
            // dd($res) ;
            ->paginate() ;

        return $res;
    }

}
