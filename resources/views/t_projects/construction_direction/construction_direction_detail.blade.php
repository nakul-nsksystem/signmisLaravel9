<div class="box-detail">

	<table class="detail">
		<thead>
			<tr>
				<th style="background:#eee;">顧客名</th>
				<th style="background:#eee;">担当者名</th>
				<th style="background:#eee;">物件名</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{{$item->delivery_customer_name}}</td>
				<td>{{$item->delivery_customer_user}}</td>
				<td>{{$item->TProject->name}}</td>
			</tr>
			<tr class="tdHeader">
				<td>連絡先</td>
				<td>現地住所</td>
				<td></td>
			</tr>
			<tr>
				<td>{{$item->delivery_customer_tel}}</td>
				<td colspan="2">{{$item->delivery_customer_address}}</td>
			</tr>
			<tr class="tdHeader">
				<td>工事日</td>
				<td>開始予定時間</td>
				<td>終了予定時間</td>
			</tr>
			<tr>
				<td>{{date('Y/m/d', strtotime($item->delivery_at))}}</td>
				<td>{{date_format($item->construction_start_time,'AH:i')}}</td>
				<td>{{date_format($item->construction_end_time,'AH:i')}}</td>
			</tr>
			<tr class="tdHeader">
				<td>人員</td>
				<td>外注</td>
				<td></td>
			</tr>
			<tr>
				<td>
					@foreach($item->TProjectConstructionUsers as $user)
						@if(isset($user->m_user_id))
						<div class="item">
							{{$user->MUser->full_name}}
						</div>
						@endif
					@endforeach
				</td>
				<td>
					@foreach($item->TProjectConstructionUsers as $outsource)
						@if(isset($outsource->out_source_m_customer_id))
						<div class="item">
							{{$outsource->OutSourceMCustomer->short_name_or_name}} {{$outsource->num_of_out_source_people}}名 {{$outsource->out_source_person_name}}
						</div>
						@endif
					@endforeach
				</td>
				<td>
				</td>
			</tr>
		
		</tbody>
	</table>	
</div>
