<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VUnclaimedSale;

class VUnclaimedSaleApiController extends SignmisReportApiController
{

    protected $filters = array(
        "period" => array(
            "operation" => "<=" ,
            "column" => "period" ,
        ) ,
        "elapsed_month" => array(
            "operation" => "<=" ,
            "column" => "elapsed_month" ,
        ) ,
        "m_customer_closing_date" => array() ,
        "m_branch_id" => array() ,
        "m_customer_id" => array() ,
    ) ;

    public function __construct()
    {
        $this->model = VUnclaimedSale::class;
    }

}
