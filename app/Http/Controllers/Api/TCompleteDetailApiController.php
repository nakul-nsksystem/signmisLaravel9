<?php

namespace App\Http\Controllers\Api;

use App\Models\TCompleteDetail;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;

class TCompleteDetailApiController extends BaseApiController
{
    protected $filters = array(
        // 取引区分
        "dealing_m_kv_id" => array() ,
        // 拠点
        "m_branch_id" => array() ,
        // 取引先
        "m_customer_id" => array(
            "is_zero_enabled" => "true",
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TCompleteDetail";
    }

    public function retrieve(Request $req)
    {
        $res = $this->getFiltered($req)
            ->orderByRaw('payment_day DESC, id')
            ->with([
                'PaymentMKv' ,
            ])
            ->paginate(8) ;

        return $res; 
    }

}
