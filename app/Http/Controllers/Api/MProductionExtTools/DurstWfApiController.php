<?php

namespace App\Http\Controllers\Api\MProductionExtTools;

use App\Exceptions\BaseErrorException;
use App\Models\MTagLink;
use App\Models\MTagCategory ; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Exceptions\DbSaveErrorException ;
use App\Exceptions\DurstWfApiErrorException;
use Illuminate\Database\Eloquent\Model;
use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\BaseModel;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7\Message;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class DurstWfApiController extends Controller
{

    const DWF_TOKEN_SESSION_KEY = 'dwf-tokens';

    const DWF_BASE_URL = "http://127.0.0.1:8081/pms/" ; 
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function createXml(Request $req){
        $params = $req->all() ; 
        // return $params ; 
        // dd($params) ; 
        return response()->streamDownload(function () use ($params) {
            $dtl = view('m_production_ext_tools.durstwf.xml' ,compact('params')) ;

            $file = 'C:\PMS_DATA\Nsk\JobHotFolder\misjob.xml';
            file_put_contents($file, $dtl);

            echo $dtl ; 
        }) ; 
            
    }

    protected function login(Request $request){

        $username = "concerto" ; 
        $pass = "concerto" ; 

        $url = self::DWF_BASE_URL . "api/v1/login?password={$username}&username={$pass}" ; 

        $token = "" ; 
        try {
            $response = Http::get($url )->throw();           
            $token = $response->header("x-auth-token") ;   
            $request->session()->put(self::DWF_TOKEN_SESSION_KEY, $token);          
        }
        catch (RequestException $e) {             
            $error = new DurstWfApiErrorException($e->response) ; 
            throw $error ;             
        } 
        Log::debug("Login on PHP") ; 
        return $response->getBody();

    }


    protected function isTokenExists(Request $req){
        return $req->session()->exists(self::DWF_TOKEN_SESSION_KEY) ; 
    }


    /**
     * ジョブ作成
     */
    public function createJob(Request $req){
        if (! $this->isTokenExists($req) ){
            // Error 
            $this->login($req) ; 
        }
        
        $token = $req->session()->get(self::DWF_TOKEN_SESSION_KEY) ;
        $url = self::DWF_BASE_URL . "api/v1/productionJobs/create" ; 
        try {
            $response = Http::withHeaders([
                'x-auth-token' => $token,
            ])->post($url , $req->all())->throw();
        }
        catch (RequestException $e) { 
            $req->session()->forget(self::DWF_TOKEN_SESSION_KEY) ;
            $error = new DurstWfApiErrorException($e->response) ; 
            throw $error ;
        } 

        return $response->json();

    }

    
    /**
     * Imposeテンプレート取得
     */
    public function getOutputTemplates(Request $req){
        if (! $this->isTokenExists($req) ){
            // Error 
            $this->login($req) ; 
        }
        
        $token = $req->session()->get(self::DWF_TOKEN_SESSION_KEY) ;
        $url = self::DWF_BASE_URL . "api/v1/outputTemplates" ; 
        try {
            $response = Http::withHeaders([
                'x-auth-token' => $token,
            ])->get($url)->throw();
        }
        catch (RequestException $e) { 
            $req->session()->forget(self::DWF_TOKEN_SESSION_KEY) ;
            $error = new DurstWfApiErrorException($e->response) ; 
            throw $error ;
        } 

        return $response->json();

    }
    
    /**
     * Imposeテンプレート取得
     */
    public function getImposeTemplates(Request $req){
        if (! $this->isTokenExists($req) ){
            // Error 
            $this->login($req) ; 
        }
        
        $token = $req->session()->get(self::DWF_TOKEN_SESSION_KEY) ;
        $url = self::DWF_BASE_URL . "api/v1/impose/templates" ; 
        try {
            $response = Http::withHeaders([
                'x-auth-token' => $token,
            ])->get($url)->throw();
        }
        catch (RequestException $e) { 
            $req->session()->forget(self::DWF_TOKEN_SESSION_KEY) ;
            $error = new DurstWfApiErrorException($e->response) ; 
            throw $error ;
        } 

        return $response->json();

    }

    
    
    /**
     * Impose
     */
    public function impose(Request $req ,$jobId ){
        if (! $this->isTokenExists($req) ){
            // Error 
            $this->login($req) ; 
        }
        
        $token = $req->session()->get(self::DWF_TOKEN_SESSION_KEY) ;
        $url = self::DWF_BASE_URL . "api/v1/productionJobs/{$jobId}/impose" ; 
        
        try {
            $response = Http::withHeaders([
                'x-auth-token' => $token,
            ])->post($url , $req->all())->throw();
        }
        catch (RequestException $e) { 
            $req->session()->forget(self::DWF_TOKEN_SESSION_KEY) ;
            $error = new DurstWfApiErrorException($e->response) ; 
            throw $error ;
        } 

        return $response->json();

    }

    
    /**
     * Get Impose Result
     */
    public function getImposeResult(Request $req ,$jobId ,$fileTypeKey  ){
        if (! $this->isTokenExists($req) ){
            // Error 
            $this->login($req) ; 
        }
        
        $token = $req->session()->get(self::DWF_TOKEN_SESSION_KEY) ;
        $url = self::DWF_BASE_URL . "api/v1/productionJobs/{$jobId}/files/{$fileTypeKey}/base64" ; 
        
        try {
            $response = Http::withHeaders([
                'x-auth-token' => $token,
            ])->get($url )->throw();
        }
        catch (RequestException $e) { 
            $req->session()->forget(self::DWF_TOKEN_SESSION_KEY) ;
            $error = new DurstWfApiErrorException($e->response) ; 
            throw $error ;
        } 

        return $response->body();

    }
    
    /**
     * sendToPrinter
     */
    public function sendToPrinter(Request $req ,$jobId ){
        if (! $this->isTokenExists($req) ){
            // Error 
            $this->login($req) ; 
        }
        
        $token = $req->session()->get(self::DWF_TOKEN_SESSION_KEY) ;
        $url = self::DWF_BASE_URL . "api/v1/productionJobs/{$jobId}/sendToPrinter" ; 
        
        try {
            $response = Http::withHeaders([
                'x-auth-token' => $token,
            ])->get($url )->throw();
        }
        catch (RequestException $e) { 
            $req->session()->forget(self::DWF_TOKEN_SESSION_KEY) ;
            $error = new DurstWfApiErrorException($e->response) ; 
            throw $error ;
        } 

        return $response->json();

    }


}
