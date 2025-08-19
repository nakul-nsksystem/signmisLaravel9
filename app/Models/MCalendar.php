<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MCalendar extends BaseModel
{
	use SoftDeletes;
	// 更新禁止のフィールド指定
	//protected $guarded = ['id' , 'created_at', 'updated_at' ,'deleted_at'];
	protected $guarded = ['deleted_at'];

    public function MBranch()
    {
		// 連携先テーブルと連携元フィールドを指定
		return $this->belongsTo('App\Models\MBranch', 'm_branch_id');
	}

    public function CategoryMKv()
    {
		// 連携先テーブルと連携元フィールドを指定
		return $this->belongsTo('App\Models\MKv', 'category_m_kv_id');
	}



}
