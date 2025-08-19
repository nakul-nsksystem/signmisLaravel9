<?php

namespace App\Http\Controllers\Api\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * storage/app以下の（pubic公開していない）ファイルについて扱う
 */
trait LocalFileStorageTrait
{
    
    /**
     * storage/app/customer-resource/customer_keyから該当するファイルを取得
     * @param $fileName 取得したいファイル名称
     * @param $isBase64 base64にして返すかどうか
     */
    protected function getFileByCustomerResource( $fileName, $isBase64 = false ) 
    {   

        $path = "customer-resource/" . config("app.customer_key") . "/" . $fileName ;

        //ファイルが存在しない場合
        if(!Storage::disk("local")->exists($path)) return null ;

        $content = Storage::disk("local")->get($path) ; 
        return $isBase64 ? base64_encode($content) : $content ;

    }


 
}
