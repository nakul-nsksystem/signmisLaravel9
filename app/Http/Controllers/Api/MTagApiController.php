<?php

namespace App\Http\Controllers\Api;

use App\Models\MTag;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MTagApiController extends BaseApiController
{
    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MTag" ;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = $this->model
            ::with('MTagCategories')
            ->get()
            ->sortBy("order_no" ) ;
        
        return $data->values()->all() ;
    }
    public function show($id)
    {
        $row = $this->model
            ::with('TagColorMKv')
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

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request , $id)
    {
        $row = $this->model::find($id) ;
        
        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        $this->saveRow($request , $row )   ; 
        return $this->show($row["id"]);

        // $updated= $this->model::where("id" , $id)->get() ;
        // return $updated ;

    }

    
    protected function saveRow($request , $row )
    {
        
        $trimedRow = $request->all() ; 
        unset($trimedRow["tag_color_m_kv"]) ; 
        
        DB::beginTransaction() ;

        $row->fill($trimedRow) ;
        //Log::debug($row); 

        
        try {
            $row->save();
        } catch (\Exception $e) { 
            $this->throwDbError($e) ; 
        }

        DB::commit();

    }


}
