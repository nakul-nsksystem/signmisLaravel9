<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProjectMail extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    
    protected $childModels = 
    [
        // "TProjectFiles" =>  "App\Models\TProjectFile" ,
    ] ; 


    protected $unsetChildren = ["error_message" ,"attFlg","t_project_files"] ; 


    public function TProject()
    {
        return $this->belongsTo('App\Models\TProject');
    }

    public function TProjectFiles()
    {
        return $this->hasMany('App\Models\TProjectFile');
    }

}
