<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;

class MCustomerPersonApiController extends BaseApiController
{


    public function __construct()
    {
        $this->model = "App\Models\MCustomerPerson" ;
    }


    public function findByMCustomerId($mCustomerId)
    {   
        $rows = $this->model::where("m_customer_id", "=" ,$mCustomerId)->get() ; 
        
        return $rows;
    }


}
