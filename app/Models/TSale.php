<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TSale extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    protected $childModels =
    [
        "TSaleDetails"          =>  "App\Models\TSaleDetail",
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

    public function TSaleDetails()
    {
        return $this->hasMany('App\Models\TSaleDetail')
                    ->orderby('order_no')
                    ->orderby('id');
    }

    public function MBranch()
    {
        return $this->belongsTo('App\Models\MBranch', 'm_branch_id');
    }

    public function MCustomer()
    {
        return $this->belongsTo('App\Models\MCustomer', 'm_customer_id');
    }

    public function MDeliveryDestination()
    {
        return $this->belongsTo('App\Models\MCustomer', 'delivery_destination_m_customer_id');
    }

    public function MUser()
    {
        return $this->belongsTo('App\User', 'm_user_id');
    }

    public function UpdatedMUser()
    {
        return $this->belongsTo('App\User', 'updated_m_user_id');
    }

    public function DeliveryNoteMKv()
    {
        return $this->belongsTo('App\Models\MKv', 'delivery_note_m_kv_id');
    }

    // 物件[売上完了日]を更新
    public function UpdateTProjectsSalesCompletedAt($t_sale_id)
    {
        // 1.売上idを条件にして物件idを取得
        // 2.他の削除されてない売上データも含めて、完了された物件idを条件に含める
        // 3.MAX(出荷日)を取得して物件の売上完了日を更新 該当データが無い場合はnullをセット

        // パラメーターセット
        $param = ['t_sale_id' => $t_sale_id] ;

        // SQL更新
        $affected = DB::update(<<<__SQL_EOT__
            UPDATE t_projects AS p
               SET p.sales_completed_at
                 = (/* 3.MAX(出荷日)を取得して物件の売上完了日を更新 該当データが無い場合はnullをセット */
                    SELECT MAX(s.shipped_at)
                      FROM t_sales AS s
                     WHERE s.deleted_at IS NULL
                       /* 2.他の削除されてない売上データも含めて完了された物件idを条件に含める */
                       AND EXISTS (SELECT sd.t_sale_id
                                     FROM t_sale_details AS sd
                                    WHERE sd.t_sale_id             = s.id
                                      AND sd.t_project_id          = p.id
                                      AND sd.deleted_at           IS NULL    /* 削除対象外     */
                                      AND sd.t_project_product_id IS NULL    /* 一括(物件単位) */
                                      AND sd.ship_m_kv_id         <> 1200005 /* 記入以外       */
                                      AND sd.complete_m_kv_id      = 1210001 /* 売上完了       */))

             /* 1.売上idを条件にして物件idを取得 */
             /* 売上・売上明細が削除された場合も物件・物件商品の売上完了日をNULLに更新する必要があるので下記SubQueryでは論理削除は除外しません */
             WHERE EXISTS (SELECT d.t_project_id
                             FROM t_sale_details AS d
                            WHERE d.t_sale_id    = :t_sale_id
                              AND d.t_project_id = p.id)
        __SQL_EOT__, $param) ;

        return $affected ;
    }

    // 物件商品[売上完了日]を更新
    public function UpdateTProjectProductsSalesCompletedAt($t_sale_id)
    {
        // 1.売上idを条件にして物件商品idを取得
        // 2.他の削除されてない売上データも含めて、完了された物件商品idを条件に含める
        // 3.MAX(出荷日)を取得して物件商品の売上完了日を更新 該当データが無い場合はnullをセット

        // パラメーターセット
        $param = ['t_sale_id' => $t_sale_id] ;

        // SQL更新
        $affected = DB::update(<<<__SQL_EOT__
            UPDATE t_project_products AS p
               SET p.sales_completed_at
                 = (/* 3.MAX(出荷日)を取得して物件商品の売上完了日を更新 該当データが無い場合はnullをセット */
                    SELECT MAX(s.shipped_at)
                      FROM t_sales AS s
                     WHERE s.deleted_at IS NULL
                       /* 2.他の削除されてない売上データも含めて完了された物件商品idを条件に含める */
                       AND EXISTS (SELECT sd.t_sale_id
                                     FROM t_sale_details AS sd
                                    WHERE sd.t_sale_id             = s.id
                                      AND sd.t_project_product_id  = p.id
                                      AND sd.deleted_at           IS NULL    /* 削除対象外 */
                                      AND sd.ship_m_kv_id         <> 1200005 /* 記入以外   */
                                      AND sd.complete_m_kv_id      = 1210001 /* 売上完了   */))

             /* 1.売上idを条件にして物件idを取得 */
             /* 売上・売上明細が削除された場合も物件・物件商品の売上完了日をNULLに更新する必要があるので下記SubQueryでは論理削除は除外しません */
             WHERE EXISTS (SELECT d.t_project_product_id
                             FROM t_sale_details AS d
                            WHERE d.t_sale_id            = :t_sale_id
                              AND d.t_project_product_id = p.id)
        __SQL_EOT__, $param) ;

        return $affected ;
    }

    // 物件[売上完了日]を更新：全ての物件商品で売上完了日が入ってる場合は物件[売上完了日]と比較して大きい方を更新
    public function UpdateTProjectsSalesCompletedAt_4TProjectProducts($t_sale_id)
    {
        // 1.売上idを条件にして物件idを取得
        // 2.物件idをキーにして[削除されてない]物件商品を条件に含める
        // 3.物件商品[売上完了日]が全て設定されているか確認
        //   物件商品[売上完了日]全て設定されていれば物件[売上完了日]と比較して大きい方の完了日を設定
        //   物件商品[売上完了日]1件でもNullの場合は物件[売上完了日]をセット

        // パラメーターセット
        $param = ['t_sale_id' => $t_sale_id] ;

        // SQL更新
        $affected = DB::update(<<<__SQL_EOT__
            UPDATE t_projects AS p
               SET p.sales_completed_at
                 = (/* 3.物件商品[売上完了日]が全て設定されているか確認 */
                    /* 売上完了日(NULL以外)：１件でも未完了の場合 COUNT()は1以上を返す */
                    /* 売上完了日(NULL以外)：全て完了している場合 COUNT(ALL NULL)なので0を返す */
                    SELECT CASE WHEN COUNT(CASE WHEN pd.sales_completed_at IS NULL THEN 1 END) = 0
                                /* 物件商品[売上完了日]全て売上完了されている場合 */
                                /* 物件[売上完了日]と比較して大きい方の完了日を設定 */
                                THEN MAX(CASE WHEN pd.sales_completed_at >= IFNULL(p.sales_completed_at, pd.sales_completed_at)
                                              THEN pd.sales_completed_at
                                              ELSE p.sales_completed_at
                                              END)
                                /* 物件商品[売上完了日]１件でも未完了の場合は物件[売上完了日]をセット */
                                ELSE p.sales_completed_at
                                END AS sales_completed_at
                      FROM t_project_products AS pd
                     /* 2.物件idをキーにして[削除されてない]物件商品を条件に含める */
                     WHERE pd.t_project_id  = p.id
                       AND pd.deleted_at   IS NULL)

             /* 1.売上idを条件にして物件idを取得 */
             /* 売上・売上明細が削除された場合も物件・物件商品の売上完了日をNULLに更新する必要があるので下記SubQueryでは論理削除は除外しません */
             WHERE EXISTS (SELECT d.t_project_id
                             FROM t_sale_details AS d
                            WHERE d.t_sale_id    = :t_sale_id
                              AND d.t_project_id = p.id)
        __SQL_EOT__, $param) ;

        return $affected ;
    }

}
