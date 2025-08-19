<?php

namespace App\Http\Controllers\Api;

use App\Models\TPInvoice;
use App\Http\Controllers\Controller;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\BaseModel;
use App\Consts\TIvtMaterialConst;

class TPInvoiceApiController extends BaseApiController
{
    protected $filters = array(
        // 仕入id
        "id_from" => array(
            "operation" => ">="  ,
            "column"    => "t_p_invoices.id" ,
        ) ,
        "id_to" => array(
            "operation" => "<="  ,
            "column"    => "t_p_invoices.id" ,
        ) ,
        // 仕入日
        "purchase_date_from" => array(
            "operation" => ">="  ,
            "column"    => "purchase_date" ,
        ) ,
        "purchase_date_to" => array(
            "operation" => "<="  ,
            "column"    => "purchase_date" ,
        ) ,
        // 拠点
        "m_branch_id" => array(
            "column"    => "t_p_invoices.m_branch_id" ,
        ) ,
        // 仕入先
        "supplier_m_customer_id" => array() ,

        // 仕入明細
        "t_p_invoice_detail" => array(
            "operation" => "table" ,
            "relation_name" => "TPInvoiceDetails" ,
            // 名称
            "material_name" => array(
                "operation" => "like" ,
                "prefix"  => "%" ,
                "postfix" => "%" ,
                "column" => "t_p_invoice_details.material_name" ,
            ) ,
            // 備考
            "slip_memo" => array(
                "operation" => "like" ,
                "prefix"  => "%" ,
                "postfix" => "%" ,
                "column" => "t_p_invoice_details.slip_memo" ,
            ) ,

            // 材料明細
            "m_material_detail" => array(
                "operation" => "table" ,
                "relation_name" => "MMaterialDetail" ,

                // 材料
                "m_material" => array(
                    "operation" => "table" ,
                    "relation_name" => "MMaterial" ,
                    // カテゴリ
                    "category_m_kv_id" => array() ,
                    // サブカテゴリ
                    "sub_category_m_kv_id" => array() ,
                ) ,
            ) ,
        ) ,
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\TPInvoice";
        $this->ivtModel = "App\Models\TIvtMaterial";
        $this->materialDsModel = "App\Models\MMaterialDetail";
    }

    public function show($id)
    {
        $row = $this->model
            ::with([
                'TPInvoiceDetails' ,
                'TPInvoiceDetails.TProject' ,
                'TPInvoiceDetails.TPOrderDetail:id,t_p_order_id' ,
                'TPInvoiceDetails.PurchaseMKv' ,
                'UpdatedMUser'
            ])
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
        $data = $request->all() ;
        // log::debug($plusIvt) ;
        // 子供ごとSave
        $row->fillIncChildren($data);

        DB::beginTransaction();

        try {
            // 本体更新(仕入・仕入明細)
            $row->push();
            // 仕入完了日を更新(発注明細)
            $row->UpdateTPOrderDetail_PurchaseCompletedAt($row->id) ;
            //在庫データ作成更新
            // $this->updateOrCreateIvt($row) ;

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
            // 検収済みは削除不可として処理しない
            LOG::info("検収済みの為削除できません [t_p_invoices.id={$row->id}] [t_p_invoices.t_complete_id={$row->t_complete_id}]");
            $error = new DbSaveErrorException() ;
            throw $error ;
        }

        try {
            // 本体削除(SoftDeletes)
            $deleted = $row->deleteWithChildren() ;
        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException);
        } catch (\Exception $e) {
            DB::rollBack();
        }

        return compact('deleted') ;
    }

    /**
     * 在庫データの作成及び更新
     * 未使用　仕入れ登録時に材料在庫を行う会社には適用する
     * @param TPInvoice $invoice
     */
    protected function updateOrCreateIvt($invoice) {

        foreach($invoice->TPInvoiceDetails as $ivd) {

            //材料マスタ未登録材料判定
            if( !isset($ivd->m_material_detail_id) ) continue ;

            //材料マスタから該当するデータを取得 要相談 材料データはそもそも仕入のデータに持たしておく？
            $materialModel = $this->materialDsModel::with("MMaterial")->find( $ivd->m_material_detail_id ) ;
            //材料が存在しないか非在庫品の場合は在庫登録しない
            if( empty($materialModel) || $materialModel->MMaterial->is_stocked != "1" ) continue ;

            //すでに保存されている在庫データ取得
            $updateIvtModel = $this->ivtModel::where('t_p_invoice_detail_id',$ivd->id)->first() ;

            $ivtQty = $ivd->qty ;
            $ivtPrice = $ivd->price ;
            //材料在庫区分　内容量の場合
            if( $materialModel->ivt_div_m_kv_id == TIvtMaterialConst::MATERIAL_IVT_DIV_M_KV_ID_CONTENTS_QTY) {
                $ivtQty = $ivd->qty * $materialModel->contents_qty ;
                $ivtPrice = $ivd->price / $materialModel->contents_qty ;

            }

            //upsertするデータを定義
            $upsertRow = array(
                "m_branch_id"            => $invoice->m_branch_id,
                "m_material_detail_id"   => $ivd->m_material_detail_id,
                "supplier_m_customer_id" => $invoice->supplier_m_customer_id,
                "conducted_at"           => $invoice->purchase_date,
                "qty"                    => $ivtQty,
                "price"                  => $ivtPrice,
                "total_price"            => $ivd->total_price,
                "updated_m_user_id"      => $ivd->updated_m_user_id
            ) ;

            if( isset($updateIvtModel) ) {
                //更新データ
                $ivtModel = $updateIvtModel ;

                //仕入明細が削除されたとき
                if(isset($ivd->deleted_at)) {
                    $ivtModel->delete();
                    continue ;
                }
            }
            else {
                //新規の場合必要なデータを追加
                $ivtModel = new $this->ivtModel ;
                $upsertRow["t_p_invoice_detail_id"] = $ivd->id ;
                $upsertRow["t_p_order_detail_id"]   = $ivd->t_p_order_detail_id ;
                $upsertRow["ivt_m_kv_id"]           = 5010010 ;
                $upsertRow["created_m_user_id"]     = $ivd->created_m_user_id ;
            }

            $ivtModel->fill($upsertRow) ;

            try {
                $ivtModel->save();
            }
            catch (\PDOException $pdoException) {
                DB::rollBack();
                $this->throwDbError($pdoException) ;
            }
        }


    }


    public function retrieve(Request $req)
    {
        $res = $this->getFiltered($req)
            ->selectRaw("t_p_invoices.id,
                         t_p_invoices.m_branch_id,
                         t_p_invoices.purchase_date,
                         t_p_invoices.total_price,
                         t_p_invoices.t_complete_id,
                         t_p_invoices.supplier_m_customer_id,
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                         m_customers.kana")

            ->withCount("TPInvoiceDetails AS cnt")
            ->with("TPInvoiceDetails:id,t_p_invoice_id,material_name,material_size_x,material_size_y,qty,price,total_price,slip_memo")

            ->join('m_customers', 't_p_invoices.supplier_m_customer_id', '=', 'm_customers.id')
            ->where('slip_m_kv_id', '!=', '1160003')

            ->orderByRaw($this->orderByClause($req, 'id DESC'))
            ->paginate() ;
         // ->toSql() ;

        return $res ;
    }

    public function _retrieve(Request $req)
    {
        $res = $this->getFiltered($req)
            ->selectRaw("CONCAT(LPAD(t_p_invoice_details.t_p_invoice_id, 10, '0'), '-', LPAD(t_p_invoice_details.id, 10, '0')) AS slip_no,
                         t_p_invoice_details.id,
                         t_p_invoice_details.t_p_invoice_id,
                         IFNULL(m_customers.short_name, m_customers.name) AS m_customers_name,
                         m_customers.kana,
                         t_p_invoices.purchase_date,
                         t_p_invoice_details.material_name,
                         t_p_invoice_details.qty,
                         t_p_invoice_details.price,
                         t_p_invoice_details.total_price,
                         t_p_invoice_details.slip_memo")

            ->join('t_p_invoice_details', 't_p_invoice_details.t_p_invoice_id', '=', 't_p_invoices.id')
            ->join('m_customers', 't_p_invoices.supplier_m_customer_id', '=', 'm_customers.id')

            ->orderByRaw($this->orderByClause($req, 't_p_invoice_id DESC, t_p_invoice_details.order_no, id'))
            ->paginate() ;

        return $res;
    }

}
