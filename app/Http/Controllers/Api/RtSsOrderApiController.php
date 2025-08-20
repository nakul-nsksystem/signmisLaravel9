<?php

namespace App\Http\Controllers\Api;

use App\Models\RtSsOrder;
use Illuminate\Http\Request;
use Illuminate\Http\Response ; 
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;


use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Exceptions\DurstSsApiErrorException ; 

class RtSsOrderApiController extends BaseApiController
{


    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\RtSsOrder" ;
        $this->projectModel = "App\Models\TProject" ;

    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = $this->model::orderBy('id' ,'desc')->get();
        return $data;
        
    }

    //生成されているxmlの一覧を取得する
    public function getOrderList() 
    {
        try {

            //あまりにも接続が悪いため５回までリクエストして取得する
            for ($i = 1; $i <= 5; $i++) {
                if(!empty($files)) break ;
                if($i != 1 ) sleep(2);
                $files = Storage::disk('ssFtp')->files('/importexport/xmlorderexport');
            }
            
            if(!empty($files)) {
                //一番最初のindex.htmlを削除する    
                array_splice ( $files , array_search("index.html", $files) , 1 ) ;
                //すでに物件に登録されているSSオーダーを省く
                $tProject = DB::table('t_projects')
                    ->selectRaw(
                    '
                    t_projects.id,
                    CONCAT("importexport/xmlorderexport/list_order_",t_projects.ss_order_cd,".xml") AS ss_xml_name
                    ')
                    ->whereNotNull('ss_order_cd')
                    ->whereNull('ordered_t_project_id')
                    ->get()
                    ->toArray() ;
                                    
                $exists = array_column( $tProject, 'ss_xml_name') ;

                $filterdFiles = array_diff($files,$exists);
                
            } 
            else {
                throw new DurstSsApiErrorException();
            }

            return array_reverse($filterdFiles) ;
        } 
        catch (\PDOException $e) { 
            throw new DurstSsApiErrorException();
        }
        
    }

    //指定したオーダーのxmlからjson取得
    public function getJsonByXml($orderNo) {

        $xmlpath = '/importexport/xmlorderexport/list_order_' . $orderNo . '.xml';

        try {
            $xml = Storage::disk('ssFtp')->get($xmlpath);
            if(!empty($xml)) {

                $xmlObject = simplexml_load_string($xml);
                $xmlArray = json_decode( json_encode( $xmlObject ), true );
                return $xmlArray ;
            }
            else {
                throw new DurstSsApiErrorException();
            }
            
        } 
        catch (\PDOException $e) { 
            throw new DurstSsApiErrorException();
        }
        
    }

    public function restoreCache() {
        log::debug("restore") ;
        Cache::forget('ss') ;
    }

    public function getXmlByJson($id)
    {
        
        // A: DB から 指定された id のレコードを取得
        $row = $this->show($id) ; 
        
        // B : Aの結果からXMLファイル( SSからダウンロード ) のパスを取得
        // XMLファイルの読込
        $dir = storage_path()."/app/ss/order_xml/";
        $file = $dir . $row->filename;
        $of = fopen($file, "r");

        // C : Bで取得したXMLの内容を読み込んでJSONに変換
        $xml = simplexml_load_string(file_get_contents($file));
        /*
        // 注文番号
        $rxml["order_number"] = (string)$xml->order->order_number;
        // 顧客NO
        $rxml['kundennummer'] = (string)$xml->order->billing->address->kundennummer;
        // 注文日
        $rxml["order_time"] = (string)$xml->order->time->order_time;
        // 商品情報パック(foreach)
        $essense =array();
        $essense = $xml->order->order_items->order_item;
        //print_r($essense);
        
        // 製品の各種注文情報を格納
        foreach($essense as $oo => $value){
            $oid = $value->position_id;
            $rxml["count_item"] = (string)$oid;
    
            foreach($value as $ii => $kvalue){
                // 各商品ごとに分けて格納する
                $okey = "$oid-$ii";
                $rxml["$okey"] = (string)$kvalue;
            }
        }*/
        fclose($of);

        //return C の結果
        $rxml = json_encode($xml->order);
        $dxml = json_decode($rxml,true) ; 

        return $dxml ; 
        
    }

    public function getFilesByFtp()
    {
        ini_set('max_execution_time', 180);
        $lock;
        date_default_timezone_set('Asia/Tokyo');
        
        // テーブルから情報取得
        $items = \DB::table('rt_ss_orders')->get();
        $iii = 0;
        foreach($items as $asa){
            $iii += 1;
            $dtime[$asa->filename]=$asa->filetimestamp;
        }
        $request = array('DB'=>$iii);
        
        // FTPサーバーからの情報取得
        $files = Storage::disk('ftp')->files();
        $ftp = Storage::disk('ftp');
        $count = count($files);
        $request['ftp'] = $count;
        $xmllist = "";
        
        for($i=1; $i<10; $i++){
            $file = $files[$count-10+$i];
            $timestamp = $ftp->lastModified($file);
            $time = date("Y-m-d H:i:s", $timestamp);
            $now = date("Y-m-d H:i:s");
            //ファイル増判定
            if(isset($dtime[$file])){
                //タイムスタンプ比較
                if($time==$dtime[$file]){
                    // 何もしない
                    $request["file$i-name"] = $file;
                    $request["file$i-status"] = "更新無し";
                    $switch = 0;
                } else {
                    // DB更新してファイルを上書き保存
                    $switch = 1;
                    $request["file$i-name"] = $file;
                    $request["file$i-status"] = "更新あり";
                    $request["updatetime$i"] = $dtime[$file];
                }
            } else {
                // DB追加してファイルを保存
                $switch = 2;
                $request["file$i-name"] = $file;
                $request["file$i-status"] = "追加ファイル";
            }
        
            if($switch!=0){
                // ファイルをダウンロード
                $stream = Storage::disk('ftp')->get($file);
                $sp = storage_path()."/app/ss/order_xml/";
                $fp = fopen($sp.$file, 'w');
                fwrite($fp, $stream);
                fclose($fp);
                // DB更新処理
                if($switch==1){
                    //DB更新 save
                    DB::update("Update rt_ss_orders set filetimestamp=\"$time\" where filename=\"$file\"");
                    $request["db$i"] = "update完了";
                } elseif($switch==2){
                    //DBインサート
                    $sss=preg_replace("/list *_order_/u", "", $file);
                    $ss_id=preg_replace("/.xml/", "", $sss);
                    DB::insert("Insert INTO rt_ss_orders (filename,ss_order_id,filetimestamp,created_at,imported_at) Values (\"$file\",\"$ss_id\",\"$time\",\"$now\",\"$now\")");
                    $request["db$i"] = "insert完了";
                }
            }
        }
        $popo = json_encode($request);
        return $popo;
    }

    public function showOrderXml()
    {
        // XMLファイルの読込
        $dir = storage_path()."/app/ss/order_xml/";
        $file = $dir.$_GET['order'];
        $of = fopen($file, "r");
        $xml = simplexml_load_string(file_get_contents("$file"));
        //print_r($xml);
        // 注文番号
        $rxml["order_number"] = (string)$xml->order->order_number;
        // 顧客NO
        $rxml['kundennummer'] = (string)$xml->order->billing->address->kundennummer;
        // 注文日
        $rxml["order_time"] = (string)$xml->order->time->order_time;
        // 商品情報パック(foreach)
        $essense =array();
        $essense = $xml->order->order_items->order_item;
        //print_r($essense);
        
        // 製品の各種注文情報を格納
        foreach($essense as $oo => $value){
            $oid = $value->position_id;
            $rxml["count_item"] = (string)$oid;
    
            foreach($value as $ii => $kvalue){
                // 各商品ごとに分けて格納する
                $okey = "$oid-$ii";
                $rxml["$okey"] = (string)$kvalue;
            }
        }
        fclose($of);

        // 基本はJson形式 type=xmlと指定すると配列形式
        if(isset($_GET['type'])){
            if($_GET['type']=="xml"){
                return $rxml;
            }
        } else {
            return json_encode($rxml);
        }
   }
   
}
