<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TPoint extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [

    ];

    
    protected $unsetChildren = [] ; 
    

    protected $childModels = 
        [
        ] ; 

    protected $delInsChildModels = 
        [
        ] ; 

    public function MUser()
    {
        return $this
            ->belongsTo('App\User' )
            ->withTrashed();
    }

    

}
