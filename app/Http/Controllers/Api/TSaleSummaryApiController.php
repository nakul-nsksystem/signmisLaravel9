<?php

namespace App\Http\Controllers\Api;

use App\Models\TSale;
use App\Models\TSaleDetail;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TSaleSummaryApiController extends BaseApiController
{

    protected $filters = array(
        // 売上.id
        "id_from" => array(
            "operation" => ">="  ,
            "column"    => "t_sales.id" ,
        ) ,
        "id_to" => array(
            "operation" => "<="  ,
            "column"    => "t_sales.id" ,
        ) ,
        // 売上.売上日
        "shipped_at_from" => array(
            "operation" => ">="  ,
            "column"    => "t_sales.shipped_at" ,
        ) ,
        "shipped_at_to" => array(
            "operation" => "<="  ,
            "column"    => "t_sales.shipped_at" ,
        ) ,
        // 売上.拠点
        "m_branch_id" => array(
            "column"    => "t_sales.m_branch_id" ,
        ) ,
        // 売上.取引先
        "m_customer_id" => array(
            "column"    => "t_sales.m_customer_id" ,
        ) ,

        // 取引先・担当者
        "m_user_id" => array(
            "column"    => "t_projects.sales_m_user_id" ,
        ) ,
        
        // 売上明細・名称
        // "product_name" => array(
        //     "operation" => "like" ,
        //     "column"    => "t_sale_details.product_name" ,
        //     "prefix"  => "%" ,
        //     "postfix" => "%" ,
        // ) ,
    ) ;

    public function __construct()
    {
        // baseとなるmodelはt_saleにしてます
        $this->model = "App\Models\TSale";
    }

    public function retrieve4Summary(Request $req)
    {
        $res = $this->getFiltered($req)
            ->selectRaw("
                        t_sales.id AS t_sales_id,
                        t_sale_details.id AS t_sale_details_id,
                        t_sale_details.order_no AS order_no,
                        t_sales.shipped_at,
                        IFNULL(m_branches.short_name, m_branches.name) AS m_branches_name,
                        IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                        m_users.full_name AS m_users_full_name,
                        t_sale_details.product_name,
                        t_sale_details.qty,
                        m_kvs.kv_name AS unit_m_kv_name,
                        t_sale_details.price,
                        t_sale_details.total_price,
                        t_projects.id AS t_projects_id,
                        t_projects.cd AS t_projects_cd,
                        t_projects.name AS t_projects_name
                        ")

            // joinに論理削除の条件追加
            // 売上明細
            ->join('t_sale_details', function ($join) {
                $join->on('t_sale_details.t_sale_id', '=', 't_sales.id')
                     ->whereNull('t_sale_details.deleted_at');
            })
            // 拠点
            ->join('m_branches', function ($join) {
                $join->on('t_sales.m_branch_id', '=', 'm_branches.id')
                     ->whereNull('m_branches.deleted_at');
            })
            // 取引先
            ->join('m_customers', function ($join) {
                $join->on('t_sales.m_customer_id', '=', 'm_customers.id')
                     ->whereNull('m_customers.deleted_at');
            })
            // 物件
            ->leftJoin('t_projects', function ($join) {
                $join->on('t_sale_details.t_project_id', '=', 't_projects.id')
                     ->whereNull('t_projects.deleted_at');
            })
            // 担当者
            ->leftJoin('m_users', function ($join) {
                $join->on('t_projects.sales_m_user_id', '=', 'm_users.id')
                     ->whereNull('m_users.deleted_at');
            })
            // 単位(論理削除[deleted_at]は表示する)
            ->leftJoin('m_kvs', 't_sale_details.unit_m_kv_id', '=', 'm_kvs.id')

            // 請求時の消費税データは無視
            ->where('t_sales.slip_m_kv_id', '!=', '1160003')

            ->orderByRaw('t_sales.shipped_at, t_sale_details.t_sale_id, t_sale_details.order_no, t_sale_details.id')

            ->get() ;
            // ->toSql() ;

        return $res;
    }

}
