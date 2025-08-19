<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BaseErrorException;
use App\Models\TSale;
use App\Models\TSaleDetail;
use App\Http\Controllers\Controller;
use App\Models\TUserPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use DateTime;

class TUserPointApiController extends BaseApiController
{

    public function __construct()
    {
        // baseとなるmodelはt_saleにしてます
        $this->model = "App\Models\TUserPoint";
    }

    /**
     * ユーザーのポイントを取得
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByMUserId(Request $request)
    {
        // 返すデータを格納するオブジェクト
        $result = [];
        $userId = $request->input("userId"); // 取得するユーザーID
        $date = $request->input("date");     // 集計する日付

        // 必須パラメータのチェック
        if (empty($userId) || empty($date)) {
            throw new \InvalidArgumentException("Missing required parameters: userId and/or date.");
        }

        // 1. まず、指定日付より前の changed_at のレコードから point の合計をデータベースで直接取得
        $pointSum = $this->model::where('m_user_id', $userId)
            ->where('changed_at', '<', $date)
            ->whereIn('point_type_m_kv_id', [6000001, 6000002]) // 新規条件: ポイントタイプが 6000001 または 6000002 の場合
            ->selectRaw('
        SUM(CASE
                WHEN point_type_m_kv_id = 6000001 THEN point
                WHEN point_type_m_kv_id = 6000002 THEN -point
                ELSE 0
            END) as pointSum
    ') // CASE文でポイントの符号を調整
            ->pluck('pointSum')
            ->first(); // 合計ポイントを取得

        // DateTime オブジェクトを作成し、指定日付より1日前の日付に修正
        $sumDate = new DateTime($date); // DateTime オブジェクトを作成
        $sumDate->modify('-1 day'); // 日付を1日前に修正

        // 新しい行を作成して、指定日付の情報とポイント合計を設定
        $sumRow = new \stdClass();
        $sumRow->id = 0; // id を 0 に設定
        $sumRow->m_user_id = $userId; // m_user_id をリクエストで取得したユーザーIDに設定
        $sumRow->t_project_id = null; // t_project_id を null に設定
        $sumRow->point_type_m_kv_id = 6000000; // point_type_m_kv_id を 6000000 に設定
        $sumRow->changed_at = $sumDate->format('Y-m-d'); // changed_at を前日に設定
        $sumRow->point = (float)$pointSum; // ポイント合計を設定

        // 2. 次に、指定日付より後の changed_at のレコードを取得
        $result = $this->model::with([
            "TProject:id,cd,name,sales_completed_at",
            "PointTypeMKv:id,kv_name",
            "PointGrantTypeMKv:id,kv_name",
        ])
            ->where('m_user_id', $userId)
            // point_type_m_kv_id が 6000001 または 6000002 の場合に、changed_at が $date 以降の条件を適用
            ->where('changed_at', '>=', $date)
            ->orderBy('changed_at') // changed_at で並べ替え
            ->orderBy('id') // id で並べ替え
            ->get();

        // 新しい行を最前面に追加
        $result->prepend($sumRow); // prepend() を使用して新しい行を最前面に追加

        // 結果のオブジェクトを返す
        return $result;
    }

    /**
     * ユーザーのポイントを取得
     *
     * @param int $tProjectId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByTProjectId($tProjectId)
    {
        $rows = [];
        $rows = $this->model::where('t_project_id', $tProjectId)
            ->orderBy('m_user_id')->get();

        return $rows;
    }

    /**
     * ユーザーPt使用申請承認リスト
     */
    public function getApproveList()
    {
        $rows = [];
        $rows = $this->model::with([
            "MUser:id,full_name",
            "PointTypeMKv:id,kv_name"
        ])->where('point_type_m_kv_id', 6000003) // 新規条件
            ->orderBy('applied_at')->get();

        return $rows;
    }

    public function store(Request $request)
    {
        $row = new $this->model();

        $this->saveRow($request, $row);

        return $this->show($row["id"]);
    }


    public function update(Request $request, $id)
    {
        $row = $this->model::find($id);

        $this->saveRow($request, $row);

        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        return $this->show($row["id"]);
    }


    /**
     * 行を保存する
     *
     * @param $request
     * @param $row
     * @return void
     */
    protected function saveRow($request, $row)
    {
        // リクエストからすべてのデータを取得し、行に割り当てる
        $trimedRow = $request->all();
        $row->fill($trimedRow);

        // $row をログに出力する（デバッグ用）
        if ($row['point_type_m_kv_id'] == 6000003 && !isset($row['id'])) {
            // 同じ記録がすでに存在するか確認
            $existingRecord = $this->model::where('m_user_id', $row['m_user_id'])
                ->where('point_type_m_kv_id', 6000003)
                ->exists();

            if ($existingRecord) {
                // すでに記録が存在する場合、エラーメッセージを返す
                $error = new BaseErrorException('
                現在、使用申請中のポイントがあります。');
                throw $error;
            }
        }

        if ($row['point_type_m_kv_id'] == 6000002) {
            // 同じ記録がすでに存在するか確認
            // point_type_m_kv_id が 6000001 のレコードの point の合計を取得
            $pointSum = $this->model::where('point_type_m_kv_id', 6000001)
                ->sum('point'); // sum() はこの条件に一致するすべてのレコードの point の合計を返す

            // $row['point'] が $pointSum より大きい場合、エラーを返す
            if ($row['point'] > $pointSum) {
                $error = new BaseErrorException('
            使用可能なポイントの数量を超えています。');
                throw $error;
            }
        }

        // トランザクション開始
        DB::beginTransaction();
        try {
            // 行を保存
            $row->save();
        } catch (\Exception $e) {
            // エラーが発生した場合、ロールバック
            DB::rollback();
            $this->throwDbError($e); // DBエラーを投げる
        }

        // コミット
        DB::commit();
    }

    /**
     * ユーザーPt使用申請承認
     */
    public function approve(Request $request)
    {
        $tUserPoints = $request->all();

        $returnArr = array();

        DB::beginTransaction();
        foreach ($tUserPoints as $tUserPoint) {
            $id = $tUserPoint['id'];
            $row = $this->model::find($id);
            $row->fill($tUserPoint);
            try {
                $row->save();
            } catch (\Exception $e) {
                DB::rollBack();
                $this->throwDbError($e);
            }

            array_push($returnArr, $this->show($row['id']));
        }

        DB::commit();

        return $returnArr;
    }
}
