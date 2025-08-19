<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TUserPoint extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'point'                    => 'double',
        'profit'                   => 'double',
        'sell_price'               => 'double',
        'sale_price'               => 'double',
        'cost'                     => 'double'
    ];

    // ユーザー情報
    public function MUser()
    {
        return $this->belongsTo('App\User', 'm_user_id');
    }

    // 案件情報
    public function TProject()
    {
        return $this->belongsTo('App\Models\TProject', 't_project_id');
    }

    // ポイントタイプ
    public function PointTypeMKv()
    {
        return $this
            ->belongsTo('App\Models\MKv', 'point_type_m_kv_id');
    }

    // ポイント付与タイプ
    public function PointGrantTypeMKv()
    {
        return $this
            ->belongsTo('App\Models\MKv', 'point_grant_type_m_kv_id');
    }

    public function CreatedMUser()
    {
        return $this->belongsTo('App\User', 'created_m_user_id');
    }

    public function UpdatedMUser()
    {
        return $this->belongsTo('App\User', 'updated_m_user_id');
    }
}
