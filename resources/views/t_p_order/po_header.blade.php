{{-- header start --}}
<section class="sheet">
	<div class="box-title">
		<div class="box-title-page">
		</div>
		<div class="box-title-label">
			<div class="item">発注書</div>
		</div>
		<div class="box-title-page">
			<div class="item">{{ $page }} / {{ $total_page }} page</div>
		</div>
	</div>

	<div class="box-header">
		<div class="box-header-customer">		
			<div class="item" attribute="fixed-width-customer">{{$header["supplier_m_customer"]["name"]}}御中</div>
		</div>
		<div class="box-header-note">
			<div class="box-header-note-memo">
				<div class="item">いつもお世話になっております。</div>
				<div class="item">下記の通り、御注⽂申し上げます。</div>
				<div class="item" style="color:red;">発注No.・明細No.@if($isTProject)・物件コード@endifを</div>
				<div class="item" style="color:red;">納品書に記載して頂きますよう宜しくお願い申し上げます。</div>
				@if($isTProject)
				<div class="item">　</div>
				<div class="item" style="text-decoration: underline;">
					物件コード：{{$header["common_t_project"]["cd"] }}　@if($header["common_t_project"]["po_project_name"])物件名：{{$header["common_t_project"]["po_project_name"] }}@else物件名：{{$header["common_t_project"]["name"] }}@endif
				</div>
				@endif
			</div>			
		</div>
		<div class="box-header-company">
			<div class="item">発注No.：{{ $header["id"] }}</div>
			<div class="item" style="margin:0 0 10px;">発注日：{{ date('Y/m/d', strtotime($header["order_date"])) }}</div>
			<img class="logo" src="{{ $reportLogo }}" width="40" height="40">
			<div class="item">{{$header["m_branch"]["name"]}}</div>
			<div class="item">〒{{$header["m_branch"]["zip"]}}</div>
			<div class="item">{{$header["m_branch"]["address1"]}}{{$header["m_branch"]["address2"]}}</div>
			<div class="item">TEL：{{$header["m_branch"]["tel"]}}</div>
			<div class="item">FAX：{{$header["m_branch"]["fax"]}}</div>
			<div class="item">e-mail：{{$header["m_branch"]["t_p_order_email"]}}</div>
			<div class="item">担当者：{{$header["m_user"]["full_name"]}}</div>
		</div>
		
	</div>

	<div class="box-detail">
		<table class="detail">
			<thead>
				<tr>
					<th style="width:7%" class="cell">明細No.</th>
					<th style="width:40%">名称</th>
					<th style="width:5%">数量</th>
					<th style="width:5%">単位</th>
					<th style="width:10%">単価</th>
					<th style="width:10%">金額</th>
					<th style="width:23%">備考</th>
				</tr>
			</thead>

			<tbody>
{{-- header end --}}