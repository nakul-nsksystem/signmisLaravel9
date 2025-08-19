<?php

namespace App\Http\Controllers\Api;

use App\Models\TProject;
use App\Models\TPoint;
use App\Models\TProjectPoint;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\NotFoundErrorException;
use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

/**ミケポイントカスタマイズ */
class TPointApiController extends BaseApiController
{

    protected $projectModel = "";

    public function __construct()
    {
        $this->model = TPoint::class;
        $this->projectModel = TProject::class;
    }


    public function getLatestCompleted($userId)
    {
        $res = $this->model::where("m_user_id", $userId)->where("type_m_kv_id", 12345)->latest("applicated_at")->first();
    }

    public function getByMUserId($userId)
    {

        //仮
        $fromDate = '2024-07-01';

        $query = (new TProjectPointApiController())->getTProject4PointQuery();

        $tProjects = $query->whereNotNull("sales_completed_at")
            ->where("sales_completed_at", ">=", $fromDate);


        return $tProjects->get();
    }
}
