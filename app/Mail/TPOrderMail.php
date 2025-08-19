<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\Traits\LocalFileStorageTrait;



use PDF;



class TPOrderMail extends Mailable
{
    use Queueable, SerializesModels;
    use LocalFileStorageTrait ;


    protected $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $rowArray  = json_decode(json_encode($this->data), true) ;


        $date = date("Ymd-His");

        // log::debug($this->data) ;

        //物件に紐づいた発注かの判定
        $isTProject = false ;

        foreach($rowArray["t_p_order_details"] as $PODetails){
            if($PODetails["t_project_id"]){
                $isTProject = true ;
            }
        }

        $details = $rowArray["t_p_order_details"];
        

        $header = $rowArray ;

        // log::debug($rowArray) ;

        //発注書ごとに物件は1件なので共通物件を設定
        if($isTProject) {
            $header["common_t_project"] = $details[0]["t_project"] ;
        }
    
    
        $reportLogo = "data:image/jpeg;base64," . $this->getFileByCustomerResource(config('app.report_logo'),true) ;


        // Laravel-SnappyPDFを利用
        $po = \SnappyPDF::loadView('t_p_order.po', compact('header','details','isTProject',"reportLogo")) ;

        // log::debug($key) ;

        // $pdf = \SnappyPDF::loadView('t_p_order.order_sheet',['data'=> $this->data ,'is_t_project'=> $key]);

        //新規発注、変更、判定
        if(!$rowArray["isNew"])
        {
            $subject = '発注内容変更のご依頼 ' . $rowArray["m_branch"]["name"] ;
            return $this->subject($subject)
                        ->text('emails.ordermail_update')
                        ->with([
                            'data'=> $rowArray ,
                            ])
                        ->attachData($po->output(), $rowArray['id'] . '-' . $date .'po.pdf');
        }
        else{
            $subject = '発注のご依頼 ' . $rowArray["m_branch"]["name"] ;
            return $this->subject($subject)
                        ->text('emails.ordermail')
                        ->with([
                            'data'=> $rowArray ,
                            ])
                        ->attachData($po->output(), $rowArray['id'] . '-' . $date .'po.pdf');

        }
    }
}
