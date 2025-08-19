<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VCompletePurchase;

class VCompletePurchaseApiController extends SignmisReportApiController
{

    protected $filters = array(
        "complete_day_from" => array(
            "operation" => ">=" ,
            "column" => "complete_day" ,
        ) ,
        "complete_day_to" => array(
            "operation" => "<=" ,
            "column" => "complete_day" ,
        ) ,
        "m_customer_closing_date" => array() ,
        "accounts_title_m_kv_id" => array() ,
        "m_branch_id" => array() ,
        "m_customer_id" => array() ,
    ) ;

    public function __construct()
    {
        $this->model = new VCompletePurchase();
    }
}
