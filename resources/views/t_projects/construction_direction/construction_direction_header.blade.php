{{-- header start --}}
<section class="sheet">
	<div class="box-title">
		<div class="box-title-left">
			物件CD:{{$item->TProject->cd}}
		</div>
		<div class="box-title-label">
			<div class="item">現場指示書</div>
		</div>
		<div class="box-title-page">
			<div class="item">{{ $page }} / {{ $total_page }} page</div>
			<div class="item">{{date('Y/m/d H:i')}}</div>
		</div>
	</div>

{{-- header end --}}