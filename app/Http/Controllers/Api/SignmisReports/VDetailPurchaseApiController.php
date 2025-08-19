<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VDetailPurchase;

class VDetailPurchaseApiController extends SignmisReportApiController
{
    protected $filters = array(
        "purchase_date_from" => array(
            "operation" => ">=" ,
            "column" => "purchase_date" ,
        ) ,
        "purchase_date_to" => array(
            "operation" => "<=" ,
            "column" => "purchase_date" ,
        ) ,
        "m_branch_id" => array() ,
        "m_customer_id" => array() ,
        "material_name" => array(
            "operation" => "like" ,
            "prefix" => "%" ,
            "postfix" => "%" ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = VDetailPurchase::class;
    }

}
