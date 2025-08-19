<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TProjectConstructionResultPicture extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];   
    
    // protected $unsetChildren = ["base64_preview" ] ;   
    protected $casts = [
    
    ] ;      
    protected $appends = ['base64_thumbnail'];
    public function getBase64ThumbnailAttribute()
    {   

        $content =  "img/noimage.png" ;

        if( isset($this["src_thumbnailpath"]) ) {
            
            if(Storage::disk('public')->exists($this["src_thumbnailpath"])) {
                $thumbnail = Storage::disk('public')->get($this["src_thumbnailpath"]) ;
                $content = base64_encode($thumbnail) ;

            } 

        } else {

            //DBに保存中のbase64を表示する回避処理。Dropcolumnした段階で削除する
            if( isset($this["base64_preview_willdrop"])) {
                $content = $this["base64_preview_willdrop"] ;
            }
        }

        return $content ;

        // log::debug($base64) ;
    }

}
