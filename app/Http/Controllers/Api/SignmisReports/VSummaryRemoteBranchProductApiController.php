<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VSummaryRemoteBranchProduct;

class VSummaryRemoteBranchProductApiController extends SignmisReportApiController
{
    public function __construct()
    {
        $this->model = VSummaryRemoteBranchProduct::class;
    }

    protected $filters = array(
        "complete_day_from" => array(
            "operation" => ">=" ,
            "column" => "complete_day" ,
        ) ,
        "complete_day_to" => array(
            "operation" => "<=" ,
            "column" => "complete_day" ,
        ) ,
        "m_branch_id" => array() ,
        "product_m_branch_id" => array() ,
    ) ;
}
