<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TPInvoice extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    protected $childModels =
    [
        "TPInvoiceDetails"      =>  "App\Models\TPInvoiceDetail",
    ] ;

    protected $casts = [
        'qty'                      => 'double',
        'price'                    => 'double',
        'total_price'              => 'double',
        'total_price_normal'       => 'double',
        'total_price_reduced'      => 'double',
        'total_price_taxexempt'    => 'double',
        're_total_price_normal'    => 'double',
        're_total_price_reduced'   => 'double',
        're_total_price_taxexempt' => 'double',
        'tax'                      => 'double',
        'tax_normal'               => 'double',
        'tax_reduced'              => 'double',
        're_tax_normal'            => 'double',
        're_tax_reduced'           => 'double',
    ] ;

    public function TPInvoiceDetails()
    {
        return $this->hasMany('App\Models\TPInvoiceDetail')
                    ->orderby('order_no')
                    ->orderby('id');
    }

    public function MBranch()
    {
        return $this->belongsTo('App\Models\MBranch', 'm_branch_id');
    }

    public function SupplierMCustomer()
    {
        return $this->belongsTo('App\Models\MCustomer', 'supplier_m_customer_id');
    }

    public function MUser()
    {
        return $this->belongsTo('App\User', 'm_user_id');
    }

    public function UpdatedMUser()
    {
        return $this->belongsTo('App\User', 'updated_m_user_id');
    }

    // 仕入完了日を更新(発注明細)
    public function UpdateTPOrderDetail_PurchaseCompletedAt($t_p_invoice_id)
    {
        // 1. [削除済み・削除されてないに関わらず]：仕入idを条件にして取得
        // 2. [削除されてない]：他の仕入データも含めて、完了された仕入idを条件に含める
        // 3. MAX(仕入日)を取得して仕入完了日を更新
        // 4. [削除済み]：該当データが無い場合はnullをセット

        // パラメーターセットしてUpdateSQLを発行
        $param = ['t_p_invoice_id' => $t_p_invoice_id] ;

        // SQL更新
        $affected = DB::update(<<<__SQL_EOT__
            UPDATE t_p_order_details o
               SET o.purchase_completed_at
                 = (SELECT MAX(s.purchase_date) /* 3. MAX(仕入日)を取得して仕入完了日を更新 */
                      FROM t_p_invoices s
                     WHERE s.deleted_at IS NULL
                       /* 2. [削除されてない] 他の仕入データも含めて、完了された仕入idを条件に含める */
                       AND EXISTS (SELECT d.t_p_invoice_id
                                     FROM t_p_invoice_details d
                                    WHERE d.t_p_invoice_id = s.id
                                      AND d.t_p_order_detail_id = o.id
                                      AND d.deleted_at IS NULL
                                      AND d.complete_m_kv_id = 1210001))
             /* 1. [削除済み・削除されてないに関わらず] 仕入idを条件にして取得 */
             WHERE EXISTS (SELECT sd.t_p_order_detail_id
                             FROM t_p_invoice_details sd
                            WHERE sd.t_p_invoice_id = :t_p_invoice_id
                              AND sd.t_p_order_detail_id = o.id)
        __SQL_EOT__, $param) ;

        return $affected ;
    }

}
