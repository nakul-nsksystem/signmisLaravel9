<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\MProcesses ;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MProductCategory extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id' , 'created_at', 'updated_at' ,'deleted_at'];

    protected $hidden = [
        'created_at',
        'updated_at',
        "deleted_at"
    ];

    protected $childModels = 
        [
            "MProductCategoryLinkProcess" =>  "App\Models\MProductCategoryLinkProcess" ,
        ] ; 

    // The attributes that should be casted to native types.
    protected $casts = [
        "is_production"=> 'bool' , 
        'is_able_media_separate' => 'bool',
        'is_able_media_separate_both_side' => 'bool',
        'media_separate_overlap_length' => 'double',
        'is_board' => 'bool',
        'is_not_input_size_needed' => 'bool' , 
    ];
    
    public function LinkProcessCategories() : HasMany
    {
        return $this->hasMany('App\Models\MProductCategoryLinkProcess');
    }

    public function LinkProcessCategoriesPivot() 
    {
        return $this
                ->belongsToMany('App\Models\MProcessCategory' ,'App\Models\MProductCategoryLinkProcess' )                
                ->withPivot(['is_default_on' , 'is_required'])
                ->orderBy("order_no") ;
    }
    
}
