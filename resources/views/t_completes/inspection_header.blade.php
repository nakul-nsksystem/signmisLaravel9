{{-- header start --}}
<section class="sheet">
	<div class="box-title">
		<div class="box-title-page">
		</div>
		<div class="box-title-label">
			<div class="item">検 収 書</div>
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
				<div style="width:40px">検収No</div>
				<div>：{{ $header->id }}</div>
			</div>
			<div class="item box-header-info-flex">
				<div style="width:40px">検収日</div>
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
			<div class="item" style="font-size:10px">　</div>
			<div class="item" style="font-size:10px">　</div>
		</div>
	</div>

	<div class="box-header-note">
		<div class="box-header-note-memo">
			<div class="item">貴社名印字部又は欄外に確認印をご捺印の上、ご返信ください。</div>
		</div>
		<div class="box-header-note-bank">
			<div class="item">尚、計上漏れや差異発生の場合はご連絡ください。</div>
		</div>
	</div>

	<div class="box-detail">
		<table class="invoice">
			<thead>
				<tr>
					<th>前回繰越額</th>
					<th>支払額</th>
					<th>繰越 - 支払</th>
					<th>仕入額</th>
					<th>消費税</div>
					<th style="color:red">仕入合計</th>
					<th>今回繰越額</th>
				</tr>
			</thead>

			<tbody>
				<tr>
					@if ($isFirst)
						<td>{{ number_format($header->carry_over) }}</td>
						<td>{{ number_format($header->payment_price) }}</td>
						<td>{{ number_format($header->carry_over - $header->payment_price) }}</td>
						<td>{{ number_format($header->total_price) }}</td>
						<td>{{ number_format($header->tax) }}</td>
						<td>{{ number_format($header->total_price + $header->tax) }}</td>
						<td>{{ number_format($header->grand_total) }}</td>
					@else
						<td></td>
						<td></td>
						<td></td>
						<td></td>
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
					<th style="width:345px">品名・支払内容</th>
					<th style="width:5px"></th>
					<th style="width:35px" >数量</th>
					<th style="width:30px" >単位</th>
					<th style="width:70px" >単価</th>
					<th style="width:70px" >金額</th>
				</tr>
			</thead>

			<tbody>
{{-- header end --}}
