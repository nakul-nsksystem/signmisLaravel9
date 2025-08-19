<?php

namespace App\Http\Controllers\Api;

use App\Models\TProject;
use App\Models\TProjectPoint;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\NotFoundErrorException;
use App\Http\Controllers\Api\Traits\NumberTrait;
use App\Models\BaseModel;
use App\Models\MKv;
use App\Models\TUserPoint;
use DateTime;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use stdClass;

/**ミケポイントカスタマイズ */
class TProjectPointApiController extends BaseApiController
{

    use NumberTrait;
    protected $projectModel = "";
    protected $mkvModel = "";
    protected $userPoint = "";

    public function __construct()
    {
        $this->model = TProjectPoint::class;
        $this->projectModel = TProject::class;
        $this->mkvModel = MKv::class;
        $this->userPoint = TUserPoint::class;
    }

    public function getProjectListQuery()
    {

        $query = $this->projectModel::select(
            'id',
            'm_branch_id',
            'sales_m_user_id',
            'm_customer_id',
            'cd',
            'name',
            'ordered_at',
            'sales_completed_at',
            'total_sell_price',
            'total_profit',
            'profit_per',
            'created_m_user_id',
        );
        return $query;
    }

    /**物件リストを取得 */
    public function getTProject4PointQueryList()
    {

        $query = $this->projectModel::select(
            'id',
            'm_branch_id',
            'sales_m_user_id',
            'm_customer_id',
            'cd',
            'name',
            'ordered_at',
            'sales_completed_at',
            'total_cost',
            'total_sell_price',
            'created_m_user_id',
            DB::raw('COALESCE(
                (SELECT SUM(t_sale_details.total_price)
                 FROM t_sale_details
                 WHERE t_sale_details.t_project_id = t_projects.id
                 AND t_sale_details.deleted_at IS NULL), 0
             ) AS total_sale_price')
        )
            ->with([
                "TProjectProducts:id,t_project_id,name",
                "TProjectPoint",
                "TUserPoints:id,t_project_id,m_user_id,point_type_m_kv_id,point_grant_type_m_kv_id,point,memo",
                "MCustomer:id,name,cd"
            ]);
        return $query;
    }

    /**物件Id指定した場合 */
    public function getTProject4PointQuery(int $id)
    {

        $query = $this->projectModel::select(
            'id',
            'm_branch_id',
            'sales_m_user_id',
            'm_customer_id',
            'cd',
            'name',
            'ordered_at',
            'sales_completed_at',
            'total_cost',
            'total_sell_price',
            'created_m_user_id',
            DB::raw('COALESCE(
                (SELECT SUM(t_sale_details.total_price)
                 FROM t_sale_details
                 WHERE t_sale_details.t_project_id = t_projects.id
                 AND t_sale_details.deleted_at IS NULL), 0
             ) AS total_sale_price')
        )
            ->with([
                "TProjectProducts:id,t_project_id,name",
                "TProjectProducts.TProjectProductProcesses:id,t_project_product_id,m_process_category_id",
                "TProjectProducts.TProjectProductProcesses.TProductionProcessPlans",
                "TProjectProducts.TProjectProductProcesses.TProductionResults",
                "TProjectProducts.TProjectProductProcesses.TProductionResults.TProductionResultUsers",
                "TProjectPoint",
                "TUserPoints:id,t_project_id,m_user_id,point_type_m_kv_id,point_grant_type_m_kv_id,point,memo",
                "TProjectDeliveries:id,t_project_id,delivery_at",
                "TProjectDeliveries.TProjectConstructionResults:id,t_project_delivery_id",
                "TProjectDeliveries.TProjectConstructionResults.TProjectConstructionResultUsers:id,t_project_construction_result_id,m_user_id",
                "MCustomer:id,name,cd"
            ])->where("id", $id);

        return $query;
    }


    /**物件リストの取得、ポイント申請用 */
    public function getTProject4Point(Request $req)
    {
        $id = $req->input("id");
        $cd = $req->input("cd");
        $sales_completed_at_from = $req->input("sales_completed_at_from");
        $sales_completed_at_to = $req->input("sales_completed_at_to");
        $created_m_user_id = $req->input("created_m_user_id");
        $sales_m_user_id = $req->input("sales_m_user_id");
        $m_customer_id = $req->input("m_customer_id");
        $m_branch_id = $req->input("m_branch_id");
        $profit_per_from = $req->input("profit_per_from");
        $profit_per_to = $req->input("profit_per_to");
        $is_applicated = $req->input("is_applicated");

        if ($id > 0) {
            $query = $this->getTProject4PointQuery($id);
            $res = $query->first();
        } else {
            $query = $this->getTProject4PointQueryList()
                ->whereBetween("sales_completed_at", [$sales_completed_at_from, $sales_completed_at_to])
                ->whereDoesntHave("TProjectPoint", function ($subquery) {
                    $subquery->whereNotNull('closed_at');
                });

            if (!empty($cd)) {
                $query = $query->where("cd", $cd);
            }

            if (!empty($sales_m_user_id)) {
                $query = $query->where("sales_m_user_id", $sales_m_user_id);
            }

            if (!empty($created_m_user_id)) {
                $query = $query->where("created_m_user_id", $created_m_user_id);
            }

            if (!empty($m_branch_id)) {
                $query = $query->where("m_branch_id", $m_branch_id);
            }
            if (!empty($m_customer_id)) {
                $query = $query->where("m_customer_id", $m_customer_id);
            }

            if (!empty($profit_per_from)) {
                $query = $query->where("profit_per", ">=", $profit_per_from);
            }

            if (!empty($profit_per_to)) {
                $query = $query->where("profit_per", "<=", $profit_per_to);
            }

            if ($is_applicated != "") {
                if ($is_applicated == "0") {
                    $query = $query->whereDoesntHave("TProjectPoint", function ($subquery) {
                        $subquery->whereNotNull('applicated_at');
                    });
                } else {
                    $query = $query->whereHas("TProjectPoint", function ($subquery) {
                        $subquery->whereNotNull('applicated_at');
                    });
                }
            }


            $res = $query
                ->orderByRaw($this->orderByClause($req, 'sales_completed_at'))
                ->paginate(100);
        }
        return $res;
    }

    //**物件リストの取得、ポイント締め用 */
    public function getTProject4PointClosing(Request $req)
    {
        $id = $req->input("id");
        $cd = $req->input("cd");
        $sales_completed_at_from = $req->input("sales_completed_at_from");
        $sales_completed_at_to = $req->input("sales_completed_at_to");
        $created_m_user_id = $req->input("created_m_user_id");
        $sales_m_user_id = $req->input("sales_m_user_id");
        $m_customer_id = $req->input("m_customer_id");
        $m_branch_id = $req->input("m_branch_id");
        $profit_per_from = $req->input("profit_per_from");
        $profit_per_to = $req->input("profit_per_to");
        $is_closed = $req->input("is_closed");

        if ($id > 0) {
            $query = $this->getTProject4PointQuery($id);
            $res = $query->first();
        } else {
            $query = $this->getTProject4PointQueryList()
                ->whereBetween("sales_completed_at", [$sales_completed_at_from, $sales_completed_at_to])
                ->whereHas('TSaleDetails')
                ->whereNotExists(function ($query1) {
                    $query1->select(DB::raw(1))
                        ->from('t_sale_details')
                        ->join('t_sales', 't_sale_details.t_sale_id', '=', 't_sales.id')
                        ->whereColumn('t_projects.id', 't_sale_details.t_project_id')
                        ->where('t_sales.t_complete_id', '<=', 0)
                        ->whereNull('t_sales.deleted_at')
                        ->whereNull('t_sale_details.deleted_at');
                })
                ->whereHas("TProjectPoint", function ($query2) {
                    $query2->whereNotNull('applicated_at');
                });

            if (!empty($cd)) {
                $query = $query->where("cd", $cd);
            }

            if (!empty($sales_m_user_id)) {
                $query = $query->where("sales_m_user_id", $sales_m_user_id);
            }

            if (!empty($created_m_user_id)) {
                $query = $query->where("created_m_user_id", $created_m_user_id);
            }

            if (!empty($m_branch_id)) {
                $query = $query->where("m_branch_id", $m_branch_id);
            }
            if (!empty($m_customer_id)) {
                $query = $query->where("m_customer_id", $m_customer_id);
            }

            if (!empty($profit_per_from)) {
                $query = $query->where("profit_per", ">=", $profit_per_from);
            }

            if (!empty($profit_per_to)) {
                $query = $query->where("profit_per", "<=", $profit_per_to);
            }

            if ($is_closed != "") {
                if ($is_closed == "0") {
                    $query = $query->whereDoesntHave("TProjectPoint", function ($subquery) {
                        $subquery->whereNotNull('closed_at');
                    });
                } else {
                    $query = $query->whereHas("TProjectPoint", function ($subquery) {
                        $subquery->whereNotNull('closed_at');
                    });
                }
            }

            $res = $query
                ->orderByRaw($this->orderByClause($req, 'sales_completed_at'))
                ->paginate(50);
        }
        return $res;
    }

    public function show($id)
    {
        $row = $this->model::find($id);

        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }
        return $row;
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


    protected function saveRow($request, $row)
    {
        $isClosing = false;
        $closedAt = null;

        //締め処理かどうかチェック
        if (isset($request['closed_at'])) {
            $isClosing = true;
            if ($request['closed_at'] != null) {
                $closedAt = $request['closed_at'];
            }
        }

        $trimedRow = $request->all();
        $row->fill($trimedRow);

        DB::beginTransaction();
        if ($isClosing) {
            if (is_null($closedAt)) {
                $this->DeleteTUserPoints($row->t_project_id);
            } else {
                $this->InsertTUserPoints($row);
            }
        }

        try {
            $row->save();
        } catch (\Exception $e) {
            DB::rollback();
            $this->throwDbError($e);
        }

        DB::commit();
    }

    /**
     * 一括確定保存
     */
    public function batchSave(Request $request)
    {
        $tProjectPoints = $request->all();

        $returnArr = array();

        DB::beginTransaction();
        foreach ($tProjectPoints as $tProjectPoint) {
            $id = $tProjectPoint['id'];
            if ($id == 0) {
                $row = new $this->model();
            } else {
                $row = $this->model::find($id);
            }
            $row->fill($tProjectPoint);
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

    /**
     * 一括確定保存
     */
    public function batchClosingSave(Request $request)
    {
        $tProjectPoints = $request->all();

        $returnArr = array();

        if (count($tProjectPoints) == 0) return $returnArr;

        DB::beginTransaction();
        foreach ($tProjectPoints as $tProjectPoint) {
            $id = $tProjectPoint['id'];
            $closedAt = null;

            //締めるかどうかチェック
            if ($tProjectPoint['closed_at'] != null) {
                $closedAt = $tProjectPoint['closed_at'];
            }

            $row = $this->model::find($id);
            $row->fill($tProjectPoint);
            try {
                $row->save();
                if (is_null($closedAt)) {
                    $this->DeleteTUserPoints($row->t_project_id);
                } else {
                    $this->InsertTUserPoints($row);
                }
            } catch (PDOException $e) {
                DB::rollBack();
                $this->throwDbError($e);
            } catch (ErrorException $e) {
                DB::rollBack();
                log::error($e); // 处理 ErrorException
            }

            array_push($returnArr, $this->show($row['id']));
        }

        DB::commit();

        return $returnArr;
    }

    /**
     * 締めを取消のチェック
     */
    public function validateClosing(Request $request)
    {
        $result = new \stdClass();
        $result->success = true;
        $message = "";

        // 1. リクエストから t_project_id のリストを取得
        $tProjectIds = $request->all();
        if (count($tProjectIds) == 0) {
            return $result;
        }

        // 2. 一度にすべての t_project_id に対応する t_user_point レコードを取得
        $userPoints = $this->userPoint::with([
            "MUser:id,full_name", // ユーザー情報を関連付けてロード
        ])
            ->whereIn("t_project_id", $tProjectIds) // `in` を使って t_project_id に関連するすべてのレコードを取得
            ->get();

        // 3. 取得した t_user_point を m_user_id ごとにグループ化
        $userPointsGrouped = $userPoints->groupBy('m_user_id');

        // 4. 担当者の名前を格納する配列を作成
        $userNamesWithNegativePoints = [];

        // 5. 各 m_user_id に対してポイントの合計を計算し、t_project_id の合計ポイントと比較
        foreach ($userPointsGrouped as $userId => $points) {
            // 5.1 m_user_id のすべてのポイントの合計を計算
            $projectPointSum = $points->sum('point');
            $userFullName = $points->first()->MUser->full_name;

            // 5.2 m_user_id に対応するすべてのポイントを取得（6000001 と 6000002 の場合の正負ポイントを考慮）
            $userPointSum =  $this->userPoint::with([
                "TProject:id,cd,name,sales_completed_at",
                "PointTypeMKv:id,kv_name",
                "PointGrantTypeMKv:id,kv_name",
            ])->where("m_user_id", $userId)
                ->whereIn('point_type_m_kv_id', [6000001, 6000002])
                ->selectRaw('
                    SUM(CASE
                            WHEN point_type_m_kv_id = 6000001 THEN point
                            WHEN point_type_m_kv_id = 6000002 THEN -point
                            ELSE 0
                        END) as pointSum
                ') // case 文で point の符号を調整
                ->pluck('pointSum')
                ->first(); // 合計を取得

            // 5.3 ポイントの合計を浮動小数点型に変換
            $userPointSum = (float)$userPointSum;

            // 5.4 t_project_id の合計ポイントが m_user_id のポイント合計より大きい場合
            if ($projectPointSum > $userPointSum) {
                // 名前を配列に追加
                $userNamesWithNegativePoints[] = $userFullName;
            }
        }

        Log::debug("Self " . json_encode($result));
        Log::debug("Self " . count($userNamesWithNegativePoints));

        // 6. ユーザー名が一つ以上あればメッセージを作成
        if (count($userNamesWithNegativePoints) > 0) {
            Log::debug("Self " . '123');
            $result->success = false;
            $message = "締めを取り消すと、担当者 " . implode(", ", $userNamesWithNegativePoints) . " のポイントがマイナスになってしまいます。";
        }

        $result->message = $message;
        return $result;
    }


    /**ユーザーPt挿入 */
    protected function InsertTUserPoints($row)
    {
        // ログインユーザーId
        $userId = Auth::id();

        $query = $this->getTProject4PointQuery($row['t_project_id']);
        // 物件情報
        $tProject = $query->first()->toArray();

        // 利益の計算
        $totalProfit = $tProject['total_sale_price'] - $tProject['total_cost'];

        // 営業Pt
        $salesPoint = $totalProfit * $row['sales_per'] * 0.01;
        $salesPoint = $this->CalcFraction($this->invalid2zr($salesPoint));
        // 仮制作Pt
        $tmpProdPoint = $totalProfit * $row['prod_per'] * 0.01;
        $tmpProdPoint = $this->CalcFraction($this->invalid2zr($tmpProdPoint));

        // 施工Pt掛け率
        $constructCoef = $row['construct_coef'];
        // 登録Pt掛け率
        $createCoef = $row['create_coef'];

        // 商品数を取得
        $numOfProducts = count($tProject['t_project_products']);

        // 制作実績の初期化
        $productionResults = []; // Initialize an empty array
        foreach ($tProject['t_project_products'] as $product) {
            foreach ($product['t_project_product_processes'] as $process) {
                foreach ($process['t_production_process_plans'] as $plan) {
                    $results = [];
                    // t_production_day_group_id が null の場合はスキップ
                    if (is_null($plan['t_production_day_group_id'])) {
                        continue;
                    }

                    // Group 側での実績
                    if (isset($plan['results']) && count($plan['results']) > 0) {
                        //$results =  $plan['results'];
                        $results = $plan['results'];
                    } else {
                        // Process側での実績
                        $dGroupId = $plan['t_production_day_group_id'];

                        if (is_null($process['t_production_results'])) {
                            continue;
                        }
                        //エラーができた場所です。
                        $notDeleted = array_filter($process['t_production_results'], function ($x) {
                            return is_null($x['deleted_at']);
                        });
                        $results = array_filter($notDeleted, function ($x) use ($dGroupId) {
                            return $x['t_production_day_group_id'] == $dGroupId;
                        });
                    }

                    foreach ($results as $result) {

                        if (is_array($result)) {
                            // 結果が配列の場合の処理
                            foreach ($result['t_production_result_users'] as $user) {
                                $productionResults[] = [
                                    'id' => $user['id'],
                                    'm_user_id' => $user['m_user_id'],
                                ];
                            }
                        } else if (is_object($result)) {
                            // 結果がオブジェクトの場合の処理
                            foreach ($result->toArray()['t_production_result_users'] as $user) {
                                $productionResults[] = [
                                    'id' => $user['id'],
                                    'm_user_id' => $user['m_user_id'],
                                ];
                            }
                        }
                    }
                }
            }
        }

        //施工実績
        $constructionResults = []; // Initialize an empty array
        foreach ($tProject['t_project_deliveries'] as $dlv) {
            foreach ($dlv['t_project_construction_results'] as $res) {
                foreach ($res['t_project_construction_result_users'] as $user) {
                    if (is_null($user["m_user_id"])) continue;
                    $userId = $user['m_user_id'];
                    $foundUser = array_filter($constructionResults, function ($item) use ($userId) {
                        return $item['m_user_id'] == $userId;
                    });

                    if (count($foundUser) == 0) {
                        $constructionResults[] = [
                            'id' => $userId,
                            'm_user_id' => $userId
                        ];
                    }
                }
            }
        }

        //生産実績・施工実績・MIS登録の総和
        $numOfProd = count($productionResults);
        $numOfCons = count($constructionResults) * $numOfProducts * $constructCoef;
        $numOfRegi = $tProject['created_m_user_id'] ? $numOfProducts * $createCoef : 0;
        $numOfResult = $numOfProd + $numOfCons + $numOfRegi;

        $unitPoint = 0;
        if ($tmpProdPoint > 0 && $numOfResult > 0) {
            $unitPoint = $this->CalcFraction($tmpProdPoint / $numOfResult);
        }

        //以降は個人サマリー
        //営業
        $records[] = [
            'm_user_id' => $tProject['sales_m_user_id'],
            't_project_id' => $tProject['id'],
            'point_type_m_kv_id' => 6000001,
            'point_grant_type_m_kv_id' => 6010001,
            'point' => $salesPoint,
            'memo' => '営業'
        ];

        if ($tProject['created_m_user_id'] && $tProject['created_m_user_id'] != $tProject['sales_m_user_id']) {
            // MIS登録
            $records[] = [
                'm_user_id' => $tProject['created_m_user_id'],
                't_project_id' => $tProject['id'],
                'point_type_m_kv_id' => 6000001,
                'point_grant_type_m_kv_id' => 6010004,
                'point' => $this->CalcFraction($unitPoint * $numOfProducts * $createCoef),
                'memo' => 'MIS入力'
            ];
        }

        // 制作
        foreach ($productionResults as $pRes) {
            $foundRowP = array_filter($records, function ($item) use ($pRes) {
                return $item['m_user_id'] == $pRes['m_user_id'] && $item['point_grant_type_m_kv_id'] == 6010002;
            });

            foreach ($foundRowP as $key => $row) {
                $records[$key]['point'] += $this->CalcFraction($unitPoint);  // 直接変更
            }

            if (empty($foundRowP)) {
                $records[] = [
                    'm_user_id' => $pRes['m_user_id'] ?? 0,
                    't_project_id' => $tProject['id'],
                    'point_type_m_kv_id' => 6000001,
                    'point_grant_type_m_kv_id' => 6010002,
                    'point' => $this->CalcFraction($unitPoint),
                    'memo' => '制作'
                ];
            }
        }

        // 施工
        foreach ($constructionResults as $cRes) {
            $foundRowC = array_filter($records, function ($item) use ($cRes) {
                return $item['m_user_id'] === $cRes['m_user_id'] && $item['point_grant_type_m_kv_id'] == 6010003;
            });

            foreach ($foundRowC as $key => $row) {
                $records[$key]['point'] += $this->CalcFraction($unitPoint);  // 直接修改原数组
            }

            if (empty($foundRowC)) {
                $records[] = [
                    'm_user_id' => $cRes['m_user_id'] ?? 0,
                    't_project_id' => $tProject['id'],
                    'point_type_m_kv_id' => 6000001,
                    'point_grant_type_m_kv_id' => 6010003,
                    'point' => $this->CalcFraction($unitPoint * $numOfProducts * $constructCoef),
                    'memo' => '施工'
                ];
            }
        }

        $chargedAt = new DateTime();
        foreach ($records as $item) {
            $row = new $this->userPoint();
            $item['changed_at'] = $chargedAt->format('y-m-d');
            $item['created_m_user_id'] = $userId;
            $item['updated_m_user_id'] = $userId;
            $row->fill($item);
            try {
                $row->save();
            } catch (\Exception $e) {
                $this->throwDbError($e);
            }
        }
    }

    /**
     *  ユーザーPt削除
     */
    public function DeleteTUserPoints($t_project_id)
    {
        $records = $this->userPoint::where('t_project_id', $t_project_id)->get();
        if (empty($records)) {
            return; // 何も削除するものがない場合は終了
        }

        $now = new DateTime();
        $userId = Auth::id();
        try {
            foreach ($records as $row) {
                if (isset($row["id"])) {
                    $row->deleted_at = $now;
                    $row->updated_m_user_id = $userId;
                    $row->delete();
                }
            }
        } catch (\Exception $e) {
            $this->throwDbError($e);
        }
    }

    /**
     * 端数処理
     */
    private function CalcFraction($v)
    {
        if (!$v) return 0;
        $fractionMKv = $this->mkvModel::find(8010501);
        if (!$fractionMKv) return $v;
        $fractionMKvId = intval($fractionMKv['g_01']);

        switch ($fractionMKvId) {
            case 1070003:
                return $this->ceil($v);
            case 1070001:
                return $this->trunc($v);
            case 1070002:
                return $this->round($v);
            default:
                return $v;
        }
    }
}
