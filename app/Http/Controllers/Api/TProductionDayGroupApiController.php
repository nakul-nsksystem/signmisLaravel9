<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\TProductionDayGroup;
use App\Models\TProjectProductProcess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TProductionDayGroupApiController extends BaseApiController
{

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = TProductionDayGroup::class ;
    }


    public function getProductionDaysByIds(Request $request){
        $ids = $request->all() ; 
        $rtnDays = [] ; 
        foreach ($ids as $id){
            $row = $this->model::find($id) ;    
            if (! $row) {
                $error = new NotFoundErrorException() ; 
                throw $error ; 
            }

            if ( $row->TProductionDay){
                $rtnDays[] = $row->TProductionDay  ; 
            }
            else { 
                $group = $row->ParentTProductionDayGroup ;
                for ( $i = 0 ; $i <= 6  ; $i++  ){
                    if ( $group->TProductionDay){
                        if (! in_array($group->TProductionDay ,$rtnDays )){
                            $rtnDays[] = $group->TProductionDay  ; 
                        }                        
                        break ; 
                    }
                    else { 
                        $group = $group->ParentTProductionDayGroup ; 
                    }
                }
                
            }
            
               
        }
        return $rtnDays ; 
        
    }

}
