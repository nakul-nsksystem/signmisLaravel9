<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException ; 
use App\Exceptions\NotFoundErrorException ;
use Illuminate\Support\Facades\Cache;


use App\Http\Controllers\Api\Traits\ThumbnailUploadTrait;
use App\Http\Controllers\Controller;
use App\Models\MTagCategory;

class MUserApiController extends BaseApiController
{   
    
    use ThumbnailUploadTrait ; 
    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\User" ;
    }

    private $mBrancheColumns = ":id,cd,order_no,name,short_name,color_m_kv_id" ; 

    private $cacheKey = "m_users" ;
    
    
    public function index()
    {

                
        // $data = $this->model
        //     ::with("tags")
        //     ->with("roles.MRoleDetails")        
        //     ->with("MBranch" . $this->mBrancheColumns) 
        //     ->get()
        //     ;
        
        $data = $this->getByCache() ;
        // MBranch.order_no , MUser.order_no 
        $sorted = $data->sort(function($first, $second) {
            if ($first->MBranch["order_no"] == $second->MBranch["order_no"]) {
                return $first['order_no'] > $second['order_no'] ? 1 : -1;
            }
            return $first->MBranch["order_no"] > $second->MBranch["order_no"] ? 1 : -1 ;
        })->values()->all(); ;            

        return $sorted ; 

    }

    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->model::with("tags")
                // ->with("roles.MRoleDetails")
                ->with("MBranch" . $this->mBrancheColumns) 
                ->where("id" , "!=" , 0)
                ->withTrashed()
                ->get();
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
        $row = $this->model::with("tags")
                           ->with("roles.MRoleDetails")        
                           ->with("MBranch")
                           ->find($id);
        
        if (! $row) 
        {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        return $row ; 
    }


    public function findByMTag($mTagId)
    {

        $rows = User::whereHas('tags', function ($query)  use ($mTagId) {
            $query->where('m_tag_id' , $mTagId);
        })->get();

        return $rows ; 
    }

    
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $row = new $this->model();
        $this->saveRow($request ,$row)   ; 
        
        return $this->show($row["id"]) ;

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
        $row = $this->model::find($id);
        
        if (! $row) 
        {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        
        $this->saveRow($request ,$row )   ; 

        return $this->show($row["id"]) ;

    }

    /**
     * 
     */
    protected function saveRow($request ,$row )
    {

        //Log::debug($request) ; 
        $tagLinks = $request->input("tag_links" )  ;
                
        $trimedRow = $request->all() ;
        $selectedRoleIds = $trimedRow["m_role_users"] ;
            
        unset($trimedRow["tags"]) ; 
        unset($trimedRow["tag_links"]) ;
        unset($trimedRow["roles"]) ;
        unset($trimedRow["m_branch"]) ;
        unset($trimedRow["m_role_users"]) ;
 
        
        DB::beginTransaction();

        $row->fill($trimedRow);
        
        try {
            $row->save();
        } catch (\Exception $e) { 
            $this->throwDbError($e) ; 

            /*
            $error = new DbSaveErrorException() ; 
            $error->setDbErrorCode($e->getCode() );

            DB::rollBack();
            throw $error ; 
                */
        }
        $row = $this->show($row["id"]) ;

        $row->roles()->detach() ;
        foreach ($selectedRoleIds as $roleId) {
            try {
                $row->roles()->syncWithoutDetaching(
                    ['m_role_id' => $roleId] ,
                    ['m_user_id' => $row["id"]]
                ) ;
            } catch (\Exception $e) { 
                $this->throwDbError($e) ; 
                DB::rollBack();

            }            
        }
        // Update Tags
        $this->updateTagLink($this->model ,$row["id"],$tagLinks)  ; 
        
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
