{{-- header start --}}
<section class="sheet">
	<div class="box-title">
		<div class="box-title-left">
			<div class="item">物件CD:{{$header->cd}}</div>
		</div>
		<div class="box-title-label">
			<div class="item">作業指示書</div>
		</div>
		<div class="box-title-page">
			<div class="item">{{date('Y/m/d H:i')}}</div>
		</div>
	</div>
	@if($isFirst)
		<div class="box-row">
			<div class="box-col-2">
				<label>受注拠点</label>
				<div class="item">{{$header->MBranch->short_name}}</div>
			</div>
			<div class="box-col-4">
				<label>クライアント名</label>
				<div class="item">{{$header->MCustomer->short_name_or_name}}</div>
			</div>
			<div class="box-col-1">
				<label>客先担当</label>
				<div class="item">{{$header->customer_user_name}}</div>
			</div>
			<div class="box-col-2">
				<label>営業担当</label>
				<div class="item">{{$header->SalesMUser->full_name}}</div>
			</div>
			<div class="box-col-3">
				<label>物件名</label>
				<div class="item">{{$header->name}}</div>
			</div>
		</div>
		<div class="box-row">
			<div class="box-col-12">
				<div class="box-row">
					<label>納品情報</label>
					@isset($header->min_delivery)

					<div class="box-col-3">
						<label>最短納期</label>
						<span class="emphasis2">{{date('Y/m/d', strtotime($header["min_delivery"]["delivery_at"]))}}</span>
					</div>
					@endisset

				</div>
				
				@forelse($header->TProjectDeliveries as $delivery)
					@php

						$dayD = $week[date("w", strtotime($delivery->delivery_at))];
						$dayA = $week[date("w", strtotime($delivery->arrival_at))];

					@endphp

					<div class="box-row" style="padding:0px;">
						<div class="box-col-2"><span class="{{$delivery->DeliveryMKv->g_09}}">{{$delivery->DeliveryMKv->kv_name}}</span></div>
						<div class="box-col-2">
							<label>納期(発送日)</label>
							<span style="{{getDayColor(date('w', strtotime($delivery->delivery_at)))}}">
								{{date('Y/m/d', strtotime($delivery->delivery_at))}}
								{{$dayD}}
							</span>
							<span>
								{{$delivery->delivery_time}}
							</span>							
						</div>
						<div class="box-col-3">
							<label>納品先名</label>
							{{$delivery->delivery_customer_name}}
						</div>
						<div class="box-col-6">
							<label>納品備考</label>
							{{$delivery->memo}}
						</div>
					</div>
					
					@empty
				@endforelse
			</div>
		</div>
		<div class="box-row">	
			<div class="box-col-2">
				<label>受注日</label>
				@isset($header->ordered_at)
					<div class="item">{{date('Y/m/d', strtotime($header->ordered_at))}}</div>
				@endisset
			</div>
			<div class="box-col-2">
				<label>客先注文No.</label>
				<div class="item">{{$header->customer_order_no}}</div>
			</div>
			<div class="box-col-12">
				<label>備考</label>
				<div class="item">{{$header->memo}}</div>
			</div>
		</div>
	@endif

		
{{-- header end --}}