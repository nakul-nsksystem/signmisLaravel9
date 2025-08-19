<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class TProjectFile extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $appends = ['src_filepath'];

    protected $unsetChildren = ["is_unsave","m_tags","m_tag_links","appFlg","children","folder_code","is_moved","src_filepath"] ; 

    public function getSrcFilepathAttribute()
    {
        return $this["filepath"] ;
        
    }


    public function getBase64ThumbnailAttribute()
    {   

        $content = $this["is_folder"] ? "img/folder.jpeg" :  "img/noimage.png" ;

        if( isset($this["src_thumbnailpath"]) ) {
            
            if(Storage::disk('public')->exists($this["src_thumbnailpath"])) {
                $thumbnail = Storage::disk('public')->get($this["src_thumbnailpath"]) ;
                $content = base64_encode($thumbnail) ;

            } 

        } else {

            //DBに保存中のbase64を表示する回避処理。Dropcolumnした段階で削除する
            if( isset($this["base64_thumbnail_willdrop"])) {
                $content = $this["base64_thumbnail_willdrop"] ;
            }
        }

        return $content ;

        // log::debug($base64) ;
    }



    //t_project_file内のリレーション（フォルダディレクトリ）
    public function Children()
    {
        return $this->hasMany(TProjectFile::class, 'parent_id', 'id')
                    ->with("Children")->orderBy("filepath");
    }
    
    /**
     * タグを取得する
     */
    public function MTags()
    {
        return $this->morphToMany('App\Models\MTag', 'm_tag_link')->orderBy("order_no");
    }

    
    public function TProject()
    {
        return $this->belongsTo('App\Models\TProject', 't_project_id');
    }
}
