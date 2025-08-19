<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;



class TProjectConstructionResult extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];


    protected $casts = [
        // 'start_time' => 'datetime:H:i',
        // 'end_time' => 'datetime:H:i',
        // 'parking_fee' => 'double' ,
        // 'expendable_fee' => 'double' ,
        // 'other_fee' => 'double' ,
    ];
    protected $unsetChildren = ["t_project_cd", "is_unsave"];

    protected $childModels =
    [
        "TProjectConstructionResultUsers" =>  "App\Models\TProjectConstructionResultUser",
        "TProjectConstructionResultPictures" =>  "App\Models\TProjectConstructionResultPicture",
        "TProjectConstructionResultCosts" =>  "App\Models\TProjectConstructionResultCost",
    ];



    protected $delInsChildModels =
    [
        // "TProjectConstructionResultUsers" =>  "App\Models\TProjectConstructionResultUser" ,
        // "TProjectConstructionResultPictures" =>  "App\Models\TProjectConstructionResultPicture" ,
        // "TProjectConstructionResultCosts" =>  "App\Models\TProjectConstructionResultCost" ,
    ];
    protected $appends = ['result_user_full_names'];


    public function TProjectDelivery()
    {
        return $this->belongsTo('App\Models\TProjectDelivery');
    }

    public function TProjectConstructionResultUsers()
    {
        return $this->hasMany('App\Models\TProjectConstructionResultUser');
    }

    public function TProjectConstructionResultPictures()
    {
        return $this->hasMany('App\Models\TProjectConstructionResultPicture');
    }
    public function TProjectConstructionResultCosts()
    {
        return $this->hasMany('App\Models\TProjectConstructionResultCost');
    }

    public function getResultUserFullNamesAttribute()
    {
        $mUserNames = [];

        foreach ($this["TProjectConstructionResultUsers"] as $user) {
            if (! is_null($user["m_user_id"])) {
                // User
                $mUserNames[] = $user->MUser["full_name"];
            } else {
                // OutSource
                if (!is_null($user->OutSourceMCustomer)) {
                    $outsourceName = $user->OutSourceMCustomer["short_name_or_name"];
                    $mUserNames[] =  "{$outsourceName}({$user->num_of_out_source_people})";
                }
            }
        }

        return implode(',', $mUserNames);
    }
}
