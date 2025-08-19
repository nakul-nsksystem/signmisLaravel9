<?php

namespace App\Http\Controllers\Api\Traits;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

/**
 * 会計連動（入金・支払）
 */
trait ExportPaymentTrait
{
    //検索したデータ内に未締のデータがあるかをチェックする
    public function chkAllCompleted(Request $req) 
    {   
        $cnt = $this->getFiltered($req)
            ->selectRaw('
                t_complete_details.id,
                t_complete_details.t_complete_id ,
                t_complete_details.dealing_m_kv_id ,
            ')
            ->where('t_complete_details.dealing_m_kv_id',$this->dealingMKvId) 
            ->where('t_complete_details.t_complete_id' ,  0 )
            ->count() ;

        return $cnt ;
    }

    //pca会計ヘッダー
    protected $pcaHeader = [
        "伝票日付",
        "伝票番号",
        "借方部門コード",
        "借方科目コード",
        "借方補助コード",
        "借方税区分コード",
        "借方金額",
        "借方消費税額",
        "貸方部門コード",
        "貸方科目コード",
        "貸方補助コード",
        "貸方税区分コード",
        "貸方金額",
        "貸方消費税額",
        "摘要文",
        "数字1",
        "数字2",
    ] ;


    private function updateOne(int $id) 
    {
        // データ出力済みに更新
        $model = $this->model::find($id);
        $model->is_csv_output = 1;
        $model->update();
    }    


 
}
