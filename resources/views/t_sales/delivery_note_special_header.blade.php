{{-- header start --}}
@if	($isFirst)
<section class="sheet">
@endif
	<div>
		<div class="box-title">
			<div class="box-title-page">
			</div>
			<div class="box-title-label">
				<div class="item">{{ $title }}</div>
			</div>
			<div class="box-title-page">
				<div class="item">{{ $page }} / {{ $total_page }} page</div>
			</div>
		</div>
	</div>

	<div class="box-header">
		<div class="box-header-customer">
			<div class="item" attribute="fixed-width">〒{{ $header->MCustomer->zip }}</div>
			<div class="item" attribute="fixed-width">{{ $header->MCustomer->address1 }}　</div>
			<div class="item" attribute="fixed-width">{{ $header->MCustomer->address2 }}　</div>
			<div class="item" attribute="fixed-width">{{ $header->MCustomer->name }} {{ $header->MCustomer->TitleOfHonorMKv->kv_name }}　({{$header->MCustomer->closing_date}})</div>
			<div class="item" attribute="fixed-width">
				@isset($header->MCustomer->tel)
					TEL：{{ $header->MCustomer->tel }}　
				@endisset
				@isset($header->MCustomer->fax)
					FAX：{{ $header->MCustomer->fax }}
				@endisset
			</div>
		</div>

		<div class="box-header-info">
			<div class="item" style="visibility: hidden"><br></div>
			<div class="item" style="visibility: hidden"><br></div>
			<div class="item">伝票№：{{ $header->id }}</div>
			<div class="item">納品日：{{ date('Y/m/d', strtotime($header->shipped_at)) }}</div>
			<div class="item">担当者：{{ $header->MUser->full_name }}</div>
		</div>

		<div class="box-header-company">
			<img class="logo" src="{{ $reportLogo }}" width="40" height="40">
			<div class="item">{{ $header->MBranch->name }}</div>
			<div class="item">〒{{ $header->MBranch->zip }}</div>
			<div class="item">{{ $header->MBranch->address1 }}{{ $header->MBranch->address2 }}</div>
			<div class="item">TEL：{{ $header->MBranch->tel }}</div>
			<div class="item">FAX：{{ $header->MBranch->fax }}</div>
		</div>
	</div>

	<div class="box-header-note">
		<div class="box-header-note-01">毎度ありがとうございます。下記の通り納品いたしましたのでご査収下さい。</div>
		<div class="box-header-note-02">※明細金額：税抜きです。</div>
	</div>

	<div class="box-detail">
		<table class="detail">
			<thead>
				<tr>
					<th style="width:20px" ></th>
					<th style="width:215px">物件名・品名</th>
					<th style="width:60px" >注文No.</th>
					<th style="width:55px" >数量</th>
					<th style="width:30px" >単位</th>
					<th style="width:78px" >単価</th>
					<th style="width:65px" >金額</th>
					<th style="width:100px">備考</th>
				</tr>
			</thead>

			<tbody>
{{-- header end --}}