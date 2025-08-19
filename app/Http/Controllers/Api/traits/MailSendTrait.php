<?php

namespace App\Http\Controllers\Api\Traits;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;  
use Illuminate\Support\Facades\Cache;


/**
 * メール送信先設定など
 */
trait MailSendTrait
{
    /**
     * メール送信先を設定
     * smOptionの各keyレベルから
     * @param $to level3の時使用する宛先
     * @param $keyMKvId 該当機能のシステムオプションのkeyId
     * @return array (
     *      mail     => array(to,cc) ,
     *      warnings => array(警告メッセージ)
     *  )
     * 
     */
    protected function setSendTo ($to , $keyMKvId = null ) {
        
        $loginUserMail = Auth::user()->email ;
        
        //レベル　初期値1(LoginUserのアドレスに送信)
        $controlLevel = "1" ;

        //cacheからsmOptionを取得
        $smOptions = json_decode(json_encode(Cache::get('sm_options', null)), true)  ;

        if( isset($smOptions) && isset($keyMKvId) ) {
            //key idが一致するindexを検索
            $idx = array_search($keyMKvId ,array_column($smOptions, 'key_m_kv_id') ) ;
            if($idx) {
                //smOptionに設定された値を取得
                $controlLevel = $smOptions[$idx]["value"] ;
                // log::debug($controlLevel) ;
            }

        }


        //開発環境(APP_ENV = localhost) のときはドメイン @nsksystem.co.jpしかメール送信を許可しない
        if(config("app.env") != "production") {

            $nskUserKey = "@nsksystem.co.jp" ; 

            $isNskUser = $to ? substr($to , strlen($nskUserKey) * -1) == $nskUserKey : false ; 

            if(!$isNskUser) {

                log::debug("dev environment validate") ;
                return array(
                    "mails" => array(
                        'to' => $loginUserMail,
                        'cc' => $loginUserMail,
                    ) ,
                    "warnings" => array("開発環境では、宛先ドメイン[@nsksystem.co.jp]の場合のみメール送信可能です。 \n宛先を" . $loginUserMail . "に変更し送信しました" )
                ) ;
        
            }
        }

        // メール送信先設定
        // 0:envのTEST_MAIL_TOに固定で送信（開発デバッグ用）
        // 1:LoginUserのアドレスに送信（仮運用）
        // 2:本運用
        switch ($controlLevel) {
            case "0": 
                // log::debug("lev1") ;
                $sendTo = config('app.test_mail_to') ;
                break ;
            case "1": 
                // log::debug("lev2") ;
                $sendTo = $loginUserMail ;
                break ;
            case "2": 
                // log::debug("lev3") ;
                // 取引先マスタのemailがない場合は故意に無効なアドレスとして扱い、下記のバリエーションに引っ掛ける
                $sendTo = $to ?? "signmis@nsksystem.co.jpあいうえお"  ;
                break ;
            default: 
                $sendTo = "signmis@nsksystem.co.jpあいうえお" ;
        }
        // log::debug($sendTo) ;
        
        $mails = array(
            "to" => $sendTo ,
            "cc" => $loginUserMail ,
        ) ;
        //有効メールアドレスかを判定する(ドメインチェック含む)
        $validator = Validator::make($mails, [
            'to' => 'email:strict,dns,spoof',
            'cc' => 'required',
        ]);
        
        if ($validator->fails()) {
            // バリデートエラーが起きた場合警告メッセージをだしてログインユーザーのメールに送信する
            // log::debug("invalid email") ;
            $mails["to"] = $loginUserMail ;

            $warnings[] = "【" . $to . "】は無効なメールアドレスなため、メールを送信できませんでした \n宛先を" . $loginUserMail . "に変更し送信しました" ;
        }

        return array(
            "mails" => $mails ,
            "warnings" => $warnings ?? false 
        ) ;

    }


    /**各設定からメールアドレスを使用してよいか判断する */
    protected function systemMailValid ($to , $keyMKvId = null ) {
        $loginUserMail = Auth::user()->email ;
        
        //レベル　初期値1(LoginUserのアドレスに送信)
        $controlLevel = "1" ;

        //cacheからsmOptionを取得
        $smOptions = json_decode(json_encode(Cache::get('sm_options', null)), true)  ;

        if( isset($smOptions) && isset($keyMKvId) ) {
            //key idが一致するindexを検索
            $idx = array_search($keyMKvId ,array_column($smOptions, 'key_m_kv_id') ) ;
            if($idx) {
                //smOptionに設定された値を取得
                $controlLevel = $smOptions[$idx]["value"] ;
                // log::debug($controlLevel) ;
            }

        }


        //開発環境(APP_ENV = localhost) のときはドメイン @nsksystem.co.jpしかメール送信を許可しない
        if(config("app.env") != "production") {

            $nskUserKey = "@nsksystem.co.jp" ; 

            $isNskUser = $to ? substr($to , strlen($nskUserKey) * -1) == $nskUserKey : false ; 

            if(!$isNskUser) {

                log::debug("mail dev environment validate") ;
                return $loginUserMail ;
        
            }
        }

        // メール送信先設定
        // 0:envのTEST_MAIL_TOに固定で送信（開発デバッグ用）
        // 1:LoginUserのアドレスに送信（仮運用）
        // 2:本運用
        switch ($controlLevel) {
            case "0": 
                // log::debug("lev1") ;
                $sendTo = config('app.test_mail_to') ;
                break ;
            case "1": 
                // log::debug("lev2") ;
                $sendTo = $loginUserMail ;
                break ;
            case "2": 
                // log::debug("lev3") ;
                // 取引先マスタのemailがない場合は故意に無効なアドレスとして扱い、下記のバリエーションに引っ掛ける
                $sendTo = $to ?? "signmis@nsksystem.co.jpあいうえお"  ;
                break ;
            default: 
                $sendTo = "signmis@nsksystem.co.jpあいうえお" ;
        }
        // log::debug($sendTo) ;
        
        $mails = array(
            "to" => $sendTo ,
        ) ;
        //有効メールアドレスかを判定する(ドメインチェック含む)
        $validator = Validator::make($mails, [
            'to' => 'email:strict,dns,spoof',
        ]);
        
        if ($validator->fails()) {
            // バリデートエラーが起きた場合警告メッセージをだしてログインユーザーのメールに送信する
            // log::debug("invalid email") ;
            $mails["to"] = $loginUserMail ;

        }

        return $mails["to"] ;
    }
 
}
