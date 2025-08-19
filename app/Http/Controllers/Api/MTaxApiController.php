<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;

class MTaxApiController extends BaseApiController
{

    private $cacheKey = "m_taxes" ; 

    public function __construct()
    {
        $this->model = "App\Models\MTax" ;
    }

    public function index()
    {
        return $this->getByCache() ;
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey, function () {
            return $this->model::orderByDesc('order_no')->get();
        });

        return $data ;
    }

    public function show($id)
    {
        $row = $this->model::find($id);
    
        if (! $row) 
        {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        return $row ; 
    }

    public function update(Request $request, $id)
    {
        $row = $this->model::find($id);
        
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        $this->saveRow($request, $row); 

        return $this->show($row["id"]);
    }

    protected function saveRow($request, $row)
    {
        $row->fillIncChildren($request->all()) ; 

        try {
            $row->push();
        } catch (\PDOException $e) {
             $this->throwDbError($e) ; 
        }

        // DBに更新をかけたタイミングでキャッシュを削除する
        $this->ClearCache($this->cacheKey) ;
        
        return $row ; 
    } 

}
