<?php

namespace App\Http\Controllers\Api;

use App\Models\TProject;
use App\Models\TProjectProduct;
use App\Models\TProjectFile;


use App\Models\MNumberingRule ;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\NotFoundErrorException ;
use App\Models\BaseModel;
use Carbon\Carbon;
use DateTime;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Dropbox\Client as DropboxClient;


class TProjectProductApiController extends BaseApiController
{
    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TProjectProduct" ;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->model::
            with(
                [  
                    "TProjectFile" , 
                    "TProjectProductProcesses" ,                      
                    "TProjectProductProcesses.TProductionResults.TProductionResultStops" ,
                    "TProjectProductProcesses.TProductionResults.TProductionResultUsers" ,
                    "TProjectProductProcesses.MProcessCategory" ,  
                    "TProjectProductProcesses.TProductionProcessPlans" ,  
                    "TProjectProductSeparates" ,
                    "TProjectProductBoardlayouts" ,
                    "TProjectProductBoardlayouts.MMaterialDetail" ,                    
                    "WarrantyMKv" ,
                    "SpecifiedMKv" ,                                        
                    "MProductCategory.LinkProcessCategoriesPivot"  ,
                    "TProject.MCustomer" ,
                    "TProject.SalesMUser" ,
                    "TProject.TProjectProducts.TProjectFile" ,
                    "TProject.TProjectProducts.MProductCategory" ,
                    "TProject.TProjectProducts.TProjectProductProcesses"
                        => function($query){
                            $query->enabled() ; 
                            //$query->where('is_enabled', true) ; 
                        },
                    "TProject.TProjectProducts.TProjectProductProcesses.TProductionProcessPlans" ,  
                    "TProject.TProjectDeliveries.DeliveryMKv" , 
                        
                ])
                ->find($id);

        

        if (! $row) 
        {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        // サムネイル取得
        if (! is_null($row->TProjectFile )){
            $row->TProjectFile->append("base64_thumbnail") ;
        }
        foreach ($row->TProject->TProjectProducts as $products){
            if (! is_null($products->TProjectFile )){
                $products->TProjectFile->append("base64_thumbnail") ;
            }
            
        }


        return $row ; 
    }

    public function getByIds4copy(Request $req){
        $reqData = $req->validate([
            'ids'       => 'array|nullable',            
            'isWithDlv' => 'boolean|nullable',            
        ]);
        $ids        = $reqData["ids"] ;         
        $isWithDlv  = $reqData["isWithDlv"] ;         
        $res = $this->model::
            with(
                [  
                    "TProjectProductProcesses" ,                      
                    "TProjectProductProcesses.MProcessCategory" ,  
                    "TProjectProductSeparates" ,
                    "TProjectProductBoardlayouts" ,
                    "TProjectProductBoardlayouts.MMaterialDetail" ,                    
                    "WarrantyMKv" ,
                    "SpecifiedMKv" ,                                        
                    "MProductCategory.LinkProcessCategoriesPivot"  ,                        
                ])
                ->when($isWithDlv , function($q){
                    $q->with([
                        "TProjectDeliveries:id,delivery_at,delivery_time,delivery_m_kv_id" ,
                        "TProjectDeliveries.DeliveryMKv:id,kv_name"
                    ]) ;
                })
                ->whereIn("id" ,  $ids)
                ->get() ; 
        
        return $res ; 

        
    }
    

}
