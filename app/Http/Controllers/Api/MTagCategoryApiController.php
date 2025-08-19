<?php

namespace App\Http\Controllers\Api;

use App\Models\MTagCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class MTagCategoryApiController extends BaseApiController
{

    private $cacheKey = "m_tag_categories" ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MTagCategory" ;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $data = $this->model
        //     ::with('MTags')
        //     ->get()
        //     ->sortBy("order_no" );
        $data = $this->getByCache() ;
        
        return $data->values()->all();
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->model::with('MTags')
                ->get()
                ->sortBy("order_no" );
        });
        return $data ;
    }

    protected function saveRow($request, $row)
    {                
        $row->fill($request->all()) ;
        
        try {
            $row->save();
        } catch (\PDOException $e) {
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
