<tr>
	<td>{{$item["id"]}}</td>
	<td>{{ $item["po_material_name"] }}</td>
	<!-- <td>{{ number_format($item["qty"],1) }}</td> -->
	<td>{{ $item["qty"] }}</td>
	<td>{{ $item["unit_m_kv"]["kv_name"] }}</td>
	<td>
		@if($item["is_display_price"])
		{{ number_format($item["price"]) }}
		@endif
	</td>
	<td>
		@if($item["is_display_price"])
		{{ number_format($item["total_price"]) }}
		@endif
	</td>
	<td class="cell">
		@isset ($item["due_date"])
		<div>希望納期:{{ date('Y/m/d', strtotime($item["due_date"])) }}</div>  
		@endisset
		@isset ($item["shipping_address"])
		<div>納品場所:{{$item["shipping_address"]}}</div>
		@endisset
		<div class="nowrap">{{$item["slip_memo"]}}</div>
	</td>
</tr>