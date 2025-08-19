<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProcessCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;


class MProcessCategoryApiController extends BaseApiController
{

    private $cacheKey = "m_process_categories" ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = MProcessCategory::class ;
    }

    private function getBuilder() : Builder
    {
        return $this->model
            ::with("MProcesses" ) 
            ->with("MProcessMaterials" ) 
            ->with("MProcessOutsources" ) 
            ->with("MProcessLabels" ) ; 
    }
        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        // $data = $this->getBuilder()         
        //     ->orderBy("order_no" ,"asc")
        //     ->get()  ;

        $data = $this->getByCache() ;
        
        foreach ($data as &$process){            
            $process->m_process_labels = $process->MProcessLabels->sortBy('order_no' );            
        }
        
        return $data->values()->all();
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->getBuilder()         
            ->orderBy("order_no" ,"asc")
            ->get()  ;
        });
        return $data ;
    }
    
    
    public function searchByProductionMKvId($mKvId){
        $query = $this->model::
            with([
                "MProductions"
            ])
            ->where("production_m_kv_id" , $mKvId) ; 
        return $query->get() ; 
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->getBuilder()         
            ->find($id);
        
        if (! $row){
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        
        return $row ; 
    }
    
    
    protected function saveRow($request ,$row )
    {        
        $data = $request->all() ; 
        
        // 子供ごとSave
        $row->fillIncChildren($data) ;
        
        DB::beginTransaction();
        try {
            $row->push();        
        } 
        catch (\PDOException $pdoException){
            $this->throwDbError($pdoException) ; 
        }        
        catch (\Exception $e) { 
            DB::rollBack();
            Log::debug($e) ; 
        }
        DB::commit() ; 
        
        //DBに更新をかけたタイミングでキャッシュを削除する
        $this->ClearCache($this->cacheKey) ;

        return $row ; 
    } 

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
        
        $this->ClearCache($this->cacheKey) ;

        return compact('deleted') ;
    }


}
