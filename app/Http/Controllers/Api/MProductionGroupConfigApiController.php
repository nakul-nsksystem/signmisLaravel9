<?php

namespace App\Http\Controllers\Api;

use App\Models\MCustomer;
use App\Models\MNumberingRule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use App\Models\MProductionGroupConfig;

class MProductionGroupConfigApiController extends BaseApiController
{

    public function __construct()
    {
        $this->model = MProductionGroupConfig::class ;
    }

    public function findByBranchAndProcessCategoryMkv($mBranchId , $mKvId )
    {        
        $query = $this->model::where('m_branch_id', $mBranchId ) ;         
        $query = $query->where('process_category_m_kv_id', $mKvId ) ;         
        $data  = $query->first() ; 

        return $data ;
    }


}
