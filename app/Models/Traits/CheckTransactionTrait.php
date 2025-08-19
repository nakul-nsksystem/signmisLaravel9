<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * マスタ削除時のアクション
 */
trait CheckTransactionTrait
{

    /**
     * チェック対象モデル
     */
    protected $chk_tgt_model = 
    [
        "TProjects",
        "TSales",
        "TPOrders",
        "TPInvoices",
        "TCompletes",
        "TCompleteDetails"
    ] ;

    protected function setChkTarget($array) 
    {
        $this->chk_tgt_model = $array ;
    }

    protected function addChkTarget($modelName) 
    {
        array_push($this->chk_tgt_model,$modelName) ;
    }

    public function checkTxn($id) 
    {
        $res = $this->model::select("id")->withCount($this->chk_tgt_model)->find($id)->toArray() ;

        return $res ;
    }

 
}
