<?php

namespace App\Http\Controllers\Api;

use App\Models\MMaterialDetail;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use App\Http\Controllers\Api\Traits\CsvExportTrait;

class MMaterialDetailApiController extends BaseApiController
{
    use CsvExportTrait ;

    protected $filters = array(
        // 材料明細.詳細名
        "detail_name" => array(
            "operation" => "raw_like" ,
            "sql_expression" => "replace(detail_name, ',', '') like ? " ,
            "prefix" => "%" ,
            "postfix" => "%" ,
        ) ,
        // 材料明細.用途・説明
        "description" => array(
            "operation" => "like" ,
            "prefix" => "%" ,
            "postfix" => "%" ,            
        ) ,

        // 材料
        "m_material" => array(
            "operation" => "table" ,
            "relation_name" => "MMaterial" ,

            // 材料.cd
            "cd" => array(
                "operation" => "like" ,
                "postfix" => "%" ,            
            ) ,
            // 材料.名称
            "name" => array(
                "operation" => "like" ,
                "prefix" => "%" ,
                "postfix" => "%" ,            
            ) ,
            // 材料.通称
            "display_name" => array(
                "operation" => "like" ,
                "prefix" => "%" ,
                "postfix" => "%" ,            
            ) ,
            // 材料.拠点
            "m_branch_id" => array() ,
            // 材料.仕入先
            "supplier_m_customer_id" => array() ,
            // 材料.カテゴリ
            "category_m_kv_id" => array() ,
            // 材料.サブカテゴリ
            "sub_category_m_kv_id" => array() ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\MMaterialDetail" ;
    }

    public function index()
    {
        $data = $this->model
            ::orderBy('cd')
            ->get() ;

        return $data ;
    }

    // マスタ検索用
    public function retrieveWithParent(Request $req)
    {
        $res = $this->getFiltered($req)
            ->selectRaw("m_material_details.id,
                         m_material_details.m_material_id,
                         m_materials.cd, 
                         m_materials.name, 
                         m_material_details.detail_name, 
                         m_materials.display_name, 
                         m_materials.supplier_m_customer_id, 
                         kv1.kv_name,
                         m_materials.m_branch_id, 
                         m_branches.short_name AS m_branches_short_name, 
                         m_customers.kana, 
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                         m_material_details.description,
                         m_material_details.min_order_qty,
                         m_material_details.unit_price,
                         m_material_details.cost_price,
                         m_material_details.capacity,
                         m_material_details.width,
                         m_material_details.height,
                         m_material_details.unit_m_kv_id,
                         m_material_details.updated_at,
                         m_material_details.tax_m_kv_id,
                         kv2.g_01 AS tax_rate")

            ->join('m_materials', 'm_material_details.m_material_id', '=', 'm_materials.id')
            ->join('m_branches', 'm_materials.m_branch_id', '=', 'm_branches.id')
            ->join('m_customers', 'm_materials.supplier_m_customer_id', '=', 'm_customers.id')
            ->join('m_kvs AS kv1', 'm_materials.sub_category_m_kv_id', '=', 'kv1.id')
            ->join('m_kvs AS kv2', 'm_material_details.tax_m_kv_id', '=', 'kv2.id')
            
            // 並び替え：材料は他と違って並び替えが複雑
            // 1.サブカテゴリ 2.材料名 3.明細順序(detail.order_no)
            // 名称とか被ることあるので内部的にcdかidをorder by listに組み込んでソートが一意に識別されるようにしてます
            ->orderByRaw($this->orderByClause($req, 'kv1.m_kv_category_id, kv1.order_no, m_materials.name, m_materials.cd, m_material_details.order_no, m_material_details.id'))
            ->paginate(12) ;

        return $res;
    }

    // QR発注用・在庫用
    public function showWithParent($id,$isIvt = null)
    {   
        $row = $this->model
            ::with('MMaterial.Supplier')
            ->with('MMaterial.MBranch')
            ->with('MMaterial.CategoryMKv')
            ->with('MMaterial.SubCategoryMKv') 
            ->with('UnitMKv') 
            ->when(isset($isIvt),function($q){
                $q->whereHas('MMaterial' ,function($query){
                    $query->where('is_stocked' , '1');
                }) ;
            })       
            ->find($id) ;
            
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        return $row ; 
    }  

    public function findByMMaterialId($mMaterialId)
    {
        $data = $this->model::where('m_material_id', $mMaterialId)
            ->with('UnitMKv:id,kv_name')        
            ->with('MMaterial:id,supplier_m_customer_id')
            ->get() ;

        return $data ;
    }

    public function show($id)
    {
        $row = $this->model::find($id) ;

        if (!$row) {
            throw new NotFoundErrorException() ;
        }

        return $row ;
    }

    public function store(Request $request)
    {
        $row = new $this->model() ;
        $this->saveRow($request, $row) ;

        return $this->show($row["id"]) ;
    }

    public function update(Request $request, $id)
    {
        $row = $this->model::find($id) ;

        if (!$row) {
            throw new NotFoundErrorException() ;
        }

        $this->saveRow($request, $row) ;

        return $this->show($row["id"]) ;
    }

    protected function saveRow($request, $row)
    {
        $trimedRow = $request->all() ;

        DB::beginTransaction() ;

        $row->fill($trimedRow) ;

        try {
            // 本体更新
            $row->save() ;
            // order_noの採番
            $row->UpdateNumbering_MMaterialDetailsOrderNo($row->m_material_id) ;
        } catch (\Exception $e) {
            $this->throwDbError($e) ;
        }

        DB::commit() ;
    }


    
    public function exportCsv(Request $request) 
    {

        $res = $this->getFiltered($request)
            ->selectRaw("
                m_materials.id,
                m_material_details.id AS detail_id,
                m_materials.cd ,
                m_branches.short_name AS m_branch_name,
                category_m_kv.kv_name AS category_m_kv_name,
                sub_category_m_kv.kv_name AS sub_category_m_kv_name,
                m_customers.name AS m_customer_name,
                m_materials.name ,
                m_materials.display_name ,
                m_material_details.detail_name ,
                m_material_details.width ,
                m_material_details.width_margin ,
                m_material_details.height ,
                m_material_details.height_including_loss ,
                m_material_details.capacity ,
                m_material_details.contents_qty ,
                m_material_details.min_order_qty ,
                unit_m_kv.kv_name AS unit_m_kv_name,
                m_material_details.unit_price ,
                m_material_details.cost_price ,
                tax_m_kv.kv_name AS tax_m_kv_name,
                m_material_details.description ,
                m_materials.is_stocked ,
                group_concat(m_tags.tag_name),
                m_materials.thickness ,
                m_materials.weight ,
                m_materials.fire_prev_label_cd ,
                m_materials.memo AS material_memo,
                m_material_details.memo AS material_detail_memo,
                created_u.full_name AS created_m_user_name,
                updated_u.full_name AS updated_m_user_name,
                DATE_FORMAT(m_material_details.created_at, '%Y-%m-%d %T') ,
                DATE_FORMAT(m_material_details.updated_at, '%Y-%m-%d %T')
                "
            )
            //材料親
            ->join('m_materials', 'm_material_details.m_material_id', '=', 'm_materials.id')
            //拠点
            ->join('m_branches', 'm_materials.m_branch_id', '=', 'm_branches.id')

            
            //user
            ->join('m_users AS created_u' , 'm_material_details.created_m_user_id' , '=', 'created_u.id')
            ->join('m_users AS updated_u' , 'm_material_details.updated_m_user_id' , '=', 'updated_u.id')

            //tag
            ->leftJoin('m_tag_links', function ($join) {
                $join->on('m_materials.id', '=', 'm_tag_links.m_tag_link_id')
                    ->where('m_tag_links.m_tag_link_type' , 'App\Models\MMaterial');
            })
            ->leftJoin('m_tags', 'm_tag_links.m_tag_id' , '=' , 'm_tags.id')
            
            //区分
            ->leftJoin('m_kvs AS category_m_kv'         , 'm_materials.category_m_kv_id'         , '=', 'category_m_kv.id')
            ->leftJoin('m_kvs AS sub_category_m_kv'     , 'm_materials.sub_category_m_kv_id'     , '=', 'sub_category_m_kv.id')
            ->leftJoin('m_kvs AS unit_m_kv'             , 'm_material_details.unit_m_kv_id'      , '=', 'unit_m_kv.id')
            ->leftJoin('m_kvs AS tax_m_kv'              , 'm_material_details.tax_m_kv_id'       , '=', 'tax_m_kv.id')
            
            //取引先
            ->leftJoin('m_customers'  , 'm_materials.supplier_m_customer_id'    , '=', 'm_customers.id')
            ->orderBy("m_materials.cd")
            ->groupBy('m_material_details.id')
            ->get() ;

        

        $data = $res->toArray() ;

        $csv = $this->createCsv($data) ;
        return $csv ;
    }

}
