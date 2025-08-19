<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TSaleDetailApiController extends BaseApiController
{
    public function __construct()
    {
        $this->model = "App\Models\TSaleDetail";
    }

}
