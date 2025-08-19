<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TSaleProjectListApiController extends BaseApiController
{
    protected $filters = array(
        // 物件CD
        "cd" => array(
            "operation" => "like" ,
            "prefix"  => "%" ,
            "postfix" => "%" ,
            "column"    => "t_projects.cd" ,
        ) ,
        // 物件名
        "name" => array(
            "operation" => "like" ,
            "prefix"  => "%" ,
            "postfix" => "%" ,            
            "column"    => "t_projects.name" ,
        ) ,
        // 注文No.
        "customer_order_no" => array(
            "operation" => "like" ,
            "prefix"  => "%" ,
            "postfix" => "%" ,            
        ) ,
        // 拠点
        "m_branch_id" => array(
            "column"    => "t_projects.m_branch_id" ,
        ) ,
        // 客先担当
        "customer_user_name" => array(
            "operation" => "like" ,
            "prefix"  => "%" ,
            "postfix" => "%" ,            
        ) ,
        // 売上完了日
        "sales_completed_at" => array(
            "operation" => "is null"  ,
            "column"    => "t_projects.sales_completed_at" ,
        ) ,
        // 備考
        "memo" => array(
            "operation" => "like" ,
            "prefix"  => "%" ,
            "postfix" => "%" ,
            "column"    => "t_projects.memo" ,
        ) ,

        // 取引先
        "m_customer" => array(
            "operation" => "table" ,
            "relation_name" => "MCustomer" ,
            // 取引先名
            "name" => array(
                "operation" => "like" ,
                "prefix"  => "%" ,
                "postfix" => "%" ,
            ) ,
            // 締日
            "closing_date" => array() ,
        ) ,

        // 商品
        "t_project_product" => array(
            "operation" => "table" ,
            "relation_name" => "TProjectProducts" ,
            // 商品名
            "name" => array(
                "operation" => "like" ,
                "prefix"  => "%" ,
                "postfix" => "%" ,            
            ) ,
            // 売上完了日
            "sales_completed_at" => array(
                "operation" => "is null"  ,
                "column"    => "t_project_products.sales_completed_at" ,
            ) ,
        ) ,

        // 物件商品の最終納期(GroupBy句のWhere条件)
        "arrival_at_from" => array(
            // filterを無効にする
            "operation" => "ignore" ,
        ) ,
        "arrival_at_to" => array(
            // filterを無効にする
            "operation" => "ignore" ,
        ) ,

    ) ;
    
    public function __construct()
    {
        $this->model = "App\Models\TProject";
    }

    public function retrieve(Request $req)
    {
        // 物件商品：物件毎の商品合計金額
        $sub_query_t_project_products = DB::raw("(
            SELECT t_project_id, 
                   SUM(total_sell_price) AS total_sell_price,
                   COUNT(t_project_id) AS products_count
              FROM t_project_products 
             WHERE deleted_at IS NULL
             GROUP BY t_project_id
            ) AS q_project_products") ;

        // 物件納品：物件毎の最終納期(着日が入ってなければ納期[発送日])
        $sub_query_t_project_deliveries = DB::raw("(
            SELECT t_project_id, 
                   MAX(IFNULL(arrival_at, delivery_at)) AS arrival_at
              FROM t_project_deliveries 
             WHERE deleted_at IS NULL
             GROUP BY t_project_id
            ) AS q_project_deliveries") ;

        $res = $this->getFiltered($req)
            ->with(['TProjectProducts',])

            ->selectRaw("t_projects.id, 
                         t_projects.cd, 
                         t_projects.name, 
                         t_projects.m_branch_id,
                         t_projects.m_customer_id,
                         m_customers.delivery_format_m_kv_id,
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name, 
                         m_customers.kana, 
                         t_projects.customer_user_name, 
                         t_projects.customer_order_no,
                         t_projects.memo,
                         t_projects.delivery_fee,
                         q_project_deliveries.arrival_at AS arrival_at,
                         q_project_products.total_sell_price AS total_sell_price,
                         q_project_products.products_count AS products_count
                        ")

            ->join('m_customers', 't_projects.m_customer_id', '=', 'm_customers.id')
            // 集計結果をLEFT JOIN結合する必要があるのでこの書き方[DB::raw]にしてます
            ->leftJoin($sub_query_t_project_products  , 't_projects.id', '=', 'q_project_products.t_project_id'  )
            ->leftJoin($sub_query_t_project_deliveries, 't_projects.id', '=', 'q_project_deliveries.t_project_id')

            ->whereNotNull('ordered_at')

            ->when(isset($req->arrival_at_from), function($query) use ($req) {
                // 最終着日を指定した時のみ有効
                return $query->whereRaw('q_project_deliveries.arrival_at >= ?', [$req->arrival_at_from]);
            })
            ->when(isset($req->arrival_at_to), function($query) use ($req) {
                // 最終着日を指定した時のみ有効
                return $query->whereRaw('q_project_deliveries.arrival_at <= ?', [$req->arrival_at_to]);
            })

            ->orderByRaw($this->orderByClause($req, 'cd'))

            ->active()
            ->paginate(12) ;
                        
        return $res; 
    }

}
