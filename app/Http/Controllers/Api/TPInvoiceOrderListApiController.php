<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TPInvoiceOrderListApiController extends BaseApiController
{
    protected $filters = array(
        // 発注id
        "order_id_from" => array(
            "operation" => ">="  ,
            "column"    => "t_p_order_id" ,
        ) ,
        "order_id_to" => array(
            "operation" => "<="  ,
            "column"    => "t_p_order_id" ,
        ) ,
        // 名称
        "material_name" => array(
            "operation" => "like" ,
            "prefix"  => "%" ,
            "postfix" => "%" ,
        ) ,
        // 備考
        "slip_memo" => array(
            "operation" => "like" ,
            "prefix"  => "%" ,
            "postfix" => "%" ,
            "column"    => "t_p_order_details.slip_memo" ,
        ) ,
        // 仕入予定日
        "due_date_from" => array(
            "operation" => ">="  ,
            "column"    => "due_date" ,
        ) ,
        "due_date_to" => array(
            "operation" => "<="  ,
            "column"    => "due_date" ,
        ) ,
        // 仕入完了日
        "purchase_completed_at" => array(
            "operation" => "is null"  ,
            "column"    => "purchase_completed_at" ,
        ) ,

        // 発注
        "t_p_order" => array(
            "operation" => "table" ,
            "relation_name" => "TPOrder" ,
            // 発注日
            "order_date_from" => array(
                "operation" => ">="  ,
                "column"    => "order_date" ,
            ) ,
            "order_date_to" => array(
                "operation" => "<="  ,
                "column"    => "order_date" ,
            ) ,
            // 拠点
            "m_branch_id" => array() ,
            // 仕入先
            "supplier_m_customer_id" => array() ,
        ) ,

        // 材料明細
        "m_material_detail" => array(
            "operation" => "table" ,
            "relation_name" => "MMaterialDetail" ,

            // 材料
            "m_material" => array(
                "operation" => "table" ,
                "relation_name" => "MMaterial" ,
                // カテゴリ
                "category_m_kv_id" => array() ,
                // サブカテゴリ
                "sub_category_m_kv_id" => array() ,
            ) ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TPOrderDetail";
    }

    public function retrieve(Request $req)
    {
        // 発注№毎の仕入数合計
        $t_p_invoice_details = DB::table('t_p_invoice_details')
            ->selectRaw('t_p_order_detail_id, SUM(qty) AS qty')
            ->whereNull('deleted_at')
            ->groupBy('t_p_order_detail_id') ;

        // 発注本体
        $res = $this->getFiltered($req)
            ->selectRaw("CONCAT(LPAD(t_p_order_details.t_p_order_id, 10, '0'), '-', LPAD(t_p_order_details.id, 10, '0')) AS slip_no,
                         t_p_order_details.t_p_order_id,
                         t_p_order_details.id,
                         t_p_orders.m_branch_id,
                         t_p_orders.supplier_m_customer_id,
                         m_customers.kana,
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                         t_p_order_details.due_date,
                         t_p_order_details.m_material_detail_id,
                         t_p_order_details.material_name,
                         t_p_order_details.unit_m_kv_id,
                         t_p_order_details.qty,
                         IFNULL(t_p_invoice_details.qty, 0) AS invoice_qty,
                         t_p_order_details.qty - IFNULL(t_p_invoice_details.qty, 0) AS remaining_qty,
                         t_p_order_details.price,
                         t_p_order_details.total_price,
                         t_p_order_details.total_price,
                         m_material_details.capacity,
                         t_p_order_details.material_size_x,
                         t_p_order_details.material_size_y,
                         t_p_order_details.t_project_id,
                         t_p_order_details.slip_memo")

            ->join('t_p_orders', 't_p_order_details.t_p_order_id', '=', 't_p_orders.id')
            ->join('m_customers', 't_p_orders.supplier_m_customer_id', '=', 'm_customers.id')
            ->leftJoin('m_material_details', 't_p_order_details.m_material_detail_id', '=', 'm_material_details.id')

            ->leftJoinSub($t_p_invoice_details, 't_p_invoice_details', function ($join) {
                $join->on('t_p_order_details.id', '=', 't_p_invoice_details.t_p_order_detail_id') ;
            })

            ->orderByRaw($this->orderByClause($req, 't_p_order_id DESC, id DESC'))
            ->paginate(20) ;


        return $res;
    }

}
