<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MProductCategoryApiController extends BaseApiController
{

    private $cacheKey = "m_product_categories" ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = MProductCategory::class ;
    }

        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //$processes =  "MProcesses:id,m_processs_category_id,cd,name,is_display_name,is_needed_order" ; 
        // $processes =  "MProcesses" ; 
        // $processMaterials =  "MProcessMaterials" ; 
        // $processOutsources =  "MProcessOutsources" ; 
        // $processLabels =  "MProcessLabels" ; 
        // $data = $this->model
        //         ::with('LinkProcessCategoriesPivot.' . $processes)
        //         ->with('LinkProcessCategoriesPivot.' . $processMaterials)
        //         ->with('LinkProcessCategoriesPivot.' . $processOutsources)
        //         ->with('LinkProcessCategoriesPivot.' . $processLabels)
        //         ->get();

        $data = $this->getByCache() ;

        return $data;

    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            $processes =  "MProcesses" ; 
            $processMaterials =  "MProcessMaterials" ; 
            $processOutsources =  "MProcessOutsources" ; 
            $processLabels =  "MProcessLabels" ;

            return $this->model::with('LinkProcessCategoriesPivot')
                // with('LinkProcessCategoriesPivot.' . $processes)
                // ->with('LinkProcessCategoriesPivot.' . $processMaterials)
                // ->with('LinkProcessCategoriesPivot.' . $processOutsources)
                // ->with('LinkProcessCategoriesPivot.' . $processLabels)
                ->orderBy("order_no")
                ->get()
                ;
        });
        return $data ;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->model::with('LinkProcessCategoriesPivot:id')
            ->find($id);
        
        if (! $row){
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        
        return $row ; 
    }


    protected function saveRow($request, $row)
    {                
        $data = $request->all() ; 
        
        // Log::debug($request->all()) ; 
        $mProcessCategoryIds =  $data["m_process_category_ids"] ;         
        unset($data["m_process_category_ids"] ) ; 

        foreach($mProcessCategoryIds as $key => $val) 
        { 
            if(is_null($val)) unset($mProcessCategoryIds[$key]); 
        } 

        
        $row->fillIncChildren($data) ; 

        try {
            $row->push();
            // DB::enableQueryLog();            
            $row->LinkProcessCategoriesPivot()->sync($mProcessCategoryIds ) ;
            // Log::debug(DB::getQueryLog());
            
        } catch (\PDOException $e) {
            // Log::debug(DB::getQueryLog());
             $this->throwDbError($e) ; 
        }

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
