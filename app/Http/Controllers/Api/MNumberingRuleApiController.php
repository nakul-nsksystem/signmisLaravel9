<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;

class MNumberingRuleApiController extends BaseApiController
{
    public function __construct()
    {
    }

}
