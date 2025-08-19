<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\MProcesses ;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class MProduction extends BaseModel
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
        'max_w' => 'integer',
        'max_h' => 'integer',
        'min_w' => 'integer',
        'min_h' => 'integer',
        'cost_per_hour' => 'double',
        'prepare_sec' => 'integer',
        'color_ink_cost_per_sqm' => 'double',
        'white_ink_cost_per_sqm' => 'double',        
        'varnish_ink_cost_per_sqm' => 'double',
        
    ];

    protected $childModels = 
        [
            "MProductionModes" =>  "App\Models\MProductionMode" ,
            "MProductionOptions" =>  "App\Models\MProductionOption" ,
        ] ; 

    protected $unsetChildren = ["m_process_categories" ,"m_product_categories" ,"m_branch"] ; 


    /**
     * 
     */
    public function MBranch()
    {
        return $this->belongsTo('App\Models\MBranch', "m_branch_id") ;
    }
    
    public function MProductionExtTool()
    {
        return $this->belongsTo(MProductionExtTool::class, "m_production_ext_tool_id") ;
    }
    
    

    /**
     * 
     */
    public function MProcessCategories() 
    {
        return $this->morphedByMany('App\Models\MProcessCategory', 'm_production_links')
            ->withPivot(['target_m_production_no' ]);
    }

    /**
     * 
     */
    public function MProductCategories()
    {
        return $this->morphedByMany('App\Models\MProductCategory', 'm_production_links') ;
    }

    
    public function MProductionModes() : HasMany
    {
        return $this->hasMany('App\Models\MProductionMode')->orderBy("order_no");
    }

    public function MProductionOptions() : HasMany
    {
        return $this->hasMany('App\Models\MProductionOption')->orderBy("order_no");
    }

    public function MCustomer()
    {
        return $this->belongsTo('App\Models\MCustomer');
    }


}
