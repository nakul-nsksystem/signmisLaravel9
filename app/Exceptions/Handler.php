<?php

namespace App\Exceptions;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Response;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        return parent::render($request, $exception);

        // Responsableインターフェースを継承したクラスはここでレスポンスを返す
        if ($exception instanceof Responsable) {
            return $exception->toResponse($request);
        }

        // HTTP系例外が発生した場合
        if ($this->isHttpException($exception)) {
            return $this->toResponse($request, $exception->getMessage(), $exception->getStatusCode());
        }

        // それ以外の場合は Internal Server Error とする
        return $this->toResponse($request, 'Internal Server Error', Response::HTTP_INTERNAL_SERVER_ERROR);
        


    }


    protected function toResponse($request, string $message, int $statusCode)
    {
         return (new BaseErrorException($message, $statusCode))
            ->toResponse($request);
    }
}
