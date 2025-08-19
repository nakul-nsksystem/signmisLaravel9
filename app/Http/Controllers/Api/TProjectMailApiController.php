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


class TProjectMailApiController extends BaseApiController
{    
        /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\TProjectMail" ;
    }
    
    public function getInfoByEml(Request $request){
        //メール取得
        $email = $request->file('mail') ;

        $user = Auth::user() ;
        $folderName = $user["id"] . date("YmdHis") ;
        $srcMail = $email->getClientOriginalName() ;
        // $srcMail = $fileName .".eml" ;

        //メール仮保存先パス
        $tempPath = 'public/temporary/t_project/emails/' . $folderName ;
        //添付ファイル仮保存先パス
        $tempFilePath = 'public/temporary/t_project/' . $folderName ;

        //emlファイル保存後に実装
        Storage::putFileAs($tempPath,$email,$srcMail) ;

        //メールパース
        $parser = new Parser();
        // $parser->setPath("$path/$srcMail") ; 

        $parser->setStream(fopen($email, "r"));
        //$parser->setText(file_get_contents("$path/$fileName"));
        

        //メール内情報抽出
        $to           = $parser->getHeader('to');        
        $from         = $parser->getHeader('from');
        $cc           = $parser->getHeader('cc'); 
        $receivedDate = $parser->getHeader('date');
        $subject      = $parser->getHeader('subject');
        $text         = $parser->getMessageBody('text');

        //添付ファイル取得
        $attachments = $parser->getAttachments(); 
        $projectFiles = array();
        if(!empty($attachments))
        {

            foreach($attachments as $attachment) 
            {   
                try 
                {   
                    $attachmentName = $attachment->getFilename() ;
                    $filepath = $tempFilePath . "/$attachmentName" ;

                    Storage::put($filepath, $attachment->getContent());
                    $filesize = Storage::size($filepath);
                    // $modified = Storage::lastModified($filepath);
                    $extension = pathinfo($filepath)["extension"] ;


                    $projectFiles[] = array(
                        "filename"    => $attachmentName ,
                        "filepath"    => '/' . $filepath ,
                        "folder_code" => $folderName ,
                        "extension"   => $extension ,
                        "filesize"    => $filesize ,
                        // "modified"    => $modified ,
                        "parent_id"   => null ,
                        "is_unsave"   => true ,
                        "is_folder"   => false,
                    );

                } 
                catch (\Exception $e) 
                {
                    Log::debug($e) ; 
                }

            }
        } 
        //log::debug($projectFiles) ;

        return array(
            "mailpath"        => $tempPath . '/' . $srcMail,
            "to"              => $to , 
            "from"            => $from ,
            "cc"              => $cc ,
            "received_at"     => $receivedDate ,
            "subject"         => $subject , 
            "body"            => $text ,
            "t_project_files" => $projectFiles ,
            
        ) ; 
                       
    }

    public function deleteWithFiles (Request $request) {
        $data = $request->all() ; 
        $path = dirname($data['mailpath']) ;   
            
        Storage::deleteDirectory($path) ;
    }

    public function deleteOnlyMail (Request $request) {
        $data = $request->all() ;
        Storage::delete($data['mailpath']) ;
    }
}
