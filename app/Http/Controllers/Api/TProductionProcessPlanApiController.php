<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\BaseModel;
use App\Models\TProductionProcessPlan;
use App\Models\TProjectProductProcess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TProductionProcessPlanApiController extends BaseApiController
{

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = TProductionProcessPlan::class ;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  array  $id
     * @return \Illuminate\Http\Response
     */    
    public function destroyByIds(Request $request)
    {
        $ids = $request->all() ; 
        // Log::debug($ids) ; 
        foreach ($ids as $id){
            $row = $this->model::find($id) ;    
            if (! $row) {
                $error = new NotFoundErrorException() ; 
                throw $error ; 
            }
            
            $deleted = $row->delete() ;
            
        }

        return compact('deleted') ;
    }

}
