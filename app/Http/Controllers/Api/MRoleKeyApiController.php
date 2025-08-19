<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use Illuminate\Support\Facades\Cache;


class MRoleKeyApiController extends BaseApiController
{

    private $cacheKey = "m_role_keys" ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MRoleKey" ;
    }
    //
    public function index()
    {

        // $data = $this->model::get()->sortBy("order_no" ) ;

        $data = $this->getByCache() ;
        
        return $data->values()->all();
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->model::get()
                ->sortBy("order_no" ) ;
        });
        return $data ;
    }

    public function show($id)
    {
        $row = $this->model::find($id) ;

            if (! $row) {
                $error = new NotFoundErrorException() ; 
                throw $error ; 
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
        $row = $this->model::find($id);
        
        $this->saveRow($request, $row) ;
        
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        return $this->show($row["id"]);
    }


    protected function saveRow($request , $row )
    {
        
        $trimedRow = $request->all() ; 
        
        DB::beginTransaction() ;

        $row->fill($trimedRow) ;
        //Log::debug($row); 

        
        try {
            $row->save();
        } catch (\Exception $e) { 
            $this->throwDbError($e) ; 
        }

        DB::commit();

        //DBに更新をかけたタイミングでキャッシュを削除する
        $this->ClearCache($this->cacheKey) ;

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
