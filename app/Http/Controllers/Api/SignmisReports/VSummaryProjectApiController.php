<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VSummaryProject;

// 物件一覧表
class VSummaryProjectApiController extends SignmisReportApiController
{
    public function __construct()
    {
        $this->model = VSummaryProject::class;
    }

    public function retrieve(Request $request)
    {
        // パラメーターセット([0],[""]はnullに置き換え)
        $param = [
            'complete_day_from1' => $request['complete_day_from' ] ?? null,
            'complete_day_from2' => $request['complete_day_from' ] ?? null,
            'complete_day_to1'   => $request['complete_day_to'   ] ?? null,
            'complete_day_to2'   => $request['complete_day_to'   ] ?? null,
            'm_branch_id'              => $request['m_branch_id'    ] == 0  ? null : $request['m_branch_id'] ,
            'm_user_id'                => $request['m_user_id'      ] == 0  ? null : $request['m_user_id'] ,
            'm_customer_id'            => $request['m_customer_id'  ] == 0  ? null : $request['m_customer_id'] ,
            'profit_per_from'          => $request['profit_per_from'] == "" ? null : $request['profit_per_from'] ,
            'profit_per_to'            => $request['profit_per_to'  ] == "" ? null : $request['profit_per_to'] ,
        ] ;

        // ビュー：売掛残高一覧表
        $details = DB::select(<<<__SQL_EOT__
            WITH
            /* 売上明細 */
          	q_sales AS ( /* 売上開始日完了日を取得 */
                SELECT
                    t1.t_project_id,
                    MAX(t1.accounting_date) AS max_accounting_date,
                    MIN(t1.accounting_date) AS min_accounting_date,
                    t1.next_due_date AS complete_day
                FROM (
                    SELECT
                        slds.t_project_id,
                        sl.accounting_date,
                        NEXT_DUE_DATE(t_projects.sales_completed_at, m_customers.closing_date) AS next_due_date
                    FROM t_sale_details AS slds
                    INNER JOIN t_sales AS sl ON slds.t_sale_id = sl.id AND sl.deleted_at IS NULL
                    INNER JOIN t_projects ON slds.t_project_id = t_projects.id AND t_projects.deleted_at IS NULL
                    INNER JOIN m_customers ON t_projects.m_customer_id = m_customers.id AND m_customers.deleted_at IS NULL
                    WHERE slds.deleted_at IS NULL AND t_projects.ordered_t_project_id IS NULL
                ) AS t1
                WHERE t1.next_due_date BETWEEN :complete_day_from1 AND :complete_day_to1
                GROUP BY t1.t_project_id
            ),
            /* 物件商品・工程 */
            q_products AS ( /* 商品点数と各工程コスト取得 */
                SELECT
                    sub.t_project_id,
                    COUNT(DISTINCT sub.product_id) AS product_cnt
                FROM (
                    SELECT
                        prd.id AS product_id,
                        prd.t_project_id,
                        NEXT_DUE_DATE(t_projects.sales_completed_at, m_customers.closing_date) AS next_due_date
                    FROM t_project_products AS prd
                    INNER JOIN t_projects ON prd.t_project_id = t_projects.id AND t_projects.deleted_at IS NULL
                    INNER JOIN m_customers ON t_projects.m_customer_id = m_customers.id AND m_customers.deleted_at IS NULL
                    WHERE prd.deleted_at IS NULL AND t_projects.ordered_t_project_id IS NULL
                ) AS sub
                WHERE sub.next_due_date BETWEEN :complete_day_from2 AND :complete_day_to2
                GROUP BY sub.t_project_id
            ),
            /* 本体 */
            q_body AS (
                SELECT
                    pj.id                                                              AS t_project_id        , /* 物件id */
                    pj.m_branch_id                                                     AS m_branch_id         , /* 受注拠点id */
                    pj.sales_m_user_id                                                 AS sales_m_user_id     , /* 営業担当id */
                    pj.m_customer_id                                                   AS m_customer_id       , /* 取引先id */
                    pj.cd                                                              AS t_project_cd        , /* 物件CD */
                    pj.name                                                            AS t_project_name      , /* 物件名 */
                    q_products.product_cnt                                             AS product_cnt         , /* 商品点数 */
                    pj.ordered_at                                                      AS ordered_at          , /* 受注日 */
                    pj.sales_completed_at                                              AS sales_completed_at  , /* 売上完了日 */
                    q_sales.complete_day                                               AS complete_day        , /* 請求予定日 */
                    pj.total_sell_price                                                AS total_sell_price    , /* 金額 */
                    pj.total_profit                                                    AS total_profit        , /* 粗利 */
                    pj.profit_per                                                      AS profit_per          , /* 粗利% */
                    q_sales.max_accounting_date                                        AS max_accounting_date , /* 売上開始日 */
                    q_sales.min_accounting_date                                        AS min_accounting_date   /* 最終売上日 */
                FROM t_projects AS pj
              	INNER JOIN q_sales ON pj.id = q_sales.t_project_id
          		INNER JOIN q_products ON pj.id = q_products.t_project_id
                INNER JOIN m_branches  ON pj.m_branch_id = m_branches.id  AND m_branches.deleted_at  IS NULL
                INNER JOIN m_customers ON pj.m_customer_id   = m_customers.id AND m_customers.deleted_at IS NULL

          	)
            /* 表示用 */
            SELECT
                q_body.t_project_id                                                           AS t_project_id        , /* 物件id */
                IFNULL(m_branches.short_name , m_branches.name )                              AS m_branch_name       , /* 受注拠点名 */
                m_users.full_name                                                             AS m_user_name         , /* 営業担当名 */
                m_customers.cd                                                                AS m_customer_cd       , /* 取引先CD */
                IFNULL(m_customers.short_name, m_customers.name)                              AS m_customer_name     , /* 取引先名 */
                q_body.t_project_cd                                                           AS t_project_cd        , /* 物件CD */
                q_body.t_project_cd                                                           AS t_project_cd        , /* 物件CD */
                q_body.t_project_name                                                         AS t_project_name      , /* 物件名 */
                q_body.product_cnt                                                            AS product_cnt         , /* 商品点数 */
                date_format(q_body.ordered_at,         "%Y-%m-%d")                            AS ordered_at          , /* 受注日 */
                date_format(q_body.min_accounting_date,"%Y-%m-%d")                            AS min_accounting_date , /* 初回売上日 */
                date_format(q_body.sales_completed_at, "%Y-%m-%d")                            AS sales_completed_at  , /* 売上完了日 */
                q_body.complete_day                                                           AS complete_day        , /* 請求予定日 */
                CAST(q_body.total_sell_price AS SIGNED)                                       AS total_price         , /* 金額 */
                CAST(q_body.total_profit     AS SIGNED)                                       AS total_profit        , /* 粗利 */
                CAST(q_body.profit_per       AS DECIMAL(10,2))                                AS profit_per            /* 利益率 */
            FROM q_body
            INNER JOIN m_branches  ON q_body.m_branch_id     = m_branches.id  AND m_branches.deleted_at  IS NULL
            INNER JOIN m_customers ON q_body.m_customer_id   = m_customers.id AND m_customers.deleted_at IS NULL
            INNER JOIN m_users     ON q_body.sales_m_user_id = m_users.id     AND m_users.deleted_at     IS NULL

            /* 条件未指定時は無条件で取得 */
            WHERE m_branches.id  = IFNULL(:m_branch_id     , m_branches.id  ) /* 拠点id   */
              AND m_users.id     = IFNULL(:m_user_id       , m_users.id     ) /* 営業担当id */
              AND m_customers.id = IFNULL(:m_customer_id   , m_customers.id ) /* 取引先id */
              AND profit_per    >= IFNULL(:profit_per_from , profit_per     ) /* 利益率～ */
              AND profit_per    <= IFNULL(:profit_per_to   , profit_per     ) /* ～利益率 */

            ORDER BY m_branches.cd, m_users.cd, sales_completed_at, m_customer_cd, t_project_cd

        __SQL_EOT__, $param);

        return collect($details) ;
    }

}
