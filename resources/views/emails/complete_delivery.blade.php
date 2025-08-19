
@if(!$isSsOrder)
{{$data->TProject->MCustomer["name"]}}
@endif
@if(!empty($data->TProject["customer_user_name"]))
{{$data->TProject["customer_user_name"]}} 様
@else
ご担当者様
@endif

いつもお世話になっております。
下記の件につきまして、発送が完了致しましたことをご連絡致します。

@if(!$isSsOrder)
物件名：{{$data->TProject["name"]}}
@endif

@isset($data->TProject["customer_order_no"])
ご注文番号：{{$data->TProject["customer_order_no"]}}
@endisset

商品：
@foreach($data->TProjectProducts as $product)
{{$product->name}} @if( count($product->TProjectDeliveries) == 1 )× {{$product->qty}}@endif 
@endforeach

お届け予定日：{{ date('Y/m/d', strtotime($data["arrival_at"])) }} {{$data["arrival_time"]}}

お届け先：
@isset($data["delivery_customer_zip"])〒{{$data["delivery_customer_zip"]}}@endisset
{{$data["delivery_customer_address"]}}
{{$data["delivery_customer_name"]}}@isset($data["delivery_customer_name"]) 様@endisset

@if($data->DeliveryMKv["g_05"] == "1")

送り主：
{{$data["delivery_owner_name"]}}@isset($data["delivery_owner_name"]) 様@endisset

@endif

@isset($data["num_of_boxes"])個口数：{{$data["num_of_boxes"]}}@endisset

送り状No.：{{$data["invoice_no"]}}
{{$url}}

{{$data["mail_postscript"]}}


本メールは、自動配信されておりますので、
お問い合わせは{{$data["m_branch"]["t_p_order_email"]}}までお願い致します。 

宜しくお願い申し上げます。

---------------------------------------------------
〒{{$data["m_branch"]["zip"]}}
{{$data["m_branch"]["address1"]}}{{$data["m_branch"]["address2"]}}
TEL:{{$data["m_branch"]["tel"]}}  FAX:{{$data["m_branch"]["fax"]}}
{{$data["m_branch"]["name"]}}
{{$data["mailed_m_user"]["full_name"]}}
---------------------------------------------------

