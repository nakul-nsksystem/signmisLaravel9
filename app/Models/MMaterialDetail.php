<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MMaterialDetail extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'] ;

    protected $casts = [
        'width'                 => 'double',
        'width_margin'          => 'double',
        'height'                => 'double',
        'height_including_loss' => 'double',
        'capacity'              => 'double',
        'cost_price'            => 'double',
        'unit_price'            => 'double',
        'tax_rate'              => 'double',
    ] ;

    public function UnitMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'unit_m_kv_id');
    }

    public function OrderPermissionMKvs() 
    {
        return $this->belongsTo('App\Models\MKv', 'order_permission_m_kv_id');
    }

    public function DeliveryCalcMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'delivery_calc_m_kv_id');
    }

    public function MMaterial() 
    {
        return $this->belongsTo('App\Models\MMaterial', 'm_material_id');
    }

    // OrderNoの採番
    public function UpdateNumbering_MMaterialDetailsOrderNo($m_material_id)
    {
        // パラメーターセット：SubQuery内では個別にパラメーターを明示しないと更新できなかった(バグ or 仕様)
        $param = [
                  'm_material_id_1' => $m_material_id ,
                  'm_material_id_2' => $m_material_id ,
                 ] ;

        // SQL更新：OrderNoの採番(詳細名、idで並び替え)
        $affected = DB::update(<<<__SQL_EOT__
            UPDATE m_material_details t1,
                   (SELECT t2.id, @rownum := @rownum + 1 AS auto_row_num
                      FROM (SELECT @rownum := 0) dummy,
                            m_material_details t2
                     WHERE t2.m_material_id = :m_material_id_1
                     ORDER BY t2.m_material_id, t2.width, t2.height, t2.capacity, t2.contents_qty, t2.detail_name, t2.id
                   ) t3
               SET t1.order_no = t3.auto_row_num
             WHERE t1.id = t3.id
               AND t1.m_material_id = :m_material_id_2
        __SQL_EOT__, $param) ;

        // LOG::debug($affected) ;
        return $affected ;
    }


    

        // CSVヘッダー
        public static $csvHeader = [
            '材料id',
            '材料明細id',
            'コード',
            '拠点',
            'カテゴリ',
            'サブカテゴリ',
            '仕入先名',
            '名称',
            '通称',
            '詳細',
            '幅',
            '幅マージン',
            '流れ・M数',
            'ロス込み流れM数',
            '容量',
            '内容数',
            '最低発注数',
            '単位',
            '単価',
            'ロス込原価',
            '税区分',
            '説明',
            '在庫管理フラグ',
            '資材タグ',
            '厚み',
            '重量',
            '防炎シール番号',
            '材料備考',
            '明細備考',
            '作成担当者',
            '更新担当者',
            '作成日',
            '更新日',
        ] ;


}
