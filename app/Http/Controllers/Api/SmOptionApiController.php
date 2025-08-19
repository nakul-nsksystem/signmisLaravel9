<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use Illuminate\Http\Request;
use App\Models\SmOption;
use Illuminate\Support\Facades\Cache;

class SmOptionApiController extends BaseApiController
{

    private $cacheKey = "sm_options" ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = SmOption::class ;
    }

    public function index()
    {           
        $data = $this->getByCache() ;
        return $data ; 
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->model
                ::with("KeyMKv")->get();
        });
        return $data ;
    }

    
    protected function getWith() { 
        return [
            "KeyMKv"
        ] ; 
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
