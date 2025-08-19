{{-- header start --}}
<section class="sheet">
<div class="content">

	<!--ページ上部装飾画像-->
	@isset($isView)
	<img class="top_img"
		src="{{ asset('img/topline.png')}}">
	@else
	<img class="top_img"
		src="{{ public_path('img/topline.png')}}">
	@endisset
	<div class="box-row" style="margin-top: 4mm;">
		<div class="box-col-7" style="padding:0">
			<div class="project_name">{{$header->name}}</div>
			<div class="item">{{$header->MCustomer->short_name_or_name}}</div>
			<div class="item">客先担当：{{$header->customer_user_name}}</div>
		</div>
		<div class="box-col-5"  style="padding:0">
			<div class="box-title-label">
				<div class="item">Instruction Manual</div>
			</div>
			<div class="box-title-left">
				<div class="item">CD：{{$header->cd}}</div>
			</div>
		</div>
	</div>

	@if($isFirst)
		<div class="box-row" style="padding:0">
			<label></label>
			<div class="box-col-3 box-col-3-1" style="text-align: right">
			@isset($header->min_delivery)				
				<label>最短</label>
				<span class="emphasis2">{{date('Y/m/d', strtotime($header["min_delivery"]["delivery_at"]))}}</span>
			@endisset
			</div>
		</div>
		<div class="box-row box-row2" style="margin-top:1px">
			<div class="box-col-2">
				<label>納品形態</label>
			</div>
			<div class="box-col-2">
				<label>納期(発送日)</label>
			</div>
			<div class="box-col-4">
				<label>納品先名</label>
			</div>
			<div class="box-col-5">
				<label>備考</label>
			</div>
		</div>
		<div class="dlv_infos">
			@forelse($header->TProjectDeliveries as $delivery)
				@php
					$dayD = $week[date("w", strtotime($delivery->delivery_at))];
				@endphp

				<div class="box-row box-row3">

					<div class="box-col-2">
						<span class="{{$delivery->DeliveryMKv->g_09}}">{{$delivery->DeliveryMKv->kv_name}}</span>
					</div>
					<div class="box-col-2">
						<span style="display: block;{{getDayColor(date('w', strtotime($delivery->delivery_at)))}}">
							{{date('Y/m/d', strtotime($delivery->delivery_at))}}
							{{$dayD}}
						</span>
						<span>
							{{$delivery->delivery_time}}
						</span>							
					</div>
					<div class="box-col-4">
						<span style="display: block;">
							{{$delivery->delivery_customer_name}}
						</span>
					</div>
					<div class="box-col-5">
						<span style="display: block;">
							{{$delivery->memo}}
						</span>
					</div>
				</div>
				
				@empty
			@endforelse
		</div>
		
		<div class="box-row box-row2 box-row5">
			<div class="box-col-1">
				<label>受注日</label>
				<div class="item" style="display: block;"></div>
			</div>
			<div class="box-col-1">
				<label>受注拠点</label>
				<div class="item" style="display: block;"></div>
			</div>
			<div class="box-col-2">
				<label>客先注文No.</label>
				<div class="item" style="display: block;"></div>
			</div>
			<div class="box-col-2">
				<label>営業担当</label>
				<div class="item" style="display: block;"></div>
			</div>
			
			<div class="box-col-12">
				<label>備考</label>
				<div class="item" style="display: block;"></div>
			</div>
		</div>
		<div class="dlv_infos">
			<div class="box-row box-row3">
				<div class="box-col-1">
					<span style="display: block;">
					@isset($header->ordered_at)
						<div>{{date('Y/m/d', strtotime($header->ordered_at))}}</div>
					@endisset
					</span>
				</div>
				<div class="box-col-1">
					<span style="display: block;">{{$header->MBranch->short_name}}</span>
				</div>
				<div class="box-col-2">
					<span style="display: block;">{{$header->customer_order_no}}</span>
				</div>
				<div class="box-col-2">
					<span style="display: block;">{{$header->SalesMUser->full_name}}</span>
				</div>
				<div class="box-col-12">
					<span style="display: block;">{{$header->memo}}</span>
				</div>
			</div>
		</div>

	@endif
	
	<div class="header-border"></div>

		
{{-- header end --}}
