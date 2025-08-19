<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\MProcesses ; 
use Illuminate\Database\Eloquent\SoftDeletes;

class MProductionModeLink extends BaseModel
{
    protected $guarded = ['id' , 'created_at'];



}
