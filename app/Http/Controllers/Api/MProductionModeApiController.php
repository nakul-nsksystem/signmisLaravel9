<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MProductionModeApiController extends BaseApiController
{
    private $mSpeedUnitKvColumns = ":m_kvs.id,m_kvs.kv_name" ; 
    private $mProcessCategoryColumns = ":m_process_categories.id,m_process_categories.cd,m_process_categories.name" ; 

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MProductionMode" ;
    }

    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->model
                ::with("MProcessCategories"   . $this->mProcessCategoryColumns)
                ->with("SpeedUnitMKv"   . $this->mSpeedUnitKvColumns)
                ->find($id);
        
        if (! $row) 
        {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        return $row ; 
    }

    protected function saveRow($request ,$row )
    {        
        $data = $request->all() ; 
        
        $mProcessCategoryIds =  $data["m_process_category_ids"] ; 

        unset($data["m_process_category_ids"]) ; 

        // 子供ごとSave
        $row->fillIncChildren($data) ;
        
        DB::beginTransaction();
        try {
            $row->push();        
            $row->MProcessCategories()->sync($mProcessCategoryIds) ;
        } catch (\PDOException $pdoException)
        {
            $this->throwDbError($pdoException) ; 
        }        
        catch (\Exception $e) { 
            DB::rollBack();
            Log::debug($e) ; 
        }
        DB::commit() ; 
        return $row ;   
    } 

    

}
