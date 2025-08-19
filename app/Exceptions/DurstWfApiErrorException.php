<?php 

namespace App\Exceptions;

use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\Response as HttpResponse;

class DurstWfApiErrorException extends BaseErrorException
{
    
    protected $response;

    /**
     */
    public function __construct(HttpResponse $response)
    {
        $this->response = $response;
    }

    public function toResponse($request)
    {
        // $this->setErrorMessage($responce->body());
        $this->setStatusCode($this->response->status());
        // $this->setErrorCode('record_not_found');
        return new JsonResponse(
            $this->response->json(),
            $this->getStatusCode()
        );
    }


}