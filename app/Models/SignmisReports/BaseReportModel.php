<?php

namespace App\Models\SignmisReports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use App\Models\BaseModel;
use Carbon\Carbon;

class BaseReportModel extends BaseModel
{
    protected function serializeDate( $date): string {
        return Carbon::parse($date)->timezone('Asia/Tokyo')->format('Y-m-d');
    }

}
