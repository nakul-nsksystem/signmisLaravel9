<?php

namespace App\Http\Controllers\Api;

use App\Models\MTagLink;
use App\Models\MTagCategory ; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Exceptions\DbSaveErrorException ; 
use Illuminate\Database\Eloquent\Model;
use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Builder;

use Illuminate\Support\Facades\Cache;


class BaseApiController extends Controller
{
    // Model 
    protected $model = "" ; 

    // Filter
    protected $filters = array() ; 


    protected function getWith() { 
        return [] ; 
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = $this->model::
                    with(
                        $this->getWith() 
                    )->get() ;

        return $data ;
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $row = new $this->model() ;
        //$row = $this->saveRow($request, $row) ;
        $this->saveRow($request, $row) ;
        return $this->show($row["id"]) ;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->model::with(
                        $this->getWith() 
                    )->find($id) ;
        
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
    public function update(Request $request, $id)
    {
        $row = $this->model::find($id) ;
        
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        $row = $this->saveRow($request, $row) ;
        return $this->show($id) ;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $row = $this->model::find($id) ;

        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        if ($row instanceof BaseModel) {
            $deleted = $row->deleteWithChildren() ; 
        } else {
            $deleted = $row->delete() ;
        }

        return compact('deleted') ;
    }

    protected function saveRow($request, $row)
    {                
        $row->fill($request->all()) ;
        
        try {
            $row->save();
        } catch (\PDOException $e) {
             $this->throwDbError($e) ; 
        }

        return $row ; 
    }

    /**
     * M_Tag_links へのリンクの追加、削除.
     *
     * @param  string  $model   モデルへのフルパス 例: App\Models\MTag
     * @param  int  $linkId     リンク先のID
     * @param  array  $selectedMTagIds    m_tags_categoryごとの選択されている m_tags.IDの配列
     * @return None
     */
    protected function updateTagLink($model, $linkId, $selectedMTagIds)
    {
        foreach ($selectedMTagIds as $tagCatKeys => $rows) {
            $tagCategory = MTagCategory::with('MTags')->where("tag_category_key", $tagCatKeys)->first() ;

            foreach ($tagCategory->mTags as $tag) {
                // 選択されている中に存在する。
                $existsRow = MTagLink::where("m_tag_link_type", $model)
                    ->where("m_tag_link_id", $linkId)
                    ->where("m_tag_id", $tag->id)
                    ->first() ;

                if (! in_array($tag->id, $selectedMTagIds[$tagCatKeys], true)) {
                    // 削除
                    if (! is_null($existsRow)) {
                        $existsRow->delete() ;
                    }
                } else {
                    if (is_null($existsRow)) {
                        // Insert 
                        $row = new MTagLink() ;
                        $row->m_tag_id = $tag->id ; 
                        $row->m_tag_link_type = $model ; 
                        $row->m_tag_link_id = $linkId ;                         

                        try {
                            $row->save();
                        } catch (\Exception $e) { 
                            $this->throwDbError($e) ;
                        }
                    }
                }
            }
        }
    }
    
    protected function throwDbError(\PDOException $e)
    {
        $error = new DbSaveErrorException() ; 
        $error->setDbErrorCode($e->getCode()) ;

        if (count($e->errorInfo) > 1) {
            $error->setDbErrorSubCode($e->errorInfo[1]) ;
        }
        
        Log::error($e) ;
        DB::rollBack() ;
        throw $error ;
    }

    /**
     * 検索条件から不必要な項目を削除する
     *
     * @input  
     * @return Builder
     */
    protected function trimFilterInput($input, $filters)
    {
        $delKeys = array() ; 

        foreach ($input as $key => $val) {
            //Log::debug("key = " . $key) ; 
            if (isset($filters[$key])) {
                $operation       = isset($filters[$key]["operation"      ]) ? $filters[$key]["operation"      ] : "="  ;
                $is_zero_enabled = isset($filters[$key]["is_zero_enabled"]) ? $filters[$key]["is_zero_enabled"] : ""   ;

                if ($operation  == "ignore" ){
                    $delKeys[] = $key ; 
                }
                else if ( $operation == "table") {                    
                    //$relationName = isset($filters[$key]["relation_name"]) ? $filters[$key]["relation_name"] : $key ;                     
                    //Log::debug("relationName : " . $relationName . " count:" . count($input[$key])) ;                     
                    $input[$key] = $this->trimFilterInput($val ,$filters[$key]) ; 
                    if (count($input[$key]) == 0  ) $delKeys[] = $key ; 
                    
                } else {
                    if ($operation == "in") {
                        //Log::debug("key : " . $key . " in ") ; 
                        if (! is_array($val) || count($val) == 0 ) {
                            $delKeys[] = $key ; 
                            //$modelNode->whereIn($column, $val) ;
                        }
                    } else {                        
                        // 検索条件に加えるかの判定ロジック
                        //Log::debug("key : " . $key . " val ") ;                         
                        if (! $this->isAddToCondition($val, $is_zero_enabled)) {
                            $delKeys[] = $key ;                             
                        }
                    }
                }
            } else {
                if (! $this->isAddToCondition($val, false)) {
                    //Log::debug("Sakujo " .$key . " val:" . $val ."]") ;
                    $delKeys[] = $key ; 
                }
            }
        }
        
        foreach ($delKeys as $delKey) {
            unset($input[$delKey]) ;
        }
        
        return $input ; 
    }

    /**
     * 検索条件を反映させたビルダーを返す
     *
     * @param  Request $req   モデルへのフルパス 例: App\Models\MTag
     * @return Builder
     */
    protected function getFiltered(Request $req) : Builder
    {
        $input = $req->all() ;

        // 検索に関係ない項目を削除
        unset($input["page"]) ; // page:ページネーション機能
        unset($input["sort"]) ; // sort:ソート機能

        $input = $this->trimFilterInput($input ,$this->filters) ;         
        $where = array() ; 
        $data = $this->model::where($where) ; 
        $ret = $this->getChildFiltered($data, $this->filters, $input) ; 
        
        return $ret ; 
    }

    /**
     * 検索条件を反映させたビルダーを返す
     *
     * @param  Builder $modelNode   ModelのBuilder
     * @param  Array $filters     Filter条件
     * @param  Array $input       Filterする値
     * @return Builder
     */
    private function getChildFiltered($modelNode, $filters, $input) : Builder
    {
        //Log::debug($input) ; 
        //Log::debug($filters) ;
        $where = array() ;

        foreach ($input as $key => $val) {
            if (isset($filters[$key])) {
                $operation       = isset($filters[$key]["operation"      ]) ? $filters[$key]["operation"      ] : "="  ; 
                $prefix          = isset($filters[$key]["prefix"         ]) ? $filters[$key]["prefix"         ] : ""   ; 
                $postfix         = isset($filters[$key]["postfix"        ]) ? $filters[$key]["postfix"        ] : ""   ; 
                $column          = isset($filters[$key]["column"         ]) ? $filters[$key]["column"         ] : $key ;
                $is_zero_enabled = isset($filters[$key]["is_zero_enabled"]) ? $filters[$key]["is_zero_enabled"] : ""   ;
                $sql_expression  = isset($filters[$key]["sql_expression" ]) ? $filters[$key]["sql_expression" ] : ""   ;

                //$explodedColumns = explode(".", $column);
                //Log::debug($explodedColumns) ;
                if ( $operation == "table") {
                    $relationName = isset($filters[$key]["relation_name"]) ? $filters[$key]["relation_name"] : $key ; 

                    //Log::debug("table $relationName") ; 
                    //Log::debug($filters[$key]) ; 
                    $modelNode->whereHas($relationName, function (Builder $query) use ($filters, $key, $val) {
                        $this->getChildFiltered($query, $filters[$key], $val) ; 
                        //$query->where($explodedColumns[1] , $operation ,$prefix . $val . $postfix );
                    }) ;                     
                } else {
                    if ($operation == "in") {
                        // Where条件[IN]句
                        if (is_array($val)) {
                            $modelNode->whereIn($column, $val) ;
                        }
                    } else if ($operation == "is null") {
                        // Where条件[IS NULL]句
                        // $keyだと別テーブルの同一列名の区別が付かなくて曖昧(ambiguous)になるので$columnに変更
                        $modelNode->whereNull($column) ;
                    } else if ($operation == "is not null") {
                        // Where条件[IS NOT NULL]句
                        // $keyだと別テーブルの同一列名の区別が付かなくて曖昧(ambiguous)になるので$columnに変更
                        $modelNode->whereNotNull($column) ;
                    } else if ($operation == "raw") {
                        // whereRawメソッドを使用して関数を使用
                        // Log::debug("operation:[raw]" . $sql_expression . "] val[" . $val . "]") ; 
                        $modelNode->whereRaw($sql_expression, $val) ;
                    } else if ($operation == "raw_like") {
                        // whereRawメソッドを使用して関数を使用 & Like式：Likeを兼用する場合はPrefix, Postfixも考慮する事
                        $patternMuch = ($prefix .$val .$postfix) ;
                        // Log::debug("operation:[raw_like]" . $sql_expression . "] val[" . $patternMuch . "]") ; 
                        $modelNode->whereRaw($sql_expression, $patternMuch) ;
                    } else {
                        // Log::debug($key ."=> column[" .$column ."] operation[" .$operation ."] prefix[" .$prefix ."] val[" .$val ."] postfix[" .$postfix ."] is_zero_enabled[" .$is_zero_enabled ."]") ;
                        // 検索条件に加えるかの判定ロジック
                        $where[] = [$column, $operation, $prefix .$val .$postfix] ;
                        // if ($this->isAddToCondition($val, $is_zero_enabled)) {
                        //     //Log::debug("AddFilter:[" .$column .$operation .$prefix .$val .$postfix ."]") ;
                        //     $where[] = [$column, $operation, $prefix .$val .$postfix] ;
                        // }
                    }
                }
            } else {
                // $filtersに指定されてない検索条件はここにくる
                // Log::debug($key . $val) ;
                $where[] = [$key, $val] ;
            }
        }
        // Log::debug($where) ; 
        // Log::debug($modelNode->where($where)->toSql());

        return $modelNode->where($where) ;         
    }

    /**
     * 検索条件に加えるかの判定ロジック
     *
     * @param  string $column           カラム名
     * @param  string $val              値
     * @param  string $is_zero_enabled  検索条件に0を考慮する場合は"true"を設定してください
     * @return bool                     true:検索条件に追加する false:検索条件に追加しない
     */
    private function isAddToCondition(?string $val, ?string $is_zero_enabled) : bool
    {
        if (! isset($val)) {
            // 値がセットされていない場合は検索条件に加えない
            return false ;
        }

        if ($val === "") {
            // 空文字の場合は検索条件に加えない
            // emptyだと["FALSE", "0"]という文字列とかが空判定になるので[===]で判定してます
            return false ;
        }

        if (is_numeric($val) && $val == 0) {
            // 数値0の場合

            if (isset($is_zero_enabled) && $is_zero_enabled === "true") {
                // is_zero_enabled="true"の場合は検索条件に0を考慮する
                return true ;
            }

            // 数値0は検索条件に加えない
            return false ;
        }

        // 上記に該当しない場合はフィルターに条件追加
        return true;
    }

    /**
     * ソートで使用する際のOrderBy句を共通化
     *
     * @param  Request $req           Requestオブジェクト
     * @param  string $defaultSort    sort項目が設定されてない場合のdefaultソート
     * @return string                 OrderBy句の文字列
     */
    protected function orderByClause(Request $req, string $defaultSort = '')
    {
        // sort項目未指定時は$defaultSortをOrderBy句に付け足す
        $sort = $req->input("sort", $defaultSort) ;
        
        // sort項目は指定しているが空文字[NULL]の場合はOrderBy句に$defaultSortを設定する
        if(empty($sort)) {
            $sort = $defaultSort ;
        }

        // 更に$defaultSortも未指定の場合は[""]を設定する
        if (empty($sort)) {
            $sort = '""';
        }

        return $sort ;
    }


    /**
     * indexのキャッシュをクリア
     * @param string $key 削除するキャッシュの名称
     */
    protected function ClearCache ($key) {
        
        if (Cache::has($key)) 
        {
            Cache::forget($key);
        }
    }

}
