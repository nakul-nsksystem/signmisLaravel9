{{-- header start --}}
<section class="sheet">
	<div class="box-title">
		<div class="box-title-page">
		</div>
		<div class="box-title-label">
			<div class="item">請 求 書</div>
		</div>
		<div class="box-title-page">
			<div class="item">{{ $page }} / {{ $total_page }} page</div>
		</div>
	</div>

	<div class="box-header">
		<div class="box-header-customer">
			<div class="item" attribute="fixed-width">〒{{ $header->MCustomer->zip }}</div>
			<div class="item" attribute="fixed-width">{{ $header->MCustomer->address1 }}</div>
			<div class="item" attribute="fixed-width">{{ $header->MCustomer->address2 }}</div>
			<div class="item" attribute="fixed-width">{{ $header->MCustomer->name }} {{ $header->MCustomer->TitleOfHonorMKv->kv_name }}</div>
			<div class="item" attribute="fixed-width">{{ $header->MCustomer->contact_person }}
				@isset($header->MCustomer->contact_person)
					様
				@endisset
			</div>
			<div class="item" attribute="fixed-width">TEL：{{ $header->MCustomer->tel }}　FAX：{{ $header->MCustomer->fax }}</div>
		</div>

		<div class="box-header-info">
			<div class="item box-header-info-flex" style="visibility: hidden"><br></div>
			<div class="item box-header-info-flex">
				<div style="width:40px">請求No</div>
				<div>：{{ $header->id }}</div>
			</div>
			<div class="item box-header-info-flex">
				<div style="width:40px">請求日</div>
				<div>：{{ date('Y/m/d', strtotime($header->complete_day)) }}</div>
			</div>
			<div class="item box-header-info-flex">
				<div style="width:40px">担当者</div>
				<div>：{{ $header->MCustomer->SalesMUser->full_name }}</div>
			</div>
			<div class="item box-header-info-flex" style="visibility: hidden"><br></div>
		</div>

		<div class="box-header-company">
			<img class="company_seal" src="{{ $companySeal }}" width="60" height="60">
			<img class="company_logo" src="{{ $companyLogo }}" width="30" height="30">
			<div class="item">{{ $header->MBranch->name }}</div>
			<div class="item" style="font-size:10px">〒{{ $header->MBranch->zip }}</div>
			<div class="item" style="font-size:10px">{{ $header->MBranch->address1 }}{{ $header->MBranch->address2 }}</div>
			<div class="item" style="font-size:10px">TEL：{{ $header->MBranch->tel }}　FAX：{{ $header->MBranch->fax }}</div>
			<div class="item" style="font-size:10px">登録番号：{{ $header->MBranch->invoice_no }}</div>
			<div class="item" style="font-size:10px">{{ $header->MBranch->account_info }}</div>
		</div>
	</div>

	<div class="box-header-note">
		<div class="box-header-note-memo">
			<div class="item">毎度ありがとうございます。下記の通り御請求申し上げます。</div>
		</div>
		<div class="box-header-note-bank">
			<div class="item" style="color:red">{{ $header->MBranch->invoice_memo }}</div>
		</div>
	</div>

	<div class="box-detail">
		<table style="width:303px" class="invoice_this_time">
			<thead>
				<tr>
					<th>御買上額</th>
					<th>消費税 10%</th>
					<th style="color:red">御買上 合計</th>
				</tr>
			</thead>

			<tbody>
				<tr>
					@if ($isFirst)
						<td>{{ number_format($header->total_price) }}</td>
						<td>{{ number_format($header->tax_normal) }}</td>
						<td>{{ number_format($header->total_price + $header->tax) }}</td>
					@else
						<td></td>
						<td></td>
						<td></td>
					@endif
				</tr>
			</tbody>
		</table>

		<table class="detail">
			<thead>
				<tr>
					<th style="width:65px" >取引日</th>
					<th style="width:290px">物件名・品名</th>
					<th style="width:60px" >注文No.</th>
					<th style="width:35px" >数量</th>
					<th style="width:30px" >単位</th>
					<th style="width:70px" >単価</th>
					<th style="width:70px" >金額</th>
				</tr>
			</thead>

			<tbody>
{{-- header end --}}
