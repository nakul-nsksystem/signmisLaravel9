<div class="box-detail" id="detailCard">
	@if(isset($item->t_project_file_id))

	<div class="box-detail-thumbnail">
        <img src="data:image/jpeg;base64,{{$item->TProjectFile->base64_thumbnail}} " style="max-width:100% ;max-height:100% ">			
	</div>
	@else
	<div class="box-detail-thumbnail-empty">
	</div>
	@endif

	<div class="box-detail-card">
		<div class="box-detail-row">
			<div class="item-underline">
				<span class="product">{{$item->name}}</span>
				<span class="productQty">×<span class="emphasis"style="font-size:18px">{{$item->qty}}</span></span>
				@foreach($item->TProjectDeliveries as $delivery)
					<div class="item" style="text-align:right">
						<span class="{{$delivery->DeliveryMKv->g_09}}">{{$delivery->DeliveryMKv->kv_name}}</span>
						<span class="emphasis">{{date('Y/m/d', strtotime($delivery->delivery_at))}}</span>
						@if($item->is_partical_delivery)
							<span>×{{$delivery->t_project_delivery_product_link->qty}}</span>
						@endif
					</div>
				@endforeach
			</div>
		</div>
		<div class="box-detail-row">
			<div class="box-col-3">
				<div class="item">{{$item->MProductCategory->name}}</div>
				<div class="item">W{{$item->size_w}} × H{{$item->size_h}}</div>
				<div class="item">伸ばし 上:{{$item->size_extend_t}} 下:{{$item->size_extend_b}} 左:{{$item->size_extend_l}} 右:{{$item->size_extend_r}}</div>
				@isset($item->operator_m_user_id)
				<div class="item">制作担当：{{$item->OperatorMUser->full_name}}</div>
				@endisset
				<div class="item" style="padding-top: 2px;">
					@if(isset($item->specified_m_kv_id))
						<span class="badge" attribute="{{$item->SpecifiedMKv->g_01}}">{{$item->SpecifiedMKv->kv_name}}</span>
					@endif
					@if(isset($item->warranty_m_kv_id))
						<span class="badge" attribute="{{$item->WarrantyMKv->g_01}}">{{$item->WarrantyMKv->kv_name}}</span>
					@endif
					@if($item->is_needed_labels_for_fire_prevention)
						<span class="badge" attribute="badge-info">要防炎シール</span>
					@endif
				</div>
			</div>
			@foreach($item->TProjectProductProcesses as $process)
				@if($process->is_enabled)
				<div class="box-detail-row">
					<div class="box-col-1">{{$process->MProcessCategory->name}}</div>
					<div class="box-col-1">{{$process->MBranch->short_name}}</div>
					<div class="box-col-4">
						<div>{{$process->display_01}}</div>
						<div>{{$process->display_02}}</div>
						<div>{{$process->display_03}}</div>
						<div>{{$process->display_04}}</div>
						<div>{{$process->display_05}}</div>
						<div>{{$process->display_06}}</div>
						<div>{{$process->display_07}}</div>
						<div>{{$process->display_08}}</div>
						<div>{{$process->display_09}}</div>
						<div class="item" attribute="emphasis">{{$process->memo}}</div>
					</div>
				</div>
				@endif
			@endforeach
		</div>
		@php
			/**分割があるかどうか */
			$isSep = $item->num_of_sep_w >= 2 || $item->num_of_sep_h >= 2 ? true : false ; 

			/**分割図の縮小（横400,縦400までに指定） */
			$sepW = $item->size_w ;
			$sepH = $item->size_h ;

			if($sepW > 400) {
				$sepH = round($sepH * (400/$sepW));					
				$sepW = 400 ;					
			}
			if($sepH > 200){
				$sepW = round($sepW * (300/$sepH));
				$sepH = 200 ;
			}
		@endphp
		<div class="box-detail-row">
			<div class="box-col-6">
			@if($isSep )
				<div>分割</div>
				<div>重ね代:{{$item->sep_overlap_length}}</div>	
				<div class="box-detail-row">
					<div class="box-col-6">
						@if($item->num_of_sep_w >= 2)
						<table class="separate">
							<thead>
								<tr>
									<th>W分割位置</th>
								</tr>
							</thead>
							<tbody>
							@foreach($item->TProjectProductSeparates as $separate)
								@if($separate->is_w)
								<tr>
									<td>{{$separate->pos}}</td>
								</tr>
								@endif
							@endforeach
							</tbody>
						</table>
						@endif
					</div>
					<div class="box-col-6">
						@if($item->num_of_sep_h >= 2)
						<table class="separate">
							<thead>
								<tr>
									<th>H分割位置</th>
								</tr>
							</thead>
							<tbody>
							@foreach($item->TProjectProductSeparates as $separate)
								@if(!$separate->is_w)
								<tr>
									<td>{{$separate->pos}}</td>
								</tr>
								@endif
							@endforeach
							</tbody>
						</table>
						@endif
					</div>
				</div>
				
				<div class="box-detail-row">
					<div style="height:150px; margin:0 auto ">
						<img src="data:image/svg+xml;base64,{{$item->separate_base64_svg}}" style="width:max-content; height:max-content;">
					</div>
					<!-- <img src="data:image/svg+xml;base64,{{$item->separate_base64_svg}}" width="{{$sepW}}" height="{{$sepH}}"> -->
				</div>		
			@endif
			</div>

			<div class="box-col-6">
				@if(count($item->TProjectProductBoardlayouts))	
				<p>板割</p>
				<div class="box-detail-row">
					<table class="board">
						<thead>
							<tr>
								<th>規格寸法</th>
								<th>使用寸法</th>
								<th>枚数</th>
							</tr>
						</thead>
						<tbody>
						@foreach($item->TProjectProductBoardlayouts as $boardLayout)
							<tr>
								<td>
									@if(isset($boardLayout->MMaterialDetail))
									{{$boardLayout->MMaterialDetail->width}} x {{$boardLayout->MMaterialDetail->height}}
									@endif
								</td>
								<td>{{$boardLayout->w}} x {{$boardLayout->h}}</td>
								<td>{{$boardLayout->qty}}</td>
							</tr>
						@endforeach
						</tbody>

					</table>
				</div>					
				@endif
			</div>

		</div>
		
	</div>
	
</div>



