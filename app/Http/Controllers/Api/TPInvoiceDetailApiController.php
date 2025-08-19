<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TPInvoiceDetailApiController extends BaseApiController
{

    protected $filters = array(

        //材料明細id
        "m_material_detail_id" => array() ,
        //仕入区分
        "purchase_m_kv_id" => array() ,

        "purchase_date_from" => array(
            "operation" => ">="  ,
            "column"    => "t_p_invoices.purchase_date" ,
        ) ,
        "purchase_date_to" => array(
            "operation" => "<="  ,
            "column"    => "t_p_invoices.purchase_date" ,
        ) ,
        // 拠点
        "m_branch_id" => array(
            "column"    => "t_p_invoices.m_branch_id" ,
        ) ,
        // 仕入先
        "supplier_m_customer_id" => array(
            "column"    => "t_p_invoices.supplier_m_customer_id" ,
        ) ,
        "m_material_id" => array(
            "column" => "m_materials.id"
        ) ,
        "category_m_kv_ids" => array(
            "operation" => "in" ,
            "column" => "m_materials.category_m_kv_id"
        ) ,

    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TPInvoiceDetail";
    }


    public function retrieve4Summary(Request $req)
    {
        $reqAll = $req->all() ;

        $res = $this->getFiltered($req)
                    ->selectRaw(
                        "t_p_invoice_details.id,
                         t_p_invoice_details.order_no,
                         t_p_invoice_details.t_p_invoice_id,
                         t_p_invoice_details.m_material_detail_id,
                         t_p_invoice_details.unit_m_kv_id,
                         t_p_invoice_details.purchase_m_kv_id,
                         t_p_invoice_details.material_name,
                         t_p_invoice_details.material_size_x,
                         t_p_invoice_details.material_size_y,
                         t_p_invoice_details.qty,
                         t_p_invoice_details.price,
                         t_p_invoice_details.total_price,
                         t_p_invoices.purchase_date,
                         IFNULL(category_m_kv.kv_name, 'マスタ未登録') AS material_m_kv_name,
                         IFNULL(m_branches.short_name, m_branches.name) AS m_branch_name,
                         CONCAT(IFNULL(m_branches.short_name, m_branches.name),' - ',IFNULL(m_customers.short_name, m_customers.name)) AS supplier_m_customer_name,
                         IFNULL(accounts_title_m_kv.kv_name, ' ') AS accounts_title_m_kv_name,
                         t_projects.id AS t_projects_id,
                         t_projects.cd AS t_projects_cd,
                         t_projects.name AS t_projects_name,
                         t_p_order_details.id AS t_p_order_details_id,
                         t_p_order_details.t_p_order_id AS t_p_orders_id
                         "
                    )
                    ->join('t_p_invoices', 't_p_invoice_details.t_p_invoice_id', '=', 't_p_invoices.id')
                    // 拠点
                    ->join('m_branches', function ($join) {
                        $join->on('t_p_invoices.m_branch_id', '=', 'm_branches.id')
                            ->whereNull('m_branches.deleted_at');
                    })
                    // 取引先
                    ->join('m_customers', function ($join) {
                        $join->on('t_p_invoices.supplier_m_customer_id', '=', 'm_customers.id')
                            ->whereNull('m_customers.deleted_at');
                    })
                    // 物件
                    ->leftJoin('t_projects', function ($join) {
                        $join->on('t_p_invoice_details.t_project_id', '=', 't_projects.id')
                            ->whereNull('t_projects.deleted_at');
                    })
                    ->leftJoin('m_material_details', 't_p_invoice_details.m_material_detail_id', '=', 'm_material_details.id')
                    ->leftJoin('m_materials', 'm_material_details.m_material_id', '=', 'm_materials.id')
                    ->leftJoin('t_p_order_details', 't_p_invoice_details.t_p_order_detail_id', '=', 't_p_order_details.id')
                    ->leftJoin('m_kvs as category_m_kv', 'm_materials.category_m_kv_id', '=', 'category_m_kv.id')
                    ->leftJoin('m_kvs as accounts_title_m_kv', 'm_customers.accounts_title_m_kv_id', '=', 'accounts_title_m_kv.id')
                    ->orderByRaw("t_p_invoices.purchase_date ,t_p_invoice_details.t_p_invoice_id ,t_p_invoice_details.order_no ,t_p_invoice_details.id")
                    ->get() ;
                    
        return $res ;
    }

}
