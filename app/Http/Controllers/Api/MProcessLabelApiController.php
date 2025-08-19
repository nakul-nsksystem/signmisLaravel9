<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MProcessLabelApiController extends BaseApiController
{

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MProcessLabel" ;
    }


}
