
<div class="box-detail">
	<table class="{{$isInternal ? '4internal' : '4customer'}}">
		<colgroup>
			<!-- tableを10分割にしてcolspanを使ってレイアウト -->
			@for ($i = 1; $i <= 10; $i++)
			<col style="width: 10%">
			@endfor
		</colgroup>	
		<tbody>
			<tr>
				<td class="header toptd">お客様名</td>
				<td colspan="6" class="toptd">{{$item->TProject->MCustomer->name}}</td>
				<td colspan="3" class="toptd bltd">
					@if($isInternal)
					<div class="thumb-wrap">
						@isset($item->TProject->ordered_at)<img class="thumb" src="data:image/svg+xml;base64,{{$item->qr}}" width="100" height="100">@endisset
					</div>
					@elseif(isset($item->t_project_file_id))
					<div class="thumb-wrap">
						<img class="thumb" src="data:image/jpeg;base64,{{$item->TProjectFile->base64_thumbnail}}">	
					</div>
					@endif
				</td>
			</tr>
			<tr>
				<td class="header">物件名</td>
				<td colspan="6">{{$item->TProject->name}}</td>
			</tr>
			<tr>
				<td class="header">商品名</td>
				<td colspan="6">{{$item->name}} {{$item->size_w}}×{{$item->size_h}}</td>
			</tr>
			<tr>
				<td class="header">数量</td>
				<td colspan="3" style="text-align:right">
					@if(!$item->isPD)
					<span>{{$item->qty}}</span>
					@endif 
				</td>
				<td class="header">個口</td>
				<td colspan="2" style="text-align:center">/</td>
			</tr>
			@if($isInternal)
				@php
					$processes = explode(',',$item->display_03)
				@endphp
			<tr>
				<td class="header">材料</td>
				<td colspan="4">
					<div class="material-name">
					@isset($item->main_material)
						@if( is_array($item->main_material) ) 
						<div class="item material-name">主材料<br>{{ empty($item->main_material["display_name"]) ? $item->main_material["name"] : $item->main_material["display_name"]}}</div>
						@else
						<div class="item material-name">主材料<br>{{ empty($item->main_material->display_name) ? $item->main_material->name : $item->main_material->display_name}}</div>
						@endif
					@endisset
					@isset($item->lami_material)
						@if( is_array($item->lami_material) ) 
						<div class="item material-name">ラミ<br>{{ empty($item->lami_material["display_name"]) ? $item->lami_material["name"] : $item->lami_material["display_name"]}}</div>
						@else
						<div class="item material-name">ラミ<br>{{ empty($item->lami_material->display_name) ? $item->lami_material->name : $item->lami_material->display_name}}</div>
						@endif
					@endisset
					</div>
				</td>
				<td style="text-align:center;">
					<div class="item-underline">担当</div>
					@isset($item->operator_m_user_id)
					<div class="item">{{$item->OperatorMUser->last_name}}</div>
					@endisset
				</td>
				<td colspan="4" class="bltd">
					@foreach ($processes as $process)
					<li>{{ $process }}</li>
					@endforeach
				</td>
			</tr>
			@endif
			<tr>
				<td class="header">納期</td>
				<td colspan="9" class="bltd" style="height:48px;">
					<div class="item">
						<span>{{$item->delivery_m_kv_name}}&emsp;</span>
						<span class="emphas">{{date('Y/m/d', strtotime($item->delivery_at))}}&emsp;</span>
						<span>{{$item->delivery_time}}</span>
					</div>
				</td>
			</tr>
			<tr>
				<td class="header">着日</td>
				<td colspan="9" class="bltd">
					<div class="item">
						@isset($item->arrival_at)
						<span>{{date('Y/m/d', strtotime($item->arrival_at))}}&emsp;</span>
						<span>{{$item->arrival_time}}</span>
						@endisset
					</div>
				</td>
			</tr>
			@if(!$isInternal)
			<tr>
				<td class="header">備考</td>
				<td colspan="9" class="bltd"></td>
			</tr>
			@endif
		</tbody>
	</table>
	@if(!$isInternal)
	<div class="branch-wrap" style="margin-top:0.5rem">
		<img class="logo" src="{{ $reportLogo }}">
		<div class='branch'>
			<div style="font-size:12px; ">{{$item->MBranch->name}}</div>
			<div style="font-size:10px;">℡:{{$item->MBranch->tel}}</div>
		</div>
	</div>
	@endif
</div>

