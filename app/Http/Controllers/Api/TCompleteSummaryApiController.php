<?php

namespace App\Http\Controllers\Api;

use App\Models\TComplete;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\NotFoundErrorException;

class TCompleteSummaryApiController extends BaseApiController
{
    protected $filters = array(
        // 取引区分
        "dealing_m_kv_id" => array(
            "column" => "t_completes.dealing_m_kv_id" ,
        ) ,
        // 拠点
        "m_branch_id" => array(
            "column" => "t_completes.m_branch_id" ,
        ) ,
        // 取引先
        "m_customer_id" => array(
            "column" => "t_completes.m_customer_id" ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TComplete";
    }

    // 検索
    public function retrieve(Request $req)
    {
        // 取引先を検索条件に追加してるかの判定
        $isCustomer = $req["m_customer_id"] ;

        // pagination付きのgroupByを変更する場合はテストして正しい結果になるか確認する事
        $res = $this->getFiltered($req)
            ->selectRaw('count(*) as cnt, complete_day')

            ->with(['TCompletes' => 
                    function ($query) use ($req, $isCustomer) {
                        $query->with('MCustomer:id,cd,name,closing_date')
                              // m_customer.deleted_at IS NULLの条件追加
                              ->whereHas('MCustomer')
                              // 取引先を検索条件に追加している場合はWHERE文を追加
                              ->when($isCustomer, function ($query2) use ($req) {
                                  return $query2->where('m_customer_id', $req["m_customer_id"]) ;
                              })
                              // 請求日・取引区分(売 or 買) 毎の請求・取引先情報
                              ->where('dealing_m_kv_id' , $req["dealing_m_kv_id"])
                              ->where('m_branch_id'     , $req["m_branch_id"]) ; 
                    }])
            // m_customer.deleted_at IS NULLの条件追加
            ->whereHas('MCustomer')

            ->groupBy('m_branch_id')
            ->groupBy('complete_day')

            ->orderBy('complete_day', 'desc')
            ->paginate(4) ;

        return $res ; 
    }
}
