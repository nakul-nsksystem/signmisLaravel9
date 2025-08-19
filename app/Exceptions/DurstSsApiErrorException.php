<?php 

namespace App\Exceptions;

use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\Response as HttpResponse;

class DurstSsApiErrorException extends BaseErrorException
{
    
    public function toResponse($request)
    {
        $this->setErrorMessage('接続に失敗しました');
        $this->setStatusCode(400);
        $this->setErrorCode('ss_connecting_error');
        return parent::toResponse($request);
    }


}