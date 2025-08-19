<?php

namespace App\Http\Controllers\Api;

use App\Models\TComplete;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use League\Csv\Writer;
use App\Exceptions\NotFoundErrorException;
use App\Http\Controllers\Api\Traits\LocalFileStorageTrait;

class TCompleteApiController extends BaseApiController
{
    use LocalFileStorageTrait ;

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
            "is_zero_enabled" => "true",
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TComplete";
    }

    // 検索(請求明細)
    public function retrieve(Request $req)
    {
        // パラメーターセット
        $param = [
            'dealing_m_kv_id1' => $req["dealing_m_kv_id"] ,
            'dealing_m_kv_id2' => $req["dealing_m_kv_id"] ,
            'dealing_m_kv_id3' => $req["dealing_m_kv_id"] ,
            'dealing_m_kv_id4' => $req["dealing_m_kv_id"] ,
            'dealing_m_kv_id5' => $req["dealing_m_kv_id"] ,
            'dealing_m_kv_id6' => $req["dealing_m_kv_id"] ,
            'm_branch_id1' => $req["m_branch_id"] ,
            'm_branch_id2' => $req["m_branch_id"] ,
            'm_branch_id3' => $req["m_branch_id"] ,
            'm_branch_id4' => $req["m_branch_id"] ,
            'm_branch_id5' => $req["m_branch_id"] ,
            'm_branch_id6' => $req["m_branch_id"] ,
            'm_customer_id1' => $req["m_customer_id"] ,
            'm_customer_id2' => $req["m_customer_id"] ,
            'm_customer_id3' => $req["m_customer_id"] ,
            'm_customer_id4' => $req["m_customer_id"] ,
            'm_customer_id5' => $req["m_customer_id"] ,
            'm_customer_id6' => $req["m_customer_id"] ,
            'complete_day1' => $req["complete_day"] ,
            'complete_day2' => $req["complete_day"] ,
            'complete_day3' => $req["complete_day"] ,
            'complete_day4' => $req["complete_day"] ,
            'complete_day5' => $req["complete_day"] ,
            'complete_day6' => $req["complete_day"] ,
            'closing_date1' => $req["closing_date"] ,
            'closing_date2' => $req["closing_date"] ,
            'closing_date4' => $req["closing_date"] ,
            'closing_date5' => $req["closing_date"] ,
            'closing_date6' => $req["closing_date"] ,
        ] ;

        // 請求明細
        $res = DB::select(<<<__SQL_EOT__
            SELECT MAX(t_complete_id    ) AS complete_id       ,
                   MAX(complete_day     ) AS complete_day      ,
                   MAX(sub_total        ) AS sub_total         ,
                   MAX(grand_total      ) AS grand_total       ,
                   MAX(check_complete_id) AS check_complete_id ,
                   MAX(last_complete_day) AS last_complete_day ,
                   MAX(last_grand_total ) AS last_grand_total  ,
                   m_customer_id          AS m_customer_id     ,
                   m_customer_cd          AS m_customer_cd     ,
                   m_customer_name        AS m_customer_name   ,
                   mailing_type_m_kv_id   AS mailing_type_m_kv_id
              FROM (/* 請求済 */
                    SELECT c.id                     AS t_complete_id     ,
                           c.complete_day           AS complete_day      ,
                           c.total_price + c.tax    AS sub_total         ,
                           c.grand_total            AS grand_total       ,
                           NULL                     AS check_complete_id ,
                           NULL                     AS last_complete_day ,
                           NULL                     AS last_grand_total  ,
                           cu.id                    AS m_customer_id     ,
                           cu.cd                    AS m_customer_cd     ,
                           cu.name                  AS m_customer_name   ,
                           cu.mailing_type_m_kv_id   AS mailing_type_m_kv_id
                      FROM      t_completes AS c
                     INNER JOIN m_customers AS cu
                        ON c.m_customer_id    = cu.id
                       AND cu.id              = IFNULL(:m_customer_id1, cu.id)
                     WHERE c.dealing_m_kv_id  = :dealing_m_kv_id1
                       AND c.m_branch_id      = :m_branch_id1
                       AND c.complete_day     = :complete_day1
                       AND cu.closing_date    = :closing_date1
                       AND c.deleted_at      IS NULL
                       AND cu.deleted_at     IS NULL
                    UNION ALL
                    /* 未請求 */
                    SELECT NULL                           AS t_complete_id     ,
                           NULL                           AS complete_day      ,
                           NULL                           AS sub_total         ,
                           NULL                           AS grand_total       ,
                           IF(c3.t_completes_id, NULL, 1) AS check_complete_id ,
                           c2.complete_day                AS last_complete_day ,
                           c2.grand_total                 AS last_grand_total  ,
                           cu.id                          AS m_customer_id     ,
                           cu.cd                          AS m_customer_cd     ,
                           cu.name                        AS m_customer_name   ,
                           cu.mailing_type_m_kv_id         AS mailing_type_m_kv_id
                           FROM (
                            SELECT MAX(id)       AS t_completes_id ,
                                   m_customer_id AS m_customer_id
                              FROM t_completes
                             WHERE dealing_m_kv_id  = :dealing_m_kv_id2
                               AND m_branch_id      = :m_branch_id2
                               AND complete_day     < :complete_day2
                               AND deleted_at      IS NULL
                             GROUP BY m_customer_id
                            ) AS c1
                      INNER JOIN t_completes AS c2
                         ON c1.t_completes_id = c2.id
                      INNER JOIN m_customers AS cu
                         ON c1.m_customer_id  = cu.id
                        AND cu.id             = IFNULL(:m_customer_id2, cu.id)
                       LEFT JOIN (
                            SELECT MIN(id)       AS t_completes_id ,
                                   m_customer_id AS m_customer_id
                              FROM t_completes
                             WHERE dealing_m_kv_id  = :dealing_m_kv_id3
                               AND m_branch_id      = :m_branch_id3
                               AND m_customer_id    = IFNULL(:m_customer_id3, m_customer_id)
                               AND complete_day    >= :complete_day3
                               AND deleted_at      IS NULL
                             GROUP BY m_customer_id
                            ) AS c3
                         ON c1.m_customer_id  = c3.m_customer_id
                      WHERE c2.grand_total   != 0
                        AND cu.closing_date   = :closing_date2
                        AND cu.deleted_at    IS NULL
                    UNION ALL
                    /* 売上(未請求) */
                    SELECT NULL                   AS t_complete_id     ,
                           NULL                   AS complete_day      ,
                           NULL                   AS sub_total         ,
                           NULL                   AS grand_total       ,
                           1                      AS check_complete_id ,
                           NULL                   AS last_complete_day ,
                           NULL                   AS last_grand_total  ,
                           s.m_customer_id        AS m_customer_id     ,
                           cu.cd                  AS m_customer_cd     ,
                           cu.name                AS m_customer_name   ,
                           cu.mailing_type_m_kv_id AS mailing_type_m_kv_id
                           FROM      t_sales     AS s
                     INNER JOIN m_customers AS cu
                        ON s.m_customer_id    = cu.id
                       AND cu.id              = IFNULL(:m_customer_id4, cu.id)
                     WHERE s.m_branch_id      = :m_branch_id4
                       AND :dealing_m_kv_id4  = 1010001
                       AND s.t_complete_id    = 0
                       AND s.accounting_date <= :complete_day4
                       AND cu.closing_date    = :closing_date4
                       AND s.deleted_at      IS NULL
                       AND cu.deleted_at     IS NULL
                     GROUP BY s.m_customer_id, cu.cd, cu.name
                     UNION ALL
                     /* 仕入(未請求) */
                     SELECT NULL                     AS t_complete_id     ,
                            NULL                     AS complete_day      ,
                            NULL                     AS sub_total         ,
                            NULL                     AS grand_total       ,
                            1                        AS check_complete_id ,
                            NULL                     AS last_complete_day ,
                            NULL                     AS last_grand_total  ,
                            s.supplier_m_customer_id AS m_customer_id     ,
                            cu.cd                    AS m_customer_cd     ,
                            cu.name                  AS m_customer_name   ,
                            cu.mailing_type_m_kv_id   AS mailing_type_m_kv_id
                           FROM      t_p_invoices AS s
                      INNER JOIN m_customers  AS cu
                         ON s.supplier_m_customer_id = cu.id
                        AND cu.id                    = IFNULL(:m_customer_id5, cu.id)
                      WHERE s.m_branch_id      = :m_branch_id5
                        AND :dealing_m_kv_id5  = 1010002
                        AND s.t_complete_id    = 0
                        AND s.accounting_date <= :complete_day5
                        AND cu.closing_date    = :closing_date5
                        AND s.deleted_at      IS NULL
                        AND cu.deleted_at     IS NULL
                      GROUP BY s.supplier_m_customer_id, cu.cd, cu.name
                     UNION ALL
                    /* 入金(未請求) */
                    SELECT NULL                   AS t_complete_id     ,
                           NULL                   AS complete_day      ,
                           NULL                   AS sub_total         ,
                           NULL                   AS grand_total       ,
                           1                      AS check_complete_id ,
                           NULL                   AS last_complete_day ,
                           NULL                   AS last_grand_total  ,
                           d.m_customer_id        AS m_customer_id     ,
                           cu.cd                  AS m_customer_cd     ,
                           cu.name                AS m_customer_name   ,
                           cu.mailing_type_m_kv_id AS mailing_type_m_kv_id
                          FROM      t_complete_details AS d
                     INNER JOIN m_customers        AS cu
                        ON d.m_customer_id    = cu.id
                       AND cu.id              = IFNULL(:m_customer_id6, cu.id)
                     WHERE d.m_branch_id      = :m_branch_id6
                       AND d.t_complete_id    = 0
                       AND d.dealing_m_kv_id  = :dealing_m_kv_id6
                       AND d.payment_day     <= :complete_day6
                       AND cu.closing_date    = :closing_date6
                       AND d.deleted_at      IS NULL
                       AND cu.deleted_at     IS NULL
                     GROUP BY d.m_customer_id, cu.cd, cu.name
                    ) AS q
            GROUP BY m_customer_id, m_customer_cd, m_customer_name ,mailing_type_m_kv_id
            ORDER BY complete_id IS NULL ASC, m_customer_cd
        __SQL_EOT__, $param) ;

        return collect($res)->paginate(999);
    }

    // 検索([入金・支払]情報ヘッダー)
    public function completes(Request $req)
    {
        // パラメーターセット
        $param = [
            'dealing_m_kv_id1' => $req["dealing_m_kv_id"] ,
            'dealing_m_kv_id2' => $req["dealing_m_kv_id"] ,
            'm_branch_id1'     => $req["m_branch_id"] ,
            'm_branch_id2'     => $req["m_branch_id"] ,
            'm_customer_id1'   => $req["m_customer_id"] ,
            'm_customer_id2'   => $req["m_customer_id"] ,
        ] ;

        // 請求+入金情報
        $res = DB::select(<<<__SQL_EOT__
            SELECT c1.id, c1.complete_day, c1.carry_over, c1.payment_price, c1.total_price + c1.tax AS total_price, c1.grand_total,
                   IFNULL(d.payment_price, 0) AS payment_price_sum,
                   c1.total_price + c1.tax - IFNULL(d.payment_price, 0) AS balance
              FROM t_completes c1
              LEFT JOIN (SELECT c2.target_t_complete_id, SUM(c2.payment_price) AS payment_price
                           FROM t_complete_details c2
                          WHERE c2.dealing_m_kv_id  = :dealing_m_kv_id1
                            AND c2.m_branch_id      = :m_branch_id1
                            AND c2.m_customer_id    = :m_customer_id1
                            AND c2.deleted_at      IS NULL
                          GROUP BY target_t_complete_id
                        ) d
                ON c1.id = d.target_t_complete_id
             WHERE dealing_m_kv_id   = :dealing_m_kv_id2
               AND c1.m_branch_id    = :m_branch_id2
               AND c1.m_customer_id  = :m_customer_id2
               AND c1.deleted_at    IS NULL
             ORDER BY complete_day DESC, id
        __SQL_EOT__, $param) ;

        return collect($res)->paginate(5);
    }

    // チェック用の請求情報
    public function completeInfo(Request $req)
    {
        $res = $this->getFiltered($req)
            ->select('id', 'complete_day')
            ->orderBy('id', 'desc')
            ->get();

        return $res ;
    }

    // チェック用の請求情報1件のみ(売上・仕入用)
    public function completeInfoOne(Request $req)
    {
        $res = $this->getFiltered($req)
            ->max('complete_day');

        return $res ;
    }

    // CSV用の請求情報
    private function completeInfoCSV($completeIds)
    {
        $res = $this->model
            ::selectRaw("m_customers.data_linkage_cd                        AS data_linkage_cd,
                         CONCAT(t_completes.id, '.pdf')                     AS file_name,
                         t_completes.total_price + t_completes.tax          AS sub_total,
                         DATE_FORMAT(t_completes.complete_day, '%Y-%m-%d')  AS complete_day,
                         t_completes.id                                     AS id,
                         m_branches.short_name                              AS branch_name")

            ->join('m_branches', 't_completes.m_branch_id', '=', 'm_branches.id')
            ->join('m_customers', 't_completes.m_customer_id', '=', 'm_customers.id')

            ->whereIn('t_completes.id', $completeIds)

            ->orderBy('id')
            ->get();

        return $res ;
    }

    // 締確認
    public function check(Request $req)
    {
        // パラメーターセット
        $param = [
            'result'        => 0 ,
            'message'       => NULL ,
            'mUserId'       => $req["m_user_id"] ,
            'mBranchId'     => $req["m_branch_id"] ,
            'dealingMkvId'  => $req["dealing_m_kv_id"] ,
            'completeDay'   => $req["complete_day"] ,
            'closingDate'   => $req["closing_date"] ,
            'customerId'    => $req["m_customer_id"] ,
            'isComplete'    => $req["is_complete"]
        ] ;

        try {
            // ストアド実行(締確認)
            $affected = DB::select('call pr_t_complete_check(:result, :message, :mUserId, :mBranchId, :dealingMkvId, :completeDay, :closingDate, :customerId, :isComplete, true)', $param) ;
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException) ;
        }

        return $affected ;
    }

    // 締処理
    public function process(Request $req)
    {
        $search       = $req["search"] ;
        $dealing      = $search["dealing_m_kv_id"] == 1010001 ? "sales" : "purchases" ;
        $branch       = $search["m_branch_id"] ;
        $complete_day = $search["complete_day"] ;

        // パラメーターセット
        $param = [
            'result'        => 0 ,
            'message'       => null ,
            'mUserId'       => $search["m_user_id"] ,
            'mBranchId'     => $search["m_branch_id"] ,
            'dealingMkvId'  => $search["dealing_m_kv_id"] ,
            'completeDay'   => $search["complete_day"] ,
            'closingDate'   => $search["closing_date"] ,
            'customerId'    => $search["m_customer_id"]
        ] ;

        try {
            // 取引先単位で締処理
            foreach ($req["customers"] as $id) {
                $param['customerId'] = $id ;
                // ストアド実行
                $affected = DB::select('call pr_t_complete_process(:result, :message, :mUserId, :mBranchId, :dealingMkvId, :completeDay, :closingDate, :customerId)', $param) ;

                // 請求書のpdfをdropboxにアップロード
                // 2022/08 使えなくなってる(エラーになります)
                //$this->dropboxUpload($dealing, $branch, $complete_day, $affected[0]->t_complete_id) ;
            }
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException) ;
        }

        return $affected ;
    }

    // 締解除
    public function cancel(Request $req)
    {
        // パラメーターセット
        $param = [
            'result'        => 0 ,
            'message'       => null ,
            'mUserId'       => $req["m_user_id"] ,
            'mBranchId'     => $req["m_branch_id"] ,
            'dealingMkvId'  => $req["dealing_m_kv_id"] ,
            'completeDay'   => $req["complete_day"] ,
            'closingDate'   => $req["closing_date"] ,
            'customerId'    => $req["m_customer_id"]
        ] ;

        try {
            // ストアド実行(締解除)
            $affected = DB::select('call pr_t_complete_cancel(:result, :message, :mUserId, :mBranchId, :dealingMkvId, :completeDay, :closingDate, :customerId)', $param) ;
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException) ;
        }

        return $affected ;
    }

    // 請求書・検収書ダウンロード
    public function download(Request $req)
    {
        //phpの処理可能時間を4分に一時的に変更する
        ini_set('max_execution_time', 240);
        $search       = $req["search"] ;
        $dealing      = $search["dealing_m_kv_id"] == 1010001 ? "sales" : "purchases" ;
        $branch       = $search["m_branch_id"] ;
        $complete_day = $search["complete_day"] ;

        // 作業フォルダ[dropbox(temporary)]を削除
        $this->dropboxDelete4Temporary($dealing, $branch) ;

        foreach ($req["completeIds"] as $id) {
            // 請求書・検収書のpdfをdropboxにアップロード
            $this->dropboxUpload($dealing, $branch, $complete_day, $id) ;

            // 請求書・検収書を作業フォルダ[dropbox(temporary)]にコピー
            $this->fileCopy($dealing, $branch, $complete_day, $id) ;
        }

        // CSVパス[dropbox(temporary)]を生成
        $path = "public/temporary/invoices/$dealing/$branch/template.csv";
        // CSVファイルを作成して作業フォルダ[dropbox(temporary)]にコピー
        $this->createCSV($req["completeIds"], $path ,$req["mailTypeKvId"]) ;
        // 作業フォルダをzipにしてダウンロード
        $zipped = $this->createZip($dealing, $branch) ;

        //phpの処理可能時間を初期値に戻す
        ini_set('max_execution_time', 120);
        return $zipped ;
    }

    // dropboxにアップロード
    private function dropboxUpload($dealing, $branch, $complete_day, $id)
    {
        // [請求 Or 検収] + 処理日 + id のパスを作成
        $path = "public/invoices/$dealing/$branch/$complete_day/$id.pdf";

        // pdfをバイナリ出力
        $contents = $this->issuingAnInvoice($id) ;

        // dropboxにアップロード
        Storage::disk('dropbox')->put($path, $contents) ;

        return null ;
    }

    // 作業フォルダ[dropbox(temporary)]を削除
    private function dropboxDelete4Temporary($dealing, $branch)
    {
        $directory = "public/temporary/invoices/$dealing/$branch";

        // 作業フォルダを削除
        Storage::disk('dropbox')->deleteDirectory($directory) ;
    }

    // ファイル存在チェック
    private function fileExists($dealing, $branch, $complete_day, $id)
    {
        $path = "public/invoices/$dealing/$branch/$complete_day/$id.pdf";

        // ファイルの存在チェック
        return Storage::disk('dropbox')->exists($path) ;
    }

    // 作業フォルダ[dropbox(temporary)]にコピー
    private function fileCopy($dealing, $branch, $complete_day, $id)
    {
        // コピー元とコピー先のパスを設定
        $source_path      = "public/invoices/$dealing/$branch/$complete_day/$id.pdf";
        $destination_path = "public/temporary/invoices/$dealing/$branch/$id.pdf";

        // 作業フォルダ[dropbox(temporary)]にコピー
        Storage::disk('dropbox')->copy($source_path, $destination_path) ;
    }

    // 作業フォルダ[dropbox(temporary)]をzip化
    private function createZip($dealing, $branch)
    {
        $directory = "public/temporary/invoices/$dealing/$branch";

        $dropbox = app()->make('dropboxClient') ;
        $arg = [
            'path' => "/$directory",
        ];

        $response = $dropbox->contentEndpointRequest('files/download_zip', $arg);
        return $response->getBody() ;
    }

    // 請求書・検収書を発行(1件)
    public function invoice($id, $view = null)
    {
        // 請求書・検収書を発行
        return $this->issuingAnInvoice($id, $view) ;
    }

    // 請求書・検収書 発行処理
    private function issuingAnInvoice($id, $view = null)
    {
        // 該当する請求データを取得
        $model = $this->getComplete($id) ;

        // 売買の判定
        $isSales = ($model['header']->dealing_m_kv_id == 1010001) ;

        // 社判データ取得(public以下に保存は危険なため変更)
        $companySeal = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.company_seal'), true) ;
        // ロゴ
        $companyLogo = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.report_logo'), true) ;

        if (isset($view)) {
            // View出力(ブラウザ表示：デバッグ用)
            $isView = true ;
            if ($isSales) {
                // 請求書
                return view('t_completes.invoice'   , compact('companySeal', 'companyLogo', 'isView') + $model) ;
            } else {
                // 検収書
                return view('t_completes.inspection', compact('companySeal', 'companyLogo', 'isView') + $model) ;
            }
        } else {
            // pdf生成：Laravel-SnappyPDFを利用
            if ($isSales) {
                // 請求書
                $pdf = \SnappyPDF::loadView('t_completes.invoice'   , compact('companySeal', 'companyLogo') + $model) ;
            } else {
                // 検収書
                $pdf = \SnappyPDF::loadView('t_completes.inspection', compact('companySeal', 'companyLogo') + $model) ;
            }
            // バイナリ出力(ファイル保存)
            return $pdf->output() ;
        }
    }

    // 請求・検収データ
    private function getComplete($id)
    {
        // 請求・検収 ヘッダー
        $header = $this->model
            ::with('MBranch')
            ->with('MCustomer')
            ->with('MCustomer.TitleOfHonorMKv')
            ->with(['MCustomer.SalesMUser' => function ($query) {
                $query->withTrashed();
            }])
            ->find($id) ;

        if ($header->dealing_m_kv_id == 1010001) {
            // 売：請求明細
            $details = $this->getCompleteDetailSales($id) ;

        } else {
            // 買：検収明細
            $details = $this->getCompleteDetailPurchases($id) ;
        }

        return compact('header', 'details') ;
    }

    // 請求明細データ
    private function getCompleteDetailSales($id)
    {
        /*
           名前付きパラメータを使用して1つのパラメータ名で複数バインドする場合はプリペアドステートメントのエミュレーションを有効にする
           (\DB::connection()->getPdo())->setAttribute(\PDO::ATTR_EMULATE_PREPARES, true);
           SQLインジェクションは考慮する事
           ・原則として文字列連結でSQL文を組み立てない
           ・パラメータは名前付きではなくプレースホルダを指定
           ・特別な事情がなければ静的プレースホルダを使う
           ・エミュレーションは無効にする PDO::ATTR_EMULATE_PREPARES = false Laravelはデフォルトfalse
        */

        // パラメーターセット
        $param = [
            't_complete_id1' => $id ,
            't_complete_id2' => $id ,
            't_complete_id3' => $id ,
            't_complete_id4' => $id ,
            't_complete_id5' => $id ,
            't_complete_id6' => $id ,
            't_complete_id7' => $id ,
            't_complete_id8' => $id ,
            't_complete_id9' => $id ,
        ] ;

        // 請求明細
        $details = DB::select(<<<__SQL_EOT__
            /* 売上 */
            SELECT 1                                                                AS sort2                         ,
                   h.accounting_date                                                AS sort1                         ,
                   c.id                                                             AS t_completes_id                ,
                   h.id                                                             AS t_sales_id                    ,
                   d.id                                                             AS t_sale_details_id             ,
                   IFNULL(k2.kv_name, k3.kv_name)                                   AS ship_name                     ,
                   CASE WHEN q1.id IS NOT NULL THEN h.accounting_date ELSE NULL END AS accounting_date               ,
                   d.product_name                                                   AS product_name                  ,
                   d.customer_order_no                                              AS customer_order_no             ,
                   d.qty                                                            AS qty                           ,
                   k1.kv_name                                                       AS unit_m_kv_name                ,
                   d.price                                                          AS price                         ,
                   IFNULL(d.total_price, 0) +
                   IFNULL(CASE WHEN cu.account_m_kv_id = 1060001                              THEN d.tax
                            -- WHEN cu.account_m_kv_id = 1060003 AND h.slip_m_kv_id = 1160003 THEN h.tax_normal /* 8% 10%消費税は下記のSubQueryで実装 */
                               WHEN cu.account_m_kv_id = 1060002 AND q2.id IS NOT NULL        THEN h.tax
                               ELSE 0
                          END, 0)                                                   AS total_price_or_tax_or_payment ,
                   CASE WHEN q1.id IS NOT NULL THEN h.slip_memo ELSE NULL END       AS h_slip_memo                   ,
                   d.slip_memo                                                      AS d_slip_memo
              FROM      t_completes    AS c
             INNER JOIN m_customers    AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_sales        AS h  ON h.t_complete_id = c.id  AND h.deleted_at IS NULL
              LEFT JOIN t_sale_details AS d  ON d.t_sale_id     = h.id  AND d.deleted_at IS NULL
              LEFT JOIN m_kvs          AS k1 ON d.unit_m_kv_id  = k1.id
              LEFT JOIN m_kvs          AS k2 ON d.ship_m_kv_id  = k2.id
              LEFT JOIN m_kvs          AS k3 ON h.slip_m_kv_id  = k3.id
              LEFT JOIN (/* 伝票単位の最初の明細idを取得 */
                         SELECT MIN(d.id) AS id
                           FROM      t_sale_details AS d
                          INNER JOIN t_sales        AS h ON d.t_sale_id     = h.id
                          INNER JOIN t_completes    AS c ON h.t_complete_id = c.id
                          WHERE c.id = :t_complete_id1
                            AND d.deleted_at IS NULL
                          GROUP BY d.t_sale_id
                        )              AS q1 ON q1.id = d.id
              LEFT JOIN (/* 伝票単位の最後の明細idを取得 */
                         SELECT MAX(d.id) AS id
                           FROM      t_sale_details AS d
                          INNER JOIN t_sales        AS h ON d.t_sale_id     = h.id
                          INNER JOIN t_completes    AS c ON h.t_complete_id = c.id
                          WHERE c.id = :t_complete_id2
                            AND d.deleted_at IS NULL
                          GROUP BY d.t_sale_id
                        )              AS q2 ON q2.id = d.id
             WHERE c.id            = :t_complete_id3
               AND h.slip_m_kv_id <> 1160003

             UNION ALL
            /* 入金 */
            SELECT 2                    AS sort2                         ,
                   d.payment_day        AS sort1                         ,
                   c.id                 AS t_completes_id                ,
                   c.id                 AS t_sales_id                    ,
                   d.id                 AS t_sale_details_id             ,
                   '入金'               AS ship_name                     ,
                   d.payment_day        AS accounting_date               ,
                   CONCAT(TRIM(CONCAT('[入金：', IFNULL(k1.kv_name, ''), ' ', IFNULL(d.bill_no, ''), ' ', IFNULL(DATE_FORMAT(d.bill_due_day, '%Y/%m/%d'), ''))), ']') AS product_name ,
                   NULL                 AS customer_order_no             ,
                   NULL                 AS qty                           ,
                   NULL                 AS unit_m_kv_name                ,
                   NULL                 AS price                         ,
                   d.payment_price      AS total_price_or_tax_or_payment ,
                   NULL                 AS h_slip_memo                   ,
                   d.memo               AS d_slip_memo
              FROM      t_completes        AS c
             INNER JOIN t_complete_details AS d  ON d.t_complete_id   = c.id  AND d.deleted_at IS NULL
              LEFT JOIN m_kvs              AS k1 ON d.payment_m_kv_id = k1.id
             WHERE c.id = :t_complete_id4

             UNION ALL
            /* 消費税10% */
            SELECT 3                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【', k1.kv_name, '：10%', '】')      AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.tax_normal                                 AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_sales     AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs       AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id            = :t_complete_id5
               AND h.slip_m_kv_id  = 1160003
               AND h.tax_normal   <> 0

             UNION ALL
            /* 消費税8%(軽減税率) */
            SELECT 4                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【', k1.kv_name, '：8%', '】')       AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.tax_reduced                                AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_sales     AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs       AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id            = :t_complete_id6
               AND h.slip_m_kv_id  = 1160003
               AND h.tax_reduced  <> 0

             UNION ALL
            /* 返還 消費税10% */
            SELECT 5                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【返還 ', k1.kv_name, '：10%', '】') AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.re_tax_normal                              AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_sales     AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs       AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id             = :t_complete_id7
               AND h.slip_m_kv_id   = 1160003
               AND h.re_tax_normal <> 0

             UNION ALL
            /* 返還 消費税8%(軽減税率) */
            SELECT 6                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【返還 ', k1.kv_name, '：8%', '】')  AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.re_tax_reduced                             AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_sales     AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs       AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id              = :t_complete_id8
               AND h.slip_m_kv_id    = 1160003
               AND h.re_tax_reduced <> 0

             UNION ALL
            /* 取引無し */
            SELECT 7                                    AS sort2                         ,
                   NULL                                 AS sort1                         ,
                   NULL                                 AS t_completes_id                ,
                   NULL                                 AS t_sales_id                    ,
                   NULL                                 AS t_sale_details_id             ,
                   NULL                                 AS ship_name                     ,
                   NULL                                 AS accounting_date               ,
                   '【期間中のお取引はございません】'   AS product_name                  ,
                   NULL                                 AS customer_order_no             ,
                   NULL                                 AS qty                           ,
                   NULL                                 AS unit_m_kv_name                ,
                   NULL                                 AS price                         ,
                   NULL                                 AS total_price_or_tax_or_payment ,
                   NULL                                 AS h_slip_memo                   ,
                   NULL                                 AS d_slip_memo
              FROM      t_completes        AS c
              LEFT JOIN t_complete_details AS d ON d.t_complete_id = c.id  AND d.deleted_at IS NULL
              LEFT JOIN t_sales            AS h ON h.t_complete_id = c.id  AND h.deleted_at IS NULL
             WHERE c.id = :t_complete_id9
             GROUP BY c.id, d.t_complete_id, h.t_complete_id
             /* 売上・入金が1件もない場合に該当 */
             HAVING COUNT(d.t_complete_id) + COUNT(h.t_complete_id) = 0

             ORDER BY sort1, sort2, t_sales_id, t_sale_details_id
        __SQL_EOT__, $param) ;

        return $details ;
    }

    // 検収明細データ
    private function getCompleteDetailPurchases($id)
    {
        // パラメーターセット
        $param = [
            't_complete_id1' => $id ,
            't_complete_id2' => $id ,
            't_complete_id3' => $id ,
            't_complete_id4' => $id ,
            't_complete_id5' => $id ,
            't_complete_id6' => $id ,
            't_complete_id7' => $id ,
            't_complete_id8' => $id ,
            't_complete_id9' => $id ,
        ] ;

        // 検収明細
        $details = DB::select(<<<__SQL_EOT__
            /* 仕入 */
            SELECT 1                                                                AS sort2                         ,
                   h.accounting_date                                                AS sort1                         ,
                   c.id                                                             AS t_completes_id                ,
                   h.id                                                             AS t_sales_id                    ,
                   d.id                                                             AS t_sale_details_id             ,
                   IFNULL(k2.kv_name, k3.kv_name)                                   AS ship_name                     ,
                   CASE WHEN q1.id IS NOT NULL THEN h.accounting_date ELSE NULL END AS accounting_date               ,
                   d.material_name                                                  AS product_name                  ,
                   NULL                                                             AS customer_order_no             ,
                   d.qty                                                            AS qty                           ,
                   k1.kv_name                                                       AS unit_m_kv_name                ,
                   d.price                                                          AS price                         ,
                   IFNULL(d.total_price, 0) +
                   IFNULL(CASE WHEN cu.account_m_kv_id = 1060001                              THEN d.tax
                            -- WHEN cu.account_m_kv_id = 1060003 AND h.slip_m_kv_id = 1160003 THEN h.tax_normal /* 8% 10%消費税は下記のSubQueryで実装 */
                               WHEN cu.account_m_kv_id = 1060002 AND q2.id IS NOT NULL        THEN h.tax
                               ELSE 0
                          END, 0)                                                   AS total_price_or_tax_or_payment ,
                   CASE WHEN q1.id IS NOT NULL THEN h.slip_memo ELSE NULL END       AS h_slip_memo                   ,
                   d.slip_memo                                                      AS d_slip_memo
              FROM      t_completes         AS c
             INNER JOIN m_customers         AS cu ON c.m_customer_id    = cu.id
             INNER JOIN t_p_invoices        AS h  ON h.t_complete_id    = c.id  AND h.deleted_at IS NULL
              LEFT JOIN t_p_invoice_details AS d  ON d.t_p_invoice_id   = h.id  AND d.deleted_at IS NULL
              LEFT JOIN m_kvs               AS k1 ON d.unit_m_kv_id     = k1.id
              LEFT JOIN m_kvs               AS k2 ON d.purchase_m_kv_id = k2.id
              LEFT JOIN m_kvs               AS k3 ON h.slip_m_kv_id     = k3.id
              LEFT JOIN (/* 伝票単位の最初の明細idを取得 */
                         SELECT MIN(d.id) AS id
                           FROM      t_p_invoice_details AS d
                          INNER JOIN t_p_invoices        AS h ON d.t_p_invoice_id = h.id
                          INNER JOIN t_completes         AS c ON h.t_complete_id  = c.id
                          WHERE c.id = :t_complete_id1
                            AND d.deleted_at IS NULL
                          GROUP BY d.t_p_invoice_id
                        )                   AS q1 ON q1.id = d.id
              LEFT JOIN (/* 伝票単位の最後の明細idを取得 */
                         SELECT MAX(d.id) AS id
                           FROM      t_p_invoice_details AS d
                          INNER JOIN t_p_invoices        AS h ON d.t_p_invoice_id = h.id
                          INNER JOIN t_completes         AS c ON h.t_complete_id  = c.id
                          WHERE c.id = :t_complete_id2
                            AND d.deleted_at IS NULL
                          GROUP BY d.t_p_invoice_id
                        )                   AS q2 ON q2.id = d.id
             WHERE c.id            = :t_complete_id3
               AND h.slip_m_kv_id <> 1160003

             UNION ALL
            /* 支払 */
            SELECT 2                    AS sort2                         ,
                   d.payment_day        AS sort1                         ,
                   c.id                 AS t_completes_id                ,
                   c.id                 AS t_sales_id                    ,
                   d.id                 AS t_sale_details_id             ,
                   '支払'               AS ship_name                     ,
                   d.payment_day        AS accounting_date               ,
                   CONCAT(TRIM(CONCAT('[支払：', IFNULL(k1.kv_name, ''), ' ', IFNULL(d.bill_no, ''), ' ', IFNULL(DATE_FORMAT(d.bill_due_day, '%Y/%m/%d'), ''))), ']') AS product_name ,
                   NULL                 AS customer_order_no             ,
                   NULL                 AS qty                           ,
                   NULL                 AS unit_m_kv_name                ,
                   NULL                 AS price                         ,
                   d.payment_price      AS total_price_or_tax_or_payment ,
                   NULL                 AS h_slip_memo                   ,
                   d.memo               AS d_slip_memo
              FROM      t_completes        AS c
             INNER JOIN t_complete_details AS d  ON d.t_complete_id   = c.id  AND d.deleted_at IS NULL
              LEFT JOIN m_kvs              AS k1 ON d.payment_m_kv_id = k1.id
             WHERE c.id = :t_complete_id4

             UNION ALL
            /* 消費税10% */
            SELECT 3                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【', k1.kv_name, '：10%', '】')      AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.tax_normal                                 AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers  AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_p_invoices AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs        AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id            = :t_complete_id5
               AND h.slip_m_kv_id  = 1160003
               AND h.tax_normal   <> 0

             UNION ALL
            /* 消費税8%(軽減税率) */
            SELECT 4                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【', k1.kv_name, '：8%', '】')       AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.tax_reduced                                AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers  AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_p_invoices AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs        AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id            = :t_complete_id6
               AND h.slip_m_kv_id  = 1160003
               AND h.tax_reduced  <> 0

             UNION ALL
            /* 返還 消費税10% */
            SELECT 5                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【返還 ', k1.kv_name, '：10%', '】') AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.re_tax_normal                              AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers  AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_p_invoices AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs        AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id             = :t_complete_id7
               AND h.slip_m_kv_id   = 1160003
               AND h.re_tax_normal <> 0

             UNION ALL
            /* 返還 消費税8%(軽減税率) */
            SELECT 6                                            AS sort2                         ,
                   h.accounting_date                            AS sort1                         ,
                   c.id                                         AS t_completes_id                ,
                   h.id                                         AS t_sales_id                    ,
                   NULL                                         AS t_sale_details_id             ,
                   k1.kv_name                                   AS ship_name                     ,
                   h.accounting_date                            AS accounting_date               ,
                   CONCAT('【返還 ', k1.kv_name, '：8%', '】')  AS product_name                  ,
                   NULL                                         AS customer_order_no             ,
                   0                                            AS qty                           ,
                   NULL                                         AS unit_m_kv_name                ,
                   0                                            AS price                         ,
                   h.re_tax_reduced                             AS total_price_or_tax_or_payment ,
                   NULL                                         AS h_slip_memo                   ,
                   NULL                                         AS d_slip_memo
              FROM      t_completes AS c
             INNER JOIN m_customers  AS cu ON c.m_customer_id = cu.id
             INNER JOIN t_p_invoices AS h  ON h.t_complete_id = c.id
              LEFT JOIN m_kvs        AS k1 ON h.slip_m_kv_id  = k1.id
             WHERE c.id              = :t_complete_id8
               AND h.slip_m_kv_id    = 1160003
               AND h.re_tax_reduced <> 0

             UNION ALL
            /* 取引無し */
            SELECT 7                                    AS sort2                         ,
                   NULL                                 AS sort1                         ,
                   NULL                                 AS t_completes_id                ,
                   NULL                                 AS t_sales_id                    ,
                   NULL                                 AS t_sale_details_id             ,
                   NULL                                 AS ship_name                     ,
                   NULL                                 AS accounting_date               ,
                   '【期間中のお取引はございません】'   AS product_name                  ,
                   NULL                                 AS customer_order_no             ,
                   NULL                                 AS qty                           ,
                   NULL                                 AS unit_m_kv_name                ,
                   NULL                                 AS price                         ,
                   NULL                                 AS total_price_or_tax_or_payment ,
                   NULL                                 AS h_slip_memo                   ,
                   NULL                                 AS d_slip_memo
              FROM      t_completes        AS c
              LEFT JOIN t_complete_details AS d ON d.t_complete_id = c.id  AND d.deleted_at IS NULL
              LEFT JOIN t_p_invoices       AS h ON h.t_complete_id = c.id  AND h.deleted_at IS NULL
             WHERE c.id = :t_complete_id9
             GROUP BY c.id, d.t_complete_id, h.t_complete_id
             /* 仕入・支払が1件もない場合に該当 */
             HAVING COUNT(d.t_complete_id) + COUNT(h.t_complete_id) = 0

             ORDER BY sort1, sort2, t_sales_id, t_sale_details_id
        __SQL_EOT__, $param) ;

        return $details ;
    }

    // CSVファイル作成
    private function createCSV($completeIds, $path, $mailTypeKvId)
    {
        // CSVファイル作成
        $csv = Writer::createFromFileObject(new \SplTempFileObject());

        // UTF-8 with BOM にする(Mac・WindowsでCSVファイルをExcelで開いた際の文字化け回避用)
        $csv->setOutputBOM(Writer::BOM_UTF8);

        // データを取得
        $models = $this->completeInfoCSV($completeIds) ;
        //　未設定、メール、指定のみ
        if($mailTypeKvId == 0 || $mailTypeKvId == 1055001 || $mailTypeKvId == 1055003) {
            // ヘッダー行
            $csv->insertOne([
                'externalId',
                'pdfName',
                'billingAmount',
                'extensionField1',
                'extensionField2',
                'extensionField3',
            ]);

            foreach($models as $row){
                $data = [
                    $row->data_linkage_cd,
                    $row->file_name,
                    $row->sub_total,
                    $row->complete_day,
                    $row->id,
                    $row->branch_name,
                ];

                // 1行毎にデータ追加
                $csv->insertOne($data);
            }
        }
        //郵送
        else if( $mailTypeKvId == 1055002 ) {
            // ヘッダー行
            $csv->insertOne([
                'externalId',
                'pdfName',
                'printColor',
                'printSide' ,
                'billingAmount',
                'extensionField1',
                'extensionField2',
                'extensionField3',
            ]);

            foreach($models as $row){
                $data = [
                    $row->data_linkage_cd,
                    $row->file_name,
                    'C',
                    'S',
                    $row->sub_total,
                    $row->complete_day,
                    $row->id,
                    $row->branch_name,
                ];

                // 1行毎にデータ追加
                $csv->insertOne($data);
            }
        }


        // LocalStorageに一旦ファイル保存
        Storage::disk('local')->put($path, $csv) ;

        // dropbox[作業フォルダ]にアップ
        Storage::disk('dropbox')->put($path, Storage::disk('local')->get($path));
    }
}
