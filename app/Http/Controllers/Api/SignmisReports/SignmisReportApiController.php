<?php

namespace App\Http\Controllers\Api\SignmisReports;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseApiController;
use App\Models\SignmisReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\Traits\CsvExportTrait;

class SignmisReportApiController extends BaseApiController
{

    use CsvExportTrait ;
    public function getQuery(Request $request)
    {
        $query = $this->getFiltered($request) ;

        return $query ;
    }

    public function retrieve(Request $request)
    {
        return $this->getQuery($request)->get() ;
    }

    public function exportCsv(Request $request)
    {
        $csvData = $this->retrieve($request)->toArray();
        $response = $this->createCsv($csvData);

        return $response;
    }

}
