<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

use PDF;



class TProjectDeliveryMail extends Mailable
{
    use Queueable, SerializesModels;

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
        // $isNotExistNo = is_null($this->data["invoice_no"]) ;
        $trackingUrl = "" ;
        if( !is_null($this->data["invoice_no"]) && isset($this->data->DeliveryMKv["g_10"])) {
            $trackingUrl = $this->data->DeliveryMKv["g_10"] ;
            if( $this->data->DeliveryMKv["g_07"] == "1" ) $trackingUrl .= $this->data["invoice_no"] ;
        }
        $isSsOrder = isset($this->data->TProject['ss_order_cd']) ;

        if($isSsOrder) {
            $ssFrom = config('app.ss_mail_from_address') ;
            $ssFromName = config('app.ss_mail_from_name') ;
            return $this->from($ssFrom, $ssFromName)
                    ->subject('発送完了メール プリントスマートショップ')
                    ->text('emails.complete_delivery')
                    ->with([
                        'data'=> $this->data ,
                        "url"=> $trackingUrl,
                        "isSsOrder" => $isSsOrder
                    ]) ;

        } else {
            return $this->subject('発送完了メール 株式会社ミケランジェロ')
                ->text('emails.complete_delivery')
                ->with([
                    'data'=> $this->data ,
                    "url"=> $trackingUrl ,
                    "isSsOrder" => $isSsOrder

                ]) ;
        
        }
        

    
    }
}
