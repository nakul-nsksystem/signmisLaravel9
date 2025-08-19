<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException;
use App\Models\MBranch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;


class MBranchApiController extends BaseApiController
{
    
    private $cacheKey = "m_branches" ; 

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MBranch" ;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        // $branches = MBranch::
        //     with(["MBranchProductionRests"])
        //     ->get()
        //     ->sortBy("order_no" );
        
        $data = $this->getByCache() ;
        // $branches = MBranch::all()->sortBy("order_no" );
        return $data;
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey, function () {
            return MBranch::with(["MBranchProductionRests"])
                ->get()
                ->sortBy("order_no" );
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
        $row = $this->model::with(["MBranchProductionRests"])->find($id) ;
        
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        return $row ; 
    }

    
    protected function saveRow($request, $row)
    {                
        $row->fillIncChildren($request->all()) ; 

        try {
            $row->push();
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
