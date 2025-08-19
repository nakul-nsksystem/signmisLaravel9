<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use PhpMimeMailParser\Parser;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Storage;

use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use Spatie\Dropbox\Client as DropboxClient;
use Illuminate\Support\Facades\Http;

class TProjectFileApiController extends BaseApiController
{    
        /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TProjectFile" ;
    }

    public function dropboxTest() {
        
        Log::debug(Storage::disk('dropbox')->size('BRUT.ai')) ; 
        Log::debug(Storage::disk('dropbox')->allFiles()) ; 

        $dropbox = app()->make('dropboxClient');
        Log::debug($dropbox->getMetadata("BRUT.ai") ); 

        $thumbnail = $dropbox->getThumbnail("BRUT.ai" , "jpeg" , "w480h320" ) ; 

        Storage::disk('dropbox')->put('BRUT.ai_thumbnail.jpg', $thumbnail);
        return "" ; 
        //return $thumbnail  ; 
    }

    public function getAccessToken() {

        // $token = Http::asForm()
        //     ->post('https://api.dropbox.com/oauth2/token', [
        //         'refresh_token' => config('dropbox.refresh_token'),
        //         'client_secret' => config('dropbox.app_secret'),
        //         'client_id' => config('dropbox.app_key'),
        //         'grant_type' => 'refresh_token',
        //     ])
        //     ->json()['access_token'] ;

        // return $token;
        $token = config('app.dropbox_api_token') ; 
        return $token ; 
        
    }

    public function saveFile(Request $request){
        //ファイル取得
        $file = $request->file("file");
        $parentpath = $request->parentPath ;
        $fileCode = $request->fileCode ;

        // log::debug($fileCode) ;

        $userId = Auth::user()->id ;

        
        //単体ファイルorフォルダー分岐
        if($parentpath=="undefined"){
            $fileName = $file->getClientOriginalName() ;
            $extension = $file->extension() ;
            $fileSize = filesize($file) ;
            $filepath = "public/temporary/t_project/$fileCode/$fileName" ;   

            //ファイル保存
            ini_set('max_execution_time', 180) ;

            Storage::putFileAs("public/temporary/t_project/$fileCode" , $file , $fileName) ;

    
        } else {
            
            $fileDir = pathinfo($parentpath)["dirname"] ;
            // $fileName = pathinfo($parentpath)["basename"] ;
            $fileName = $file->getClientOriginalName() ;

            $extension  = pathinfo($parentpath)["extension"] ;
            $fileSize = filesize($file) ;

            // log::debug($parentpath) ;
            // log::debug($fileName) ;
            
            $filepath = "public/temporary/t_project/$fileCode/$fileDir/$fileName" ;                
            //ファイル保存
            ini_set('max_execution_time', 180) ;

            Storage::putFileAs("public/temporary/t_project/$fileCode/$fileDir" , $file , $fileName) ;
        }
        $dropbox = app()->make('dropboxClient') ;

        
        try {
            $thumbnailPath = null ;
            $thumbnailPath4View = 'img/noimage.png' ;

            $thumbnail = $dropbox->getThumbnail($filepath , "jpeg" , "w480h320") ;
            //md
            //$thumbnail = $dropbox->getThumbnail($filepath , "jpeg" , "w256h256") ;

            //sm
            // $thumbnail = $dropbox->getThumbnail($filepath , "jpeg" , "w128h128") ;
            $thumbnailName = $fileName . '.' . "jpeg" ;    

            if($parentpath=="undefined") {
                $thumbnailPath = "public/temporary/t_project/thumbnails/$fileCode/$thumbnailName" ;        
            } else {
                $thumbnailPath = "public/temporary/t_project/thumbnails/$fileCode/$fileDir/$thumbnailName" ;        

            }
            
            $dropbox->upload($thumbnailPath, $thumbnail, 'add') ;
            
            // $thumbnailPath4View = $dropbox->getTemporaryLink($thumbnailPath) ;

            $thumbnailPath4View = base64_encode($thumbnail) ;

            // log::debug($base64File) ;

        } catch(Exception $e) {

        } finally {
            return array(
                "filename"          => $fileName ,
                "filepath"          => $filepath ,
                "src_filepath"      => $filepath ,
                "is_folder"         => 0 ,
                "base64_thumbnail"  => $thumbnailPath4View ,
                "src_thumbnailpath" => $thumbnailPath ,
                "extension"         => $extension ,
                "filesize"          => $fileSize ,
                "children"          => array() ,
                "is_unsave"         => 1 ,                 
            );

        }   
    }    

    public function updateFile(Request $request){
        //ファイル取得
        $file = $request->file('file') ;
        $filepath = $request->filepath ;
        $fileDir = $request->file_dir ;
        $fileCode = $request->fileCode ;
        // $srcThumbnailpath = $request->src_thumbnailpath ; 
        $extension = pathinfo($filepath)['extension'] ;
        $fileName = pathinfo($filepath)["filename"] . '.' . $extension ;

        $fileSize = filesize($file) ;

        //単体ファイルorフォルダー分岐
        if(!$fileDir){
            $tempPath = "public/temporary/t_project/$fileCode/$fileName" ;   
            //ファイル保存
            ini_set('max_execution_time', 180) ;

            Storage::putFileAs("public/temporary/t_project/$fileCode" , $file , $fileName) ;

        } else {            
            $tempPath = "public/temporary/t_project/$fileCode/$fileDir/$fileName" ;                
            //ファイル保存
            ini_set('max_execution_time', 180) ;

            Storage::putFileAs("public/temporary/t_project/$fileCode/$fileDir" , $file , $fileName) ;
        }

        

        $dropbox = app()->make('dropboxClient') ;

        //dropbox処理
        try {
            // $tempThumbnailPath = null ;
            $tempThumbnailPath4View = 'img/noimage.png' ;

            $thumbnail = $dropbox->getThumbnail($tempPath , "jpeg" , "w480h320" ) ;
            $userId = Auth::user()->id ;

            $thumbnailName = $userId . '-' . uniqid('', true) . '-' . rand() . '.' .'jpeg' ;

            $tempThumbnailPath4View = base64_encode($thumbnail) ;


        } catch(Exception $e) {
            
            
        } finally {
            return array(
                "filesize" => $fileSize ,
                "filepath" => $tempPath ,
                "src_filepath" => $tempPath ,
                "base64_thumbnail" => $tempThumbnailPath4View ,
                "src_thumbnailpath" => null ,
                "is_unsave"  => 1 ,
                "is_updated" => 1 ,
            ); 
        }
               
                       
    }

    public function deleteTempFile (Request $request) {
        $data = $request->all() ;
        // log::debug($data) ;
        foreach($data as $file)
        {
            if(isset($file["is_unsave"]))
            {
                Storage::delete($file['filepath']) ;
                // Storage::delete($file['src_thumbnailpath']) ;

            } 

        }
    }

    public function deleteFile (Request $request) {
        $data = $request->all() ;
        Storage::delete($data['filepath']) ;
        // Storage::delete($data['src_thumbnailpath']) ;
    }
    public function downloadFile (Request $request) {
        $data = $request->all() ;
        $path = $data['filepath'] ;
        
        $dropbox = app()->make('dropboxClient') ;

        $arguments = [
            'path' => "/" . $path,
        ];

        if($data["is_folder"]){

            ini_set('max_execution_time', 180) ;

            $response = $dropbox->contentEndpointRequest('files/download_zip' , $arguments);

        } else {
            
            $response = $dropbox->contentEndpointRequest('files/download' , $arguments);

        } 

        $body = $response->getBody() ;
        $contents = $body->getContents() ;

        return $contents ;

    }


    public function decordBase64 () {
        log::debug("decord start") ;

        $data = $this->model::with("TProject:id,cd")
            ->where('is_folder', '=', 0)
            ->where('base64_thumbnail_willdrop', '!=', "img/noimage.png")
            ->whereNotNull('base64_thumbnail_willdrop')
            ->has('TProject')
            ->chunkById(10, function ($files) { 

                foreach($files as $file) {
                    // log::debug($file->TProject) ;
                    $fileName = bin2hex(openssl_random_pseudo_bytes(16)) . ".jpeg";
                    $storagePath = "t_project/" . $file->TProject["cd"] . "/$fileName" ; 
                    $fileData = base64_decode($file["base64_thumbnail_willdrop"]);

                    // log::debug($file["id"]) ;
                    if($fileData && !Storage::disk('public')->exists($storagePath)) {
                        Storage::disk('public')->put($storagePath, $fileData) ;

                        $file["src_thumbnailpath"] = $storagePath ;
                    }
                    $row = $this->model::find($file["id"]) ;
                    $this->saveRow($file, $row) ;

                }
            });
        log::debug("decord end") ;

        return "end" ;
    } 
}
