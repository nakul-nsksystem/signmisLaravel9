<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SignmisReports\VLedgerPurchase;

class VLedgerPurchaseApiController extends SignmisReportApiController
{
    public function __construct()
    {
        $this->model = VLedgerPurchase::class;
    }

    public function retrieve(Request $request)
    {
        // パラメーターセット([0],[""]はnullに置き換え)
        $param = [
            'trading_day_from1'  => $request['trading_day_from'] ,
            'trading_day_from2'  => $request['trading_day_from'] ,
            'trading_day_from3'  => $request['trading_day_from'] ,
            'trading_day_from4'  => $request['trading_day_from'] ,
            'trading_day_from5'  => $request['trading_day_from'] ,
            'trading_day_from6'  => $request['trading_day_from'] ,
            'trading_day_from7'  => $request['trading_day_from'] ,
            'trading_day_from8'  => $request['trading_day_from'] ,
            'trading_day_from9'  => $request['trading_day_from'] ,
            'trading_day_from10' => $request['trading_day_from'] ,
            'trading_day_from11' => $request['trading_day_from'] ,
            'trading_day_from12' => $request['trading_day_from'] ,
            'trading_day_to1'    => $request['trading_day_to'  ] ,
            'trading_day_to2'    => $request['trading_day_to'  ] ,
            'trading_day_to3'    => $request['trading_day_to'  ] ,
            'trading_day_to4'    => $request['trading_day_to'  ] ,
            'trading_day_to5'    => $request['trading_day_to'  ] ,
            'trading_day_to6'    => $request['trading_day_to'  ] ,
            'm_customer_id1'     => $request['m_customer_id'   ] ,
            'm_customer_id2'     => $request['m_customer_id'   ] ,
            'm_customer_id3'     => $request['m_customer_id'   ] ,
            'm_customer_id4'     => $request['m_customer_id'   ] ,
            'm_customer_id5'     => $request['m_customer_id'   ] ,
            'm_customer_id6'     => $request['m_customer_id'   ] ,
            'm_customer_id7'     => $request['m_customer_id'   ] ,
            'm_customer_id8'     => $request['m_customer_id'   ] ,
            'm_customer_id9'     => $request['m_customer_id'   ] ,
            'm_customer_id10'    => $request['m_customer_id'   ] ,
        ] ;

        // ビュー：買掛元帳
        $details = DB::select(<<<__SQL_EOT__
            WITH
            /* 伝票単位の最終明細id */
            q_max_id AS (/* 伝票時に作成された消費税の判別用として抽出 */
                SELECT MAX(d.id) AS id /* Max明細id */
                  FROM t_p_invoices             AS h /* 仕入     */
                 INNER JOIN t_p_invoice_details AS d /* 仕入明細 */ ON h.id = d.t_p_invoice_id
                 WHERE h.deleted_at                  IS NULL                                    /* 論理削除 */
                   AND d.deleted_at                  IS NULL                                    /* 論理削除 */
                   AND h.supplier_m_customer_id       = :m_customer_id1                         /* 仕入先   */
                   AND h.accounting_date        BETWEEN :trading_day_from1 AND :trading_day_to1 /* 仕入日   */
                 GROUP BY d.t_p_invoice_id
            ) ,

            /* 消費税 */
            q_tax AS (/* 請求締時に作成した消費税(10%・8%)を別の行で出力したかったのでSubQueryにしてます */
                /* 消費税10% */
                SELECT h.id                                    AS slip_no         , /* 伝票no   */
                       1                                       AS id              , /* id       */
                       h.accounting_date                       AS accounting_date , /* 仕入日   */
                       k1.kv_name                              AS category_name   , /* カテゴリ */
                       CONCAT('【', k1.kv_name, '：10%', '】') AS product_name    , /* 商品名   */
                       h.tax_normal                            AS tax               /* 消費税   */
                  FROM t_p_invoices AS h  /* 仕入 */
                  LEFT JOIN m_kvs   AS k1 /* 区分 */ ON h.slip_m_kv_id  = k1.id
                 WHERE h.deleted_at                  IS NULL                                    /* 論理削除       */
                   AND h.supplier_m_customer_id       = :m_customer_id2                         /* 仕入先         */
                   AND h.accounting_date        BETWEEN :trading_day_from2 AND :trading_day_to2 /* 仕入日         */
                   AND h.slip_m_kv_id                 = 1160003                                 /* 締消費税が対象 */
                   AND h.tax_normal                  <> 0                                       /* 通常税率分のみ */

                /* 消費税8% 軽減税率分 */
                 UNION ALL
                SELECT h.id                                    AS slip_no         , /* 伝票no   */
                       2                                       AS id              , /* id       */
                       h.accounting_date                       AS accounting_date , /* 仕入日   */
                       k1.kv_name                              AS category_name   , /* カテゴリ */
                       CONCAT('【', k1.kv_name, '：8%',  '】') AS product_name    , /* 商品名   */
                       h.tax_reduced                           AS tax               /* 消費税   */
                  FROM t_p_invoices AS h  /* 仕入 */
                  LEFT JOIN m_kvs   AS k1 /* 区分 */ ON h.slip_m_kv_id  = k1.id
                 WHERE h.deleted_at                  IS NULL                                    /* 論理削除       */
                   AND h.supplier_m_customer_id       = :m_customer_id3                         /* 仕入先         */
                   AND h.accounting_date        BETWEEN :trading_day_from3 AND :trading_day_to3 /* 仕入日         */
                   AND h.slip_m_kv_id                 = 1160003                                 /* 消費税が対象   */
                   AND h.tax_reduced                 <> 0                                       /* 軽減税率分のみ */
            ) ,

            /* 期間仕入 */
            q_purchases AS (
                SELECT h.id                                                                             AS slip_no         , /* 伝票no   */
                       d.id                                                                             AS id              , /* id       */
                       h.accounting_date                                                                AS accounting_date , /* 仕入日   */
                       IFNULL(k2.kv_name, k3.kv_name)                                                   AS category_name   , /* カテゴリ */
                       pr.cd                                                                            AS project_cd      , /* 物件cd   */
                       CASE WHEN h.slip_m_kv_id      = 1160003 THEN k3.kv_name ELSE d.material_name END AS product_name    , /* 商品名   */
                       CASE WHEN d.purchase_m_kv_id <> 1200005 THEN d.qty                           END AS qty             , /* 数量     */
                       k1.kv_name                                                                       AS unit_m_kv_name  , /* 単位     */
                       CASE WHEN k2.g_01    = 4 THEN NULL
                            WHEN d.tax_rate = 0 THEN '非課税'
                            ELSE CONCAT(CONVERT(d.tax_rate * 100, SIGNED), '%')
                       END                                                                              AS tax_rate        , /* 税率     */
                       CASE WHEN d.purchase_m_kv_id <> 1200005 THEN d.total_price                   END AS total_price     , /* 仕入     */
                       CASE /* 税区分で対象となる消費税を出力 */
                            WHEN h.account_m_kv_id = 1060001                              THEN d.tax /* 明細 */
                        --  WHEN h.account_m_kv_id = 1060003 AND h.slip_m_kv_id = 1160003 THEN h.tax /* 締   */ /* 請求消費税は[q_tax]で実装 */
                            WHEN h.account_m_kv_id = 1060002 AND q1.id IS NOT NULL        THEN h.tax /* 伝票 */
                            ELSE NULL
                       END                                                                              AS tax             , /* 消費税   */
                       d.slip_memo                                                                      AS d_slip_memo       /* 備考     */

                  FROM t_p_invoices             AS h  /* 仕入                */
                  LEFT JOIN t_p_invoice_details AS d  /* 仕入明細            */ ON h.id                     = d.t_p_invoice_id
                 INNER JOIN m_customers         AS cu /* 仕入先              */ ON h.supplier_m_customer_id = cu.id
                  LEFT JOIN m_kvs               AS k1 /* 区分(単位)          */ ON d.unit_m_kv_id           = k1.id
                  LEFT JOIN m_kvs               AS k2 /* 区分(出荷)          */ ON d.purchase_m_kv_id       = k2.id
                  LEFT JOIN m_kvs               AS k3 /* 区分(伝票)          */ ON h.slip_m_kv_id           = k3.id
                  LEFT JOIN q_max_id            AS q1 /* 伝票単位のMax明細id */ ON d.id                     = q1.id
                  LEFT JOIN t_projects          AS pr /* 物件                */ ON d.t_project_id           = pr.id

                 WHERE h.deleted_at                  IS NULL                                    /* 論理削除         */
                   AND d.deleted_at                  IS NULL                                    /* 論理削除         */
                   AND h.t_complete_id               >= 0                                       /* 残高用請求は除外 */
                   AND h.slip_m_kv_id                <> 1160003                                 /* 請求消費税は除外 */
                   AND h.supplier_m_customer_id       = :m_customer_id4                         /* 仕入先           */
                   AND h.accounting_date        BETWEEN :trading_day_from4 AND :trading_day_to4 /* 仕入日           */
            ) ,

            /* 期間支払 */
            q_payments AS (
                SELECT p.id                     AS id            , /* id       */
                       p.payment_day            AS payment_day   , /* 支払日   */
                       p.payment_price          AS payment_price , /* 支払     */
                       '支払'                   AS category_name , /* カテゴリ */
                       CONCAT(TRIM(CONCAT('[支払：', IFNULL(k1.kv_name, ''), ' ', IFNULL(bill_no, ''), ' ', IFNULL(DATE_FORMAT(bill_due_day, '%Y/%m/%d'), ''))), ']')
                                                AS payment_name  , /* 支払内容 */
                       IFNULL(p.memo, '')       AS memo            /* 備考     */
                  FROM t_complete_details AS p
                  LEFT JOIN m_kvs         AS k1 ON p.payment_m_kv_id = k1.id
                 WHERE p.deleted_at           IS NULL                                    /* 論理削除 */
                   AND p.dealing_m_kv_id       = 1010002                                 /* 買       */
                   AND p.m_customer_id         = :m_customer_id5                         /* 仕入先   */
                   AND p.payment_day     BETWEEN :trading_day_from5 AND :trading_day_to5 /* 支払日   */
            ) ,

            /* 初回残高 */
            q_first_balances AS(
                /* 指定期間中の初回残高データを抽出 */
                SELECT c.m_customer_id AS m_customer_id , /* 仕入先id */
                       c.grand_total   AS grand_total     /* 請求額   */
                  FROM t_completes AS c /* 請求 */
                 WHERE c.dealing_m_kv_id       = 1010002                                 /* 買           */
                   AND c.id                    > 0                                       /* 通常請求のみ */
                   AND c.m_customer_id         = :m_customer_id6                         /* 仕入先       */
                   AND c.complete_day    BETWEEN :trading_day_from6 AND :trading_day_to6 /* 請求日       */
                   AND c.memo                  = '残高'                                  /* 初回残高     */
            ) ,

            /* 直前請求 */
            q_before_complets AS(
                SELECT c.m_customer_id AS m_customer_id ,      /* 仕入先id     */
                       MAX(c.id)       AS id                   /* 最終請求id   */
                  FROM t_completes AS c
                 WHERE c.dealing_m_kv_id  = 1010002            /* 買           */
                   AND c.id               > 0                  /* 通常請求のみ */
                   AND c.m_customer_id    = :m_customer_id7    /* 仕入先       */
                   AND c.complete_day     < :trading_day_from7 /* 開始日より前 */
                 GROUP BY c.m_customer_id
            ) ,

            /* 直後請求 */
            q_after_complets AS(
                SELECT c.m_customer_id AS m_customer_id ,      /* 仕入先id     */
                       MIN(c.id)       AS id                   /* 直近請求id   */
                  FROM t_completes AS c
                 WHERE c.dealing_m_kv_id  = 1010002            /* 買           */
                   AND c.id              >  0                  /* 通常請求のみ */
                   AND c.m_customer_id    = :m_customer_id8    /* 仕入先       */
                   AND c.complete_day    >= :trading_day_from8 /* 開始日以降   */
                 GROUP BY c.m_customer_id
            ) ,

            /* 残高 */
            q_balances AS (
                SELECT SUM(balance) AS balance /* 残高 */
                  FROM (/* 初回残高 指定開始日以前で1件も無い場合に残高0として抽出 */
                        SELECT NULL AS m_customer_id , /* 取引先id */
                               0    AS balance         /* 請求額   */

                        /* 初回残高 */
                         UNION ALL
                        SELECT c.m_customer_id AS m_customer_id , /* 仕入先id */
                               c.grand_total   AS balance         /* 請求額   */
                          FROM q_first_balances AS c /* 初回残高 */

                        /* 直前請求の請求額 */
                         UNION ALL
                        SELECT c.m_customer_id AS m_customer_id , /* 仕入先id */
                               c.grand_total   AS balance         /* 請求額   */
                          FROM t_completes            AS c /* 請求     */
                         INNER JOIN q_before_complets AS b /* 直前請求 */ ON c.id = b.id

                        /* 開始日より前の支払(締済分) */
                         UNION ALL
                        SELECT p.m_customer_id           AS m_customer_id , /* 仕入先id */
                               SUM(p.payment_price) * -1 AS balance         /* 支払     */
                          FROM t_complete_details    AS p /* 支払     */
                         INNER JOIN q_after_complets AS a /* 直後請求 */ ON p.t_complete_id = a.id
                         WHERE p.deleted_at      IS NULL                /* 論理削除 */
                           AND p.dealing_m_kv_id  = 1010002             /* 買       */
                           AND p.payment_day      < :trading_day_from9  /* 支払日   */
                         GROUP BY p.m_customer_id

                        /* 開始日より前の支払(未締分) */
                         UNION ALL
                        SELECT p.m_customer_id           AS m_customer_id , /* 仕入先id */
                               SUM(p.payment_price) * -1 AS balance         /* 支払     */
                          FROM t_complete_details AS p /* 支払 */
                         WHERE p.deleted_at      IS NULL                /* 論理削除 */
                           AND p.dealing_m_kv_id  = 1010002             /* 買       */
                           AND p.t_complete_id    = 0                   /* 未締     */
                           AND p.m_customer_id    = :m_customer_id9     /* 仕入先   */
                           AND p.payment_day      < :trading_day_from10 /* 支払日   */
                         GROUP BY p.m_customer_id

                        /* 開始日より前の仕入(締済分) */
                         UNION ALL
                        SELECT h.supplier_m_customer_id                                        AS m_customer_id , /* 仕入先id */
                               ROUNDING(SUM(h.total_price + h.tax), cu.price_fraction_m_kv_id) AS balance         /* 仕入合計 */
                          FROM t_p_invoices          AS h  /* 仕入     */
                         INNER JOIN q_after_complets AS a  /* 直後請求 */ ON h.t_complete_id          = a.id
                         INNER JOIN m_customers      AS cu /* 仕入先   */ ON h.supplier_m_customer_id = cu.id
                         WHERE h.deleted_at      IS NULL                /* 論理削除 */
                           AND h.accounting_date  < :trading_day_from11 /* 仕入日   */
                         GROUP BY h.supplier_m_customer_id

                        /* 開始日より前の仕入(未締分) */
                         UNION ALL
                        SELECT h.supplier_m_customer_id                                        AS m_customer_id , /* 仕入先id */
                               ROUNDING(SUM(h.total_price + h.tax), cu.price_fraction_m_kv_id) AS balance         /* 仕入合計 */
                          FROM t_p_invoices     AS h  /* 仕入   */
                         INNER JOIN m_customers AS cu /* 仕入先 */ ON h.supplier_m_customer_id = cu.id
                         WHERE h.deleted_at             IS NULL                /* 論理削除 */
                           AND h.t_complete_id           = 0                   /* 未締     */
                           AND h.supplier_m_customer_id  = :m_customer_id10    /* 仕入先   */
                           AND h.accounting_date         < :trading_day_from12 /* 仕入日   */
                         GROUP BY h.supplier_m_customer_id
                       ) /* MySQL[1248: every derived table must have its own alias] 対応 */
                         AS sub_query
            ) ,

            /* 本体 */
            q_body AS (
                SELECT trading_day                                    AS trading_day     , /* 取引日   */
                       sort                                           AS sort            , /* ソート   */
                       slip_no                                        AS slip_no         , /* 伝票no   */
                       id                                             AS id              , /* id       */
                       category_name                                  AS category_name   , /* カテゴリ */
                       product_name                                   AS product_name    , /* 商品名   */
                       project_cd                                     AS project_cd      , /* 物件cd   */
                       qty                                            AS qty             , /* 数量     */
                       unit_m_kv_name                                 AS unit_m_kv_name  , /* 単位     */
                       tax_rate                                       AS tax_rate        , /* 税率     */
                       total_price                                    AS total_price     , /* 仕入     */
                       tax                                            AS tax             , /* 消費税   */
                       payment_price                                  AS payment_price   , /* 支払     */
                       SUM(carried_forward)
                       OVER (ORDER BY trading_day, sort, slip_no, id) AS carried_forward   /* 繰越計算 */
                  FROM (/* 残高 */
                        SELECT NULL            AS trading_day     , /* 取引日   */
                               1               AS sort            , /* ソート   */
                               NULL            AS slip_no         , /* 伝票no   */
                               NULL            AS id              , /* id       */
                               '繰越'          AS category_name   , /* カテゴリ */
                               '繰越残高'      AS product_name    , /* 商品名   */
                               NULL            AS project_cd      , /* 物件cd   */
                               NULL            AS qty             , /* 数量     */
                               NULL            AS unit_m_kv_name  , /* 単位     */
                               NULL            AS tax_rate        , /* 税率     */
                               NULL            AS total_price     , /* 仕入     */
                               NULL            AS tax             , /* 消費税   */
                               NULL            AS payment_price   , /* 支払     */
                               balance         AS balance         , /* 残高     */
                               balance         AS carried_forward   /* 繰越     */
                          FROM q_balances

                        /* 仕入 */
                         UNION ALL
                        SELECT accounting_date                         AS trading_day     , /* 取引日   */
                               2                                       AS sort            , /* ソート   */
                               slip_no                                 AS slip_no         , /* 伝票no   */
                               id                                      AS id              , /* id       */
                               category_name                           AS category_name   , /* カテゴリ */
                               product_name                            AS product_name    , /* 商品名   */
                               project_cd                              AS project_cd      , /* 物件cd   */
                               qty                                     AS qty             , /* 数量     */
                               unit_m_kv_name                          AS unit_m_kv_name  , /* 単位     */
                               tax_rate                                AS tax_rate        , /* 税率     */
                               total_price                             AS total_price     , /* 仕入     */
                               tax                                     AS tax             , /* 消費税   */
                               NULL                                    AS payment_price   , /* 支払     */
                               NULL                                    AS balance         , /* 残高     */
                               IFNULL(total_price, 0) + IFNULL(tax, 0) AS carried_forward   /* 繰越     */
                          FROM q_purchases

                        /* 消費税(8%・10%) */
                         UNION ALL
                        SELECT accounting_date AS trading_day     , /* 取引日   */
                               4               AS sort            , /* ソート   */
                               slip_no         AS slip_no         , /* 伝票no   */
                               id              AS id              , /* id       */
                               category_name   AS category_name   , /* カテゴリ */
                               product_name    AS product_name    , /* 商品名   */
                               NULL            AS project_cd      , /* 物件cd   */
                               NULL            AS qty             , /* 数量     */
                               NULL            AS unit_m_kv_name  , /* 単位     */
                               NULL            AS tax_rate        , /* 税率     */
                               NULL            AS total_price     , /* 仕入     */
                               tax             AS tax             , /* 消費税   */
                               NULL            AS payment_price   , /* 支払     */
                               NULL            AS balance         , /* 残高     */
                               tax             AS carried_forward   /* 繰越     */
                          FROM q_tax

                        /* 支払 */
                         UNION ALL
                        SELECT payment_day                     AS trading_day     , /* 取引日   */
                               3                               AS sort            , /* ソート   */
                               NULL                            AS slip_no         , /* 伝票no   */
                               id                              AS id              , /* id       */
                               category_name                   AS category_name   , /* カテゴリ */
                               CONCAT(payment_name, ' ', memo) AS product_name    , /* 商品名   */
                               NULL                            AS project_cd      , /* 物件cd   */
                               NULL                            AS qty             , /* 数量     */
                               NULL                            AS unit_m_kv_name  , /* 単位     */
                               NULL                            AS tax_rate        , /* 税率     */
                               NULL                            AS total_price     , /* 仕入     */
                               NULL                            AS tax             , /* 消費税   */
                               payment_price                   AS payment_price   , /* 支払     */
                               NULL                            AS balance         , /* 残高     */
                               payment_price * -1              AS carried_forward   /* 繰越     */
                          FROM q_payments
                       ) /* MySQL[1248: every derived table must have its own alias] 対応 */
                         AS sub_query
            )

            /* 表示用 */
            SELECT DATE_FORMAT(trading_day, '%Y-%m-%d') AS trading_day     , /* 取引日   */
                   slip_no                              AS slip_no         , /* 伝票no   */
                   category_name                        AS category_name   , /* カテゴリ */
                   product_name                         AS product_name    , /* 商品名   */
                   project_cd                           AS project_cd      , /* 物件cd   */
                   CAST(qty             AS SIGNED)      AS qty             , /* 数量     */
                   unit_m_kv_name                       AS unit_m_kv_name  , /* 単位     */
                   CAST(total_price     AS SIGNED)      AS total_price     , /* 仕入額   */
                   tax_rate                             AS tax_rate        , /* 税率     */
                   CAST(tax             AS SIGNED)      AS tax             , /* 消費税   */
                   CAST(payment_price   AS SIGNED)      AS payment_price   , /* 支払額   */
                   CAST(carried_forward AS SIGNED)      AS carried_forward   /* 繰越残高 */

              FROM q_body

             ORDER BY trading_day, sort, slip_no, id
        __SQL_EOT__, $param);

        return collect($details) ;
    }

}
