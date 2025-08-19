<?php 

namespace App\Exceptions;

class DbSaveErrorException extends BaseErrorException
{
    /**
     * @var string
     */
    protected $dbErrorCode;

    /**
     * @var string
     */
    protected $dbSubErrorCode;

    
    public function toResponse($request)
    {
        $this->setErrorMessage('保存に失敗しました');
        $this->setStatusCode(400);
        $this->setErrorCode('record_save_failed');
        return parent::toResponse($request);
    }

    protected function getBasicResponse()
    {
        if ( $this->dbErrorCode == 23000)
        {
            if ( $this->dbSubErrorCode == 1062 )
            {
                // Unique KeyError 
                $this->setErrorMessage('保存に失敗しました。コードが重複しています。');
            }
            elseif ($this->dbSubErrorCode == 1452 )
            {
                // foreign key constraint　Error 
                $this->setErrorMessage('保存に失敗しました。データの整合性に問題があります。');
            }
            
        }

        return [
            'message' => $this->getErrorMessage(),
            'code' => $this->getErrorCode() ?? $this->getDefaultErrorCode(),
            'sqlstate' => $this->dbErrorCode,
            'sqlcode' => $this->dbSubErrorCode  ?? 0 ,
        ];
    }

    
    /**
     * @param int $dbErrorCode
     */
    public function setDbErrorCode(string $dbErrorCode): void
    {
        $this->dbErrorCode = $dbErrorCode;
    }

    /**
     * @param int $dbErrorSubCode
     */
    public function setDbErrorSubCode(string $dbSubErrorCode): void
    {
        $this->dbSubErrorCode = $dbSubErrorCode;
    }


}