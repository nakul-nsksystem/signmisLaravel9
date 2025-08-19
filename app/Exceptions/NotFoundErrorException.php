<?php 

namespace App\Exceptions;

class NotFoundErrorException extends BaseErrorException
{
    public function toResponse($request)
    {
        $this->setErrorMessage('対象のデータを見つけることができませんでした。');
        $this->setStatusCode(400);
        $this->setErrorCode('record_not_found');
        return parent::toResponse($request);
    }
}