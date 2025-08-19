{{-- header start --}}
<section class="sheet">
	<div class="box-title">
		<div class="box-title-page">
		</div>
		<div class="box-title-label">
			<div class="item">御見積書</div>
		</div>
		<div class="box-title-page">
			<div class="item">{{ $page }} / {{ $total_page }} page</div>
		</div>
	</div>

	<div class="box-header">
		<div class="box-header-customer">		
			<div class="item-underline" attribute="fixed-width">
				{{$header->MCustomer->name}}&emsp;
				@if($header->customer_user_name)
					{{$header->customer_user_name}}様
				@else
					御中
				@endif
			</div>
			<div class="item-underline" attribute="fixed-width">物件名：{{$header->name}}</div>
			<div class="item-underline" attribute="fixed-width" style="font-size:12px">御社発注番号：{{$header->customer_order_no}}</div>

		</div>

		<div class="box-header-note">
			<div class="box-header-note-memo">
				<div class="item">毎々格別のお引き立てを賜り厚くお礼申し上げます。</div>
				<div class="item">ご依頼いただきました件、下記の通りお見積り申し上げます。</div>
				<div class="item">何卒ご用命くださいますようお願い申し上げます。</div>
			</div>
		</div>
		<div class="box-header-condition">		
			<div class="item-underline" attribute="fixed-width">納&emsp;&emsp;期&emsp;&emsp;{{$header->display_estimate_delivery_date}}</div>
			<div class="item-underline" attribute="fixed-width">受渡場所&emsp;&emsp;{{$header->display_estimate_delivery_address}}</div>
			<div class="item-underline" attribute="fixed-width">取引方法&emsp;&emsp;{{$header->display_estimate_condition}}</div>
			<div class="item-underline" attribute="fixed-width">有効期限&emsp;&emsp;{{$header->display_estimate_term}}</div>
		</div>
		<div class="box-header-company">

			<div class="" >({{$header->MCustomer->closing_date}})</div>
			<div class="">見積No.：{{ $header->estimate_formatted_no }}</div>
			<div class="">見積日：{{ date('Y/m/d', strtotime($header->estimate_date)) }}</div>

			<img class="logo" src="{{ $header['reportLogo'] }}" style="{{PositioningLogo($header->MBranch->name)}}">
			<img class="sign" src="{{ $header['companySeal'] }}" width="60" height="60">

			<div class="">{{$header->MBranch->name}}</div>
			<div class="">〒{{ $header->MBranch->zip }}</div>
			<div class="">{{$header->MBranch->address1}}{{$header->MBranch->address2}}</div>
			<div class="">TEL：{{$header->MBranch->tel}}</div>
			<div class="">FAX：{{$header->MBranch->fax}}</div>
			<div class="item">e-mail：{{$header->MBranch->t_p_order_email}}</div>
			<table class="estimate-sign-table">
				<tbody>
					<tr>
						<td></td>
						<td></td>
						<td>{{$header->SalesMUser->last_name}}</td>
					</tr>
				</tbody>
			</table>
			<div class="item">MICHELANGELO&nbsp;CO.,&nbsp;LTD.</div>

		</div>
		
	</div>



	<div class="box-detail">

		<table class="detail">
			<thead>
				<tr style="">
					<th style="width:53%;font-size:16px; padding:8px">
						<span>御見積金額（税込）</span>
						<span style="float:right">&yen;&nbsp;{{number_format($header["totalPrice"] + $header["tax"])}}</span>
					</th>
					<th style="width:10%">10.0%</th>
					<th style="width:7%"></th>
					<th style="width:15%">消費税</th>
					<th style="width:15%">&yen;&nbsp;{{number_format($header["tax"])}}</th>
				</tr>
			</thead>

			<tbody>
				<tr class="second-header">
					<td>摘要</td>
					<td>数量</td>
					<td>単位</td>
					<td>単価</td>
					<td>金額</td>
				</tr>

{{-- header end --}}