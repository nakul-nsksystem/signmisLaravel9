<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VPaymentSale;

class VPaymentSaleApiController extends SignmisReportApiController
{
    protected $filters = array(
        "payment_day_from" => array(
            "operation" => ">=" ,
            "column" => "payment_day" ,
        ) ,
        "payment_day_to" => array(
            "operation" => "<=" ,
            "column" => "payment_day" ,
        ) ,
        "m_customer_payment_date" => array() ,
        "m_branch_id" => array() ,
        "m_customer_id" => array() ,
    ) ;

    public function __construct()
    {
        $this->model = VPaymentSale::class;
    }

}
