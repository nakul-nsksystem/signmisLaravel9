<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BaseErrorException;
use App\Models\MTagLink;
use App\Models\MTagCategory ; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Exceptions\DbSaveErrorException ;
use Illuminate\Database\Eloquent\Model;
use App\Exceptions\NotFoundErrorException ; 
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7\Message;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class MsCvApiController extends Controller
{

    private const MS_CV_KEY = 'da2143b09c4c424c96a281ac6aa9add7';

    private const MS_CV_BASE_URL = "https://test-nsk-vision.cognitiveservices.azure.com/vision/v3.2/" ; 


    public function analyzeByOcr(Request $req) {

        $file = $req->file("file");
        $data = file_get_contents($file);
        // $file = Storage::disk('public')->get('ocrtest.png');        
        $url = self::MS_CV_BASE_URL . "ocr?language=ja&detectOrientation=true" ; 
        
        try {
            $res = Http::withHeaders(['Ocp-Apim-Subscription-Key' => self::MS_CV_KEY,])
                ->withBody($data, 'application/octet-stream')
                ->post($url)->throw();

            // log::debug($res) ;
        } 
        catch(RequestException $e) {
            log::debug($e) ;

            //todoエラー処理
        }

        return $this->parse($res) ;

        
    }
    protected function parse($res) {
		if(!$res) return;
		$data = json_decode($res, true);
		$regions = $data['regions'];
		if(!$regions) return;
		// $this->sAllTexts = '';
		// $this->aWords = array();
		$elements = array();
		foreach($regions as $reg){
			if(!array_key_exists('lines', $reg)) continue;
			$lines = $reg['lines'];
			foreach($lines as $line){
				if(!array_key_exists('words', $line)) continue;
				$words = $line['words'];
				$text = '';
				foreach($words as $word){
					$str = $word['text'];
					if(!$str) continue;
					// $this->aWords[] = $str;
					// $this->sAllTexts .= $str;
					$text .= $str;
				}
				$elements[] = $text;
			}
		}

        return $elements ;
	}

}
