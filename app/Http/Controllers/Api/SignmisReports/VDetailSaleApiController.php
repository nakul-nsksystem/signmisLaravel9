<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VDetailSale;

class VDetailSaleApiController extends SignmisReportApiController
{
    protected $filters = array(
        "accounting_date_from" => array(
            "operation" => ">=" ,
            "column" => "accounting_date" ,
        ) ,
        "accounting_date_to" => array(
            "operation" => "<=" ,
            "column" => "accounting_date" ,
        ) ,
        "m_branch_id" => array() ,
        "m_customer_id" => array() ,
        "m_user_id" => array() ,
        "t_project_cd" => array(
            "operation" => "like" ,
            "prefix" => "%" ,
            "postfix" => "%" ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = VDetailSale::class;
    }

}
