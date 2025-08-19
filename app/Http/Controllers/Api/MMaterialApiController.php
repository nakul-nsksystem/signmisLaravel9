<?php

namespace App\Http\Controllers\Api;

use App\Models\MMaterial;
use App\Models\MNumberingRule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use Illuminate\Support\Facades\Cache;

class MMaterialApiController extends BaseApiController
{
    // private $cacheKey = "m_materials" ;

    protected $filters = array(
        // cd
        "cd" => array(
            "operation" => "like" ,
            "postfix" => "%" ,
            "column" => "m_materials.cd" ,
        ) ,
        // 名称
        "name" => array(
            "operation" => "like" ,
            "prefix" => "%" ,
            "postfix" => "%" ,            
            "column" => "m_materials.name" ,
        ) ,
        // 通称
        "display_name" => array(
            "operation" => "like" ,
            "prefix" => "%" ,
            "postfix" => "%" ,            
        ) ,
        // カテゴリ
        "category_m_kv_id" => array() ,
        "category_m_kv_ids" => array(
            "operation" => "in" ,
            "column" => "category_m_kv_id"
        ) ,
        // サブカテゴリ
        "sub_category_m_kv_id" => array() ,
        // 拠点
        "m_branch_id" => array(
            "column" => "m_materials.m_branch_id" ,
        ) ,
        // 仕入先
        "supplier_m_customer_id" => array() ,
        // タグ
        "tagKeys" => array(
            "operation" => "ignore"
        ) ,

        // 材料明細
        "m_material_detail" => array(
            "operation" => "table" ,
            "relation_name" => "MMaterialDetails" ,

            // 詳細名
            "detail_name" => array(
                "operation" => "raw_like" ,
                "sql_expression" => "replace(detail_name, ',', '') like ? " ,
                "prefix" => "%" ,
                "postfix" => "%" ,
            ) ,
            // 用途・説明
            "description" => array(
                "operation" => "like" ,
                "prefix" => "%" ,
                "postfix" => "%" ,            
            ) ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\MMaterial";
        $this->numberingRuleModel = MNumberingRule::where('category_m_kv_id', 1700003)->first() ;
    }

    public function index()
    {
        // $data = $this->model
        //     ::with('MBranch')
        //     ->with('Supplier')
        //     ->with('CategoryMKv')
        //     ->with('SubCategoryMKv')
        //     ->with('TotalPriceCalcMKv')
        //     ->with('MTags')
        //     ->orderBy('cd')
        //     ->get();

        $data = $this->model
                ::with('MBranch')
                ->with('Supplier')
                ->with('CategoryMKv')
                ->with('SubCategoryMKv')
                ->with('TotalPriceCalcMKv')
                ->with('MTags')
                ->orderBy('cd')
                ->get();

        // $data = $this->getByCache() ;
        
        return $data;
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->model
                ::with('MBranch')
                ->with('Supplier')
                ->with('CategoryMKv')
                ->with('SubCategoryMKv')
                ->with('TotalPriceCalcMKv')
                ->with('MTags')
                ->orderBy('cd')
                ->get();
        });
        return $data ;
    }

    public function retrieve(Request $req)
    {
        // DB::enableQueryLog();

        $res = $this->getFiltered($req)
            ->selectRaw("m_materials.id,
                         m_materials.cd, 
                         m_materials.name, 
                         m_materials.display_name, 
                         m_kvs.kv_name,
                         m_materials.m_branch_id, 
                         m_branches.short_name AS m_branches_short_name, 
                         m_customers.kana, 
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                         m_materials.updated_at")

            ->join('m_branches', 'm_materials.m_branch_id', '=', 'm_branches.id')
            ->join('m_customers', 'm_materials.supplier_m_customer_id', '=', 'm_customers.id')
            ->join('m_kvs', 'm_materials.sub_category_m_kv_id', '=', 'm_kvs.id')
            
            // 並び替え：材料は他と違って並び替えが複雑
            // 1.サブカテゴリ 2.材料名 3.CD
            // 名称とか被ることあるので内部的にcdかidをorder by listに組み込んでソートが一意に識別されるようにしてます
            ->orderByRaw($this->orderByClause($req, 'm_kvs.m_kv_category_id, m_kvs.order_no, m_materials.name, m_materials.cd'))

            ->with('MMaterialDetails')
            ->paginate(12) ;

        // $query = DB::getQueryLog();
        // LOG::debug($query) ;
        return $res;
    }
    
    public function retrieveWithDetails(Request $req)
    {
        $reqAll = $req->all() ; 
        $tags = null ;

        if (isset($reqAll["isPagenate"])) {
            $isPagenate = $reqAll["isPagenate"] ;
            unset($req["isPagenate"]);
        }

        if (isset($reqAll["tagKeys"])) {
            $tags = $reqAll["tagKeys"] ; 
        }
 
        $res = $this->getFiltered($req)
            ->with([
                'MBranch' ,
                'Supplier' ,
                'CategoryMKv' ,
                'SubCategoryMKv' ,
                'TotalPriceCalcMKv' ,
                'MTags' ,
                'MMaterialDetails.UnitMKv' ,
            ]) ;
    
        if (! is_null($tags)) {
            $res->where(function( $query ) use ($tags) {
                $query->whereHas('MTags', function ( $subquery ) use ($tags) {
                    $subquery->whereIn('tag_key', $tags );
                }) ; 
            }) ; 
        }

        // return $res->get() ; 
        if (isset($isPagenate) && $isPagenate == true) {
            return $res->paginate() ; 
        }
        else {
            return $res->get() ; 
        }
    }

    public function show($id)
    {
        $row = $this->model::with('MBranch')    // 拠点
            ->with('Supplier')                  // 仕入先
            ->with('CategoryMKv')               // カテゴリ
            ->with('SubCategoryMKv')            // サブカテゴリ
            ->with('TotalPriceCalcMKv')         // 金額計算
            ->with('MTags')                     // 資材タグ
            ->with('MMaterialDetails')          // 材料明細
            ->find($id) ;

        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        return $row;
    }
    
    //物件発注連動用
    public function findByIds(Request $request){
        $reqAll = $request->all() ;;

        $data = $this->model::whereIn( 'id', $reqAll ) 
            ->with('Supplier')
            ->with('MMaterialDetails.UnitMKv')
            ->get() ;

        return $data;

    }

    public function store(Request $request)
    {
        $row = new $this->model();
        $this->saveRow($request, $row);

        return $this->show($row["id"]);
    }

    public function update(Request $request, $id)
    {
        $row = $this->model::find($id);
        
        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        $this->saveRow($request, $row);

        return $this->show($row["id"]);
    }

    protected function saveRow($request, $row)
    {
        $trimedRow = $request->all();
        $tagLinks  = $request->input("tag_links");

        // 更新に関係ない列を削除
        unset($trimedRow["m_branch"]);
        unset($trimedRow["supplier"]);
        unset($trimedRow["category_m_kv"]);
        unset($trimedRow["sub_category_m_kv"]);
        unset($trimedRow["total_price_calc_m_kv"]);
        unset($trimedRow["m_tags"]);
        unset($trimedRow["tag_links"]);
        unset($trimedRow["m_material_details"]);
        $row->fill($trimedRow);

        $cd = $row["cd"] ;
        if (!$cd) {
            // cdがnullの場合は採番
            $row["cd"] = $this->numberingRuleModel->numberinglogic($row) ;
        }

        DB::beginTransaction();
        try {
            $row->save();
            
            // Update Tags
            if ($request->filled("tag_links")) {
                $this->updateTagLink($this->model, $row["id"], $tagLinks);
            }
        } catch (\Exception $e) { 
            $this->throwDbError($e);
        }
        
        DB::commit();

        //DBに更新をかけたタイミングでキャッシュを削除する
        // $this->ClearCache($this->cacheKey) ;s

    } 

    public function destroy($id)
    {
        $row = $this->model::find($id) ;

        if (!$row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        $deleted = $row->deleteWithChildren() ; 
        
        // $this->ClearCache($this->cacheKey) ;

        return compact('deleted') ;
    }


}
