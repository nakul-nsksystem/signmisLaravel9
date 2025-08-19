<?php

namespace App\Http\Controllers\Api;

use App\Models\TSale;
use App\Models\TSaleDetail;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Traits\LocalFileStorageTrait;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TSaleApiController extends BaseApiController
{
    use LocalFileStorageTrait ;

    protected $filters = array(
        // 売上id
        "id_from" => array(
            "operation" => ">="  ,
            "column"    => "t_sales.id" ,
        ) ,
        "id_to" => array(
            "operation" => "<="  ,
            "column"    => "t_sales.id" ,
        ) ,
        // 売上日
        "shipped_at_from" => array(
            "operation" => ">="  ,
            "column"    => "shipped_at" ,
        ) ,
        "shipped_at_to" => array(
            "operation" => "<="  ,
            "column"    => "shipped_at" ,
        ) ,
        // 拠点
        "m_branch_id" => array(
            "column"    => "t_sales.m_branch_id" ,
        ) ,
        // 取引先
        "m_customer_id" => array() ,

        // 売上明細
        "t_sale_detail" => array(
            "operation" => "table" ,
            "relation_name" => "TSaleDetails" ,
            // 名称
            "product_name" => array(
                "operation" => "like" ,
                "prefix"  => "%" ,
                "postfix" => "%" ,
            ) ,
            // 備考
            "slip_memo" => array(
                "operation" => "like" ,
                "prefix"  => "%" ,
                "postfix" => "%" ,
                "column" => "t_sale_details.slip_memo" ,
            ) ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TSale";
    }

    public function retrieve(Request $req)
    {
        $res = $this->getFiltered($req)
            ->selectRaw("t_sales.id,
                         t_sales.m_branch_id,
                         t_sales.shipped_at,
                         t_sales.total_price,
                         t_sales.t_complete_id,
                         t_sales.m_customer_id,
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                         m_customers.kana")

            ->withCount("TSaleDetails AS cnt")
            ->with("TSaleDetails:id,t_sale_id,product_name,qty,price,total_price,slip_memo,t_project_id,t_project_product_id")
            ->with("TSaleDetails.TProject:id,cd,name")
            ->join('m_customers', 't_sales.m_customer_id', '=', 'm_customers.id')
            ->where('slip_m_kv_id', '!=', '1160003')

            ->orderByRaw($this->orderByClause($req, 'id DESC'))
            ->paginate() ;
         // ->toSql() ;

        return $res;
    }

    public function show($id)
    {
        $row = $this->model
            ::with('TSaleDetails')
            ->with('TSaleDetails.TProject')
            ->with('TSaleDetails.UnitMKv')
            ->with('TSaleDetails.ShipMKv')
            ->with('MBranch')
            ->with('MCustomer')
            ->with('MCustomer.TitleOfHonorMKv')
            ->with('MUser')
            ->with('UpdatedMUser')
            ->find($id);

        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        return $row;
    }

    public function update(Request $request, $id)
    {
        $row = $this->model::find($id);

        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        $this->saveRow($request, $row);
        return $this->show($row["id"]);
    }

    protected function saveRow($request, $row)
    {
        $data = $request->all();

        // 子供ごとSave
        $row->fillIncChildren($data);

        DB::beginTransaction();

        try {
            // 本体更新(売上・売上明細)
            $row->push();
            // 物件・物件商品の売上完了日の更新
            $this->updateSalesCompletedAt($row) ;
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException);
        } catch (\Exception $e) {
            DB::rollBack();
        }

        DB::commit();
    }

    public function destroy($id)
    {
        $row = $this->model::find($id) ;
        if (!$row) {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }

        if ($row->t_complete_id != 0) {
            // 請求済みは削除不可として処理しない
            LOG::info("請求済みの為削除できません [t_sales.id={$row->id}] [t_sales.t_complete_id={$row->t_complete_id}]");
            $error = new DbSaveErrorException() ;
            throw $error ;
        }

        try {
            // 本体削除(SoftDeletes)
            $deleted = $row->deleteWithChildren() ;
            // 物件・物件商品の売上完了日の更新
            $this->updateSalesCompletedAt($row) ;
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException);
        } catch (\Exception $e) {
            DB::rollBack();
        }

        return compact('deleted') ;
    }

    // 物件・物件商品の売上完了日の更新
    private function updateSalesCompletedAt($row)
    {
        // 通常の売上は一式か明細のみで売上伝票を登録したりするのでややこしい事にはならないが
        // 片方は一式・片方は明細と分けて売上登録したり、後日削除した場合を考慮して論理的に合うように設定してます
        // トランザクションの順番があるのでmethodの順序は変更しない事

        // 1. 物件[売上完了日]を更新
        $row->UpdateTProjectsSalesCompletedAt($row->id) ;
        // 2. 物件商品[売上完了日]を更新
        $row->UpdateTProjectProductsSalesCompletedAt($row->id) ;
        // 3. 物件[売上完了日]を更新：全ての物件商品で売上完了日が入ってる場合は物件[売上完了日]と比較して大きい方を更新
        $row->UpdateTProjectsSalesCompletedAt_4TProjectProducts($row->id) ;
    }

    // 納品書発行
    // 参照渡し: &$outputName : pdfの出力ファイル名
    public function deliveryNote($id, $view = null, &$outputName = null)
    {
        // 納品書 ヘッダー
        $header = $this->model
            ::with('MBranch')
            ->with('MCustomer')
            ->with('MCustomer.TitleOfHonorMKv')
            ->with('MUser')
            ->with('UpdatedMUser')
            ->with('DeliveryNoteMKv')
            ->find($id);

        // 納品書 明細
        $details = TSaleDetail::where('t_sale_id', $id)
            ->with('TProject')
            ->with('UnitMKv')
            ->orderby('order_no')
            ->orderby('id')
            ->get();

        // ロゴ
        $reportLogo = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.report_logo'),true) ;

        // 出力したい納品書のキーを取得
        $view_name = $header->DeliveryNoteMKv->g_01 ;
        // 値が設定されてない場合は標準納品書で出力
        if (empty($view_name)) {
            $view_name = 't_sales.delivery_note_standard' ;
        }

        if (isset($view)) {
            $isView = true ;
            // View出力(ブラウザ表示：デバッグ用)
            return view($view_name, compact('header', 'details', 'reportLogo', 'isView')) ;
        } else {
            // 取引先名の全半角空白はカット
            $name = str_replace(' ', '', str_replace('　', '', $header->MCustomer->name)) ;
            $shipped_date = date('Ymd', strtotime($header->shipped_at)) ;
            // ダウンロードファイル名の設定
            $file_name = "{$header->MCustomer->cd}_{$name}_{$shipped_date}_{$header->id}.pdf" ;

            // pdf生成：Laravel-SnappyPDFを利用
            $pdf = \SnappyPDF::loadView($view_name, compact('header', 'details', 'reportLogo')) ;

            // pdf一括出力で件数多いと[Allowed memory size of ** bytes exhausted]になるので変数開放
            unset($header, $details, $reportLogo, $view_name);

            if (isset($outputName)) {
                // 呼出元のメソッドに対してにファイル名を反映させる
                $outputName = $file_name ;
                // バイナリ出力(ファイル保存)
                return $pdf->output() ;
            } else {
                // ストリーム出力(ブラウザ表示)
                return $pdf->stream($file_name) ;
            }
        }
    }

    // 一括納品書発行
    public function batchDeliveryNote(Request $req)
    {
        $m_users_id = $req["m_users_id"] ;

        // 作業フォルダを削除
        $this->dropboxDelete4Temporary($m_users_id) ;

        // 納品書発行件数
        $count = 0 ;

        foreach ($req["saleIds"] as $id) {
            // 納品書をpdfに変換してアップロード
            $count += $this->dropboxUpload($m_users_id, $id) ;
        }

        if ($count == 0) {
            // 該当する納品書がない場合：文字列[None]を返す
            return "None" ;
        } else {
            // 該当する納品書がある場合：DropBoxの納品書フォルダをzipにしてダウンロード
            return $this->createZip($m_users_id) ;
        }
    }

    // 作業フォルダを削除
    private function dropboxDelete4Temporary($m_users_id)
    {
        $directory = "public/delivery_notes/$m_users_id" ;

        // 作業フォルダ[dropbox(delivery_notes/user_id)]を削除
        Storage::disk('dropbox')->deleteDirectory($directory) ;
    }

    // 納品書をpdfに変換してアップロード
    private function dropboxUpload($m_users_id, $id)
    {
        // 納品書ヘッダー
        $header = $this->model::find($id);
        $view_name = $header->DeliveryNoteMKv->g_01 ;
        // 出力したい納品書のキーを取得してNullの場合は処理を抜ける
        if (empty($view_name)) {
            return 0 ;
        }

        $outputName = $id ;
        // 納品書(pdf)をバイナリ出力
        $contents = $this->deliveryNote($id, null, $outputName) ;
        // 納品書[カテゴリ] + 担当者 + ファイル名(命名規則に沿った名称).pdf のパスを作成
        $path = "public/delivery_notes/$m_users_id/$outputName" ;
        // dropboxにアップロード
        Storage::disk('dropbox')->put($path, $contents) ;

        // pdf一括出力で件数多いと[Allowed memory size of ** bytes exhausted]になるので変数開放
        unset($contents, $path, $outputName) ;

        return 1 ;
    }

    // 納品書フォルダをzip化
    private function createZip($m_users_id)
    {
        $directory = "public/delivery_notes/$m_users_id";

        $dropbox = app()->make('dropboxClient') ;
        $arg = [
            'path' => "/$directory",
        ];

        $response = $dropbox->contentEndpointRequest('files/download_zip', $arg);
        return $response->getBody() ;
    }

}
