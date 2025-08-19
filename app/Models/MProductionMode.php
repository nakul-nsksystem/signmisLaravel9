<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\MProcesses ; 
use Illuminate\Database\Eloquent\SoftDeletes;

class MProductionMode extends BaseModel
{
    use SoftDeletes ; 
    
    protected $guarded = ['id' , 'created_at', 'updated_at' ,'deleted_at'];

    protected $hidden = [
        "created_m_user_id" ,
        "updated_m_user_id" ,
        'created_at',
        'updated_at',
        "deleted_at"
    ];

    protected $orderBy = ["order_no"] ; 

    protected $unsetChildren = ["m_process_categories" ,"speed_unit_m_kv"] ; 

    // The attributes that should be casted to native types.
    protected $casts = [
        'speed_per_hour' => 'double',
    ];
    
    
    /**
     * 
     */
    public function MProcessCategories() 
    {
        return $this->morphedByMany('App\Models\MProcessCategory', 'm_production_mode_links');
    }


    /**
     * 
     */
    public function MProduction()
    {
        return $this->belongsTo('App\Models\MProduction');
    }

    
    /**
     * 
     */
    public function SpeedUnitMKv()
    {
        return $this->belongsTo('App\Models\MKv', 'speed_unit_m_kv_id');
    }

}
