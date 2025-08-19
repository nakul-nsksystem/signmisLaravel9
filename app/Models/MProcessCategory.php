<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MProcessCategory extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id' , 'created_at', 'updated_at' ,'deleted_at'];
    //
    protected $hidden = [
        'created_at',
        'updated_at',
        "deleted_at"
    ];

    // The attributes that should be casted to native types.
    protected $casts = [
        'is_able_to_add' => 'boolean',
        'is_production' => 'boolean',
        "is_main_material"=> 'boolean',
    ];    

    protected $childModels = 
        [
            "MProcesses"            => "App\Models\MProcess" ,
            "MProcessMaterials"     => "App\Models\MProcessMaterial" ,
            "MProcessOutsources"    => "App\Models\MProcessOutsource" ,
            "MProcessLabels"        => "App\Models\MProcessLabel" ,
        ] ; 

        
    public function MProcesses() 
    {
        return $this->hasMany('App\Models\MProcess')->orderBy("order_no");
    }

    public function MProcessMaterials() 
    {
        return $this->hasMany('App\Models\MProcessMaterial')->orderBy("order_no");
    }
    
    public function MProcessOutsources() 
    {
        return $this->hasMany('App\Models\MProcessOutsource')->orderBy("order_no");
    }
    
    public function MProcessLabels() 
    {
        return $this->hasMany('App\Models\MProcessLabel')->orderBy("order_no");
    }

    public function MProductions() 
    {
        return $this
                ->morphToMany(MProduction::class ,"m_production_links" ) ;
    }


}
