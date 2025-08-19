<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use Illuminate\Support\Facades\Cache;


class MRoleApiController extends BaseApiController
{

    private $cacheKey = "m_roles" ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MRole" ;
    }
    //
    public function index()
    {

        // $data = $this->model
        //     ::get()->sortBy("id" ) ;

        $data = $this->getByCache() ;
        
        return $data->values()->all();
    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->model
                ::get()->sortBy("id" ) ;
        });
        return $data ;
    }

    public function show($id)
    {
        $row = $this->model
            ::with('MRoleDetails.MRoleKey')
            ->find($id) ;

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


    protected function saveRow($request ,$row )
    {        
        $data = $request->all() ; 
        
        // 子供ごとSave        
        $row->fillIncChildren($data) ; 
        //$this->fillIncChildren($row , $data) ; 
        
        DB::beginTransaction();
        try {
            $row->push();
        
        } catch (\PDOException $pdoException)
        {
            $this->throwDbError($pdoException) ; 
        }        
        catch (\Exception $e) { 
            DB::rollBack();
            Log::debug($e) ; 
        }

        DB::commit() ; 

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
