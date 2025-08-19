<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;

class MRoleKeyCategoryApiController extends BaseApiController
{
        /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MRoleKeyCategory" ;
    }
    //
    public function index()
    {

        $data = $this->model::with("MRoleKeys")
                     ->get()->sortBy("order_no" ) ;
        
        return $data->values()->all();
    }

}
