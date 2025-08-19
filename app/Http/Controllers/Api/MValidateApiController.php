<?php

namespace App\Http\Controllers\Api;

use App\Models\MMaterial;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;

class MValidateApiController extends BaseApiController
{
    public function __construct()
    {
        $this->model = "App\Models\MValidate" ;
    }

    public function index()
    {
        $data = $this->model::orderBy('cd')->get();
        return $data;
    }

    public function show($id)
    {
        $row = $this->model::with('CateogryMKvs')
            ->with('SubCateogryMKvs')
            ->find($id) ;
    
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
        $trimedRow = $request->all() ; 

        // 更新に関係ない列を削除
        unset($trimedRow["cateogry_m_kvs"]) ; 
        unset($trimedRow["sub_cateogry_m_kvs"]) ; 

        DB::beginTransaction();

        $row->fill($trimedRow);
        
        try {
            $row->save();
        } catch (\Exception $e) { 
            $this->throwDbError($e) ; 
        }
        
        DB::commit();
    } 

}
