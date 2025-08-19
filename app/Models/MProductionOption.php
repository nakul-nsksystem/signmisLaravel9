<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\MProcesses ; 
use Illuminate\Database\Eloquent\SoftDeletes;

class MProductionOption extends BaseModel
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


    // The attributes that should be casted to native types.
    protected $casts = [
        'speed_rate'                => 'double',
        'num_of_colors'             => 'double',
        'num_of_colors_for_cost'    => 'double',
        'num_of_white_for_cost'     => 'double',
        'num_of_varnish_for_cost'   => 'double',
    ];
    /**
     * 
     */
    public function MProduction()
    {
        return $this->belongsTo('App\Models\MProduction');
    }

}
