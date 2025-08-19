<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TProjectController extends Controller
{
    //
    public function edit($id = 0 )
    {
        //return "AAA" ; 
        return view("t_projects.edit" );

    }

    public function upload()
    {
        // $_POST[]

        // File Save

        // Saveしたファイルを MailのLibraryで読み込む

        // 値をセット
        $rtn = array(
            "title" => "TEST" ,
            "to" => "nskml@nsksystem.co.jp" ,
        ) ; 

        // 出力
        return json_encode($rtn) ; 
    }
}
