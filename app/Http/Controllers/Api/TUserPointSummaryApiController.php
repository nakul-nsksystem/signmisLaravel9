<?php

namespace App\Http\Controllers\Api;

use App\Models\TSale;
use App\Models\TSaleDetail;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class TUserPointSummaryApiController extends BaseApiController
{

    protected $filters = array(
        // 物件のみ
        "has_project" => array(
            "operation" => "is not null",
            "column"    => "t_project_id",
        ),

        // 売上.売上日
        "changed_at_from" => array(
            "operation" => ">=",
            "column"    => "t_user_points.changed_at",
        ),
        "changed_at_to" => array(
            "operation" => "<=",
            "column"    => "t_user_points.changed_at",
        ),

        "sales_completed_at_from" => array(
            "operation" => ">=",
            "column"    => "t_projects.sales_completed_at",
        ),

        "sales_completed_at_to" => array(
            "operation" => "<=",
            "column"    => "t_projects.sales_completed_at",
        ),

        // 拠点
        "m_branch_id" => array(
            "column"    => "m_users.m_branch_id",
        ),

        // 担当者
        "m_user_id" => array(
            "column"    => "t_user_points.m_user_id",
        ),
    );

    public function __construct()
    {
        // baseとなるmodelはt_saleにしてます
        $this->model = "App\Models\TUserPoint";
    }


    /**
     * Retrieve4Summary
     * @OA\Post (
     *     path="/api/tUserPointSummary/retrieve4Summary",
     *     tags={"Point"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                      type="object",
     *                      @OA\Property(
     *                          property="changed_at_from",
     *                          type="datetime"
     *                      ),
     *                      @OA\Property(
     *                          property="changed_at_to",
     *                          type="datetime"
     *                      ),
     *                      @OA\Property(
     *                          property="m_branch_id",
     *                          type="int"
     *                      ),
     *                      @OA\Property(
     *                          property="m_user_id",
     *                          type="int"
     *                      ),
     *                      @OA\Property(
     *                          property="point_type_m_kv_id",
     *                          type="int"
     *                      ),
     *                      @OA\Property(
     *                          property="point_grant_type_m_kv_id",
     *                          type="int"
     *                      )
     *                 ),
     *                 example={
     *                     "changed_at_from":"",
     *                     "changed_at_to":"",
     *                     "m_branch_id":0,
     *                     "m_user_id":0,
     *                     "point_type_m_kv_id":0,
     *                     "point_grant_type_m_kv_id":0
     *                }
     *             )
     *         )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Success",
     *          @OA\JsonContent(
     *              @OA\Property(property="meta", type="object",
     *                  @OA\Property(property="code", type="number", example=200),
     *                  @OA\Property(property="status", type="string", example="success"),
     *                  @OA\Property(property="message", type="string", example=null),
     *              ),
     *
     *          )
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Validation error",
     *          @OA\JsonContent(
     *              @OA\Property(property="meta", type="object",
     *                  @OA\Property(property="code", type="number", example=422),
     *                  @OA\Property(property="status", type="string", example="error"),
     *                  @OA\Property(property="message", type="object",
     *                      @OA\Property(property="email", type="array", collectionFormat="multi",
     *                        @OA\Items(
     *                          type="string",
     *                          example="The email has already been taken.",
     *                          )
     *                      ),
     *                  ),
     *              ),
     *              @OA\Property(property="data", type="object", example={}),
     *          )
     *      )
     * )
     */
    public function retrieve4Summary(Request $req)
    {
        $res = $this->getFiltered($req)
            ->selectRaw("
                        t_user_points.id AS t_user_points_id,
                        t_user_points.t_project_id,
                        m_users.full_name AS m_users_full_name,
                        t_user_points.point_type_m_kv_id,
                        mkvs1.kv_name AS point_type_m_kv_name,
                        t_user_points.point_grant_type_m_kv_id,
                        mkvs2.kv_name AS point_grant_type_m_kv_name,
                        t_projects.cd AS t_projects_cd,
                        t_projects.name AS t_projects_name,
                        t_projects.sales_completed_at,
                        t_user_points.changed_at,
                        t_user_points.point,
                        IFNULL(t_projects.total_cost, 0) AS cost,
                        IFNULL(t_projects.total_sell_price, 0) AS sell_price,
                        t_user_points.memo,
                        COALESCE(
                            (SELECT SUM(t_sale_details.total_price)
                             FROM t_sale_details
                             WHERE t_sale_details.t_project_id = t_projects.id
                             AND t_sale_details.deleted_at IS NULL), 0
                         ) AS sale_price")


            // 担当者
            ->join('m_users', function ($join) {
                $join->on('t_user_points.m_user_id', '=', 'm_users.id')
                    ->whereNull('m_users.deleted_at');
            })

            // 物件
            ->leftJoin('t_projects', function ($join) {
                $join->on('t_user_points.t_project_id', '=', 't_projects.id')
                    ->whereNull('t_projects.deleted_at');
            })


            // ポイントタイプ(論理削除[deleted_at]は表示する)
            ->leftJoin('m_kvs as mkvs1', 't_user_points.point_type_m_kv_id', '=', 'mkvs1.id')

            // ポイント付与タイプ(論理削除[deleted_at]は表示する)
            ->leftJoin('m_kvs as mkvs2', 't_user_points.point_grant_type_m_kv_id', '=', 'mkvs2.id')

            // 削除ずみデータは無視
            ->whereNull('t_user_points.deleted_at')

            ->whereIn('t_user_points.point_type_m_kv_id', [6000001, 6000002]) // 新規条件

            ->orderByRaw('t_user_points.changed_at')

            ->get();
        // ->toSql() ;

        return $res;
    }
}
