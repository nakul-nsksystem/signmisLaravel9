<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MProcess extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id' , 'created_at', 'updated_at' ,'deleted_at'];
    //
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        //'is_use_prepare_per_job' => 'bool' , 
        'prepare_per_job_target_m_production_no' => 'integer',
        'prepare_per_job_speed_ref_type' => 'integer',
        'prepare_per_job_rate_type_m_kv_id' => 'integer',
        'prepare_per_job_num_of_worker_effect' => 'double',

        //'is_use_prepare_per_qty' => 'bool' , 
        'prepare_per_qty_target_m_production_no' => 'integer',
        'prepare_per_qty_speed_ref_type' => 'integer',
        'prepare_per_qty_rate_type_m_kv_id' => 'integer',
        'prepare_per_qty_num_of_worker_effect' => 'double',

        //'is_use_operation' => 'bool' , 
        'operation_target_m_production_no' => 'integer',
        'operation_speed_ref_type' => 'integer',
        'operation_rate_type_m_kv_id' => 'integer',
        'operation_num_of_worker_effect' => 'double',
        
    ];
}
