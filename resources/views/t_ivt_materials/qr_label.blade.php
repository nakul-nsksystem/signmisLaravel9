@extends('layouts.app_report_a4')
@section('title', 'QRラベル')
@php
	$lines_per_page  = 24;                                                           /* 1ページ表示行 */
	$page            = 0 ;                                                           /* 現在ページ */
	$total_page      = ReportUtil::totalPage(count($data), $lines_per_page) ;     /* 総ページ数 */
@endphp

@section('content')
	<section class="sheet">
	<div class="container">
	@forelse ($data as $item)
		{{-- 改ページ判定 --}}
		@if (ReportUtil::isBreakPage($loop->iteration, $lines_per_page))
		</div>
		</section>
		<section class="sheet">
		<div class="container">
		@endif
		<div class="box">
			<div class="qr-area">
				@isset($item["qr"])
				<img src="data:image/svg+xml;base64,{{$item['qr']}}" class="qr">
				@endisset
			</div>
			<div class="text-area">
				<div>{{$item["label_no"]}}</div>
				<div>
					@if(!empty($item["t_p_order_detail_id"]))
						{{$item["t_p_order_id"]}}-{{$item["t_p_order_detail_id"]}}
					@endif
				</div>
				<div>{{$item["material_cd"]}}</div>
				<div>{{$item["name"]}}</div>
			</div>
		</div>
		@if($loop->iteration % 2 == 1)
		<div class="cell-margin">　</div>
		@endif
	@empty
	</div>
	</section>
	@endforelse
@endsection

@section('style-scoped')
<style>
.container {
	display: table;
	width : {{ $setting["label_w"] * $setting["label_col"] + $setting["label_offset_w"]}}mm ;
}
.sheet {
	@isset($isView)
		/* プレビュー用 */
		padding: {{$setting["sheet_offset_h"]}}mm {{$setting["sheet_offset_w"]}}mm {{$setting["sheet_offset_h"]}}mm {{$setting["sheet_offset_w"]}}mm ;
	@endisset
}
.box {
	display: table;
	float: left;
	width : {{ $setting["label_w"]}}mm ;
	height : {{ $setting["label_h"]}}mm ;
	font-size: 9px ;
	/* border: 1px solid; */
}

.qr-area {
	float: left;
	width  : 30% ;
	/* height : {{ $setting["label_h"]}}mm ; */
	/* background-color: #F0FFFF; */
}
.qr {
	width : {{ $setting["label_h"] -3}}mm ;
	height : {{ $setting["label_h"] -3 }}mm ;
}
.text-area {
	float: left;
	width  : 70% ;
	/* height : {{ $setting["label_h"]}}mm ; */
	/* background-color: #F8F8FF; */
	
}

.cell-margin {
	float: left;
	display: table-cell;
	width : {{ $setting["label_offset_w"] }}mm ;
}

</style>
@endsection