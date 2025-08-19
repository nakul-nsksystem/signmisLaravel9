<?php 

namespace App\Exceptions;

class FileNotFoundErrorException extends BaseErrorException
{
    public function toResponse($request)
    {
        $this->setErrorMessage('アップロードファイルがありません。');
        $this->setStatusCode(400);
        $this->setErrorCode('uploaded_file_not_found');
        return parent::toResponse($request);
    }
}