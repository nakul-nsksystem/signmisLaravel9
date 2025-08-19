<?php

namespace App\Http\Controllers\Api\Traits;

use App\Models\BaseModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * 保存後にPivot系のテーブルをSaved
 */
trait ThumbnailUploadTrait
{
    
    /**
     * サムネイルアップロード
     */
    public function thumbnailUpload( Request $request, $id){
        $row = $this->show($id) ; 
        
        $file = $request->file("thumbnail")  ; 
        if ( ! $file){  
            return $this->thumbnailDelete($row) ; 
            // $error = new FileNotFoundErrorException() ; 
            // throw $error ;             
        }
        

        $storagePath = $row["thumbnail_path"] ;         
        if (! empty($storagePath)){
            if ( Storage::disk("public")->exists($storagePath)){
                Storage::disk("public")->delete($storagePath) ; 
            }
        }

        $path = Storage::disk("public")->put("thumbnails" ,$file) ; 
        
        $row["thumbnail_path"] = $path ; 
        $row->save();        
        return $row ; 
        // dd($row) ;

    }

    /**
     * サムネイルの削除
     */
    private function thumbnailDelete($row){
        // Log::debug($row) ; 
        $storagePath = $row->thumbnail_path ; 
        if ($storagePath){
            if ( Storage::disk("public")->exists($storagePath)){
                Storage::disk("public")->delete($storagePath) ; 
            }
            $row["thumbnail_path"] = null ; 
            $row->save();        

        }
        
        return $row ; 


    }

 
}
