@php
	$decimalParams = ReportUtil::formatDecimal($item->sell_price,2) ;
@endphp
<tr>
	<td>
		<div class="cell">
			{{$item->display_content}}
		</div>
	</td>
	<td>
		{{$item->qty}}
	</td>
	<td>
		@isset($item->unit_m_kv_id)
			{{$item->UnitMKv->kv_name}}
		@endisset
	</td>
	<td>
		<div>{{$decimalParams["formatted_num"]}}<span style="visibility:hidden">{{$decimalParams["postfix"]}}</span></div>
	</td>
	<td>
		{{number_format($item->total_sell_price)}}
	</td>
</tr>
@forelse($item->TProjectProductEstimateDetails as $estimateRow)
<tr>
	<td class="cell">
		<div class="cell">
			&emsp;&emsp;{{$estimateRow->content}}
		</div>
	</td>
	<td></td>
	<td></td>
	<td></td>
	<td></td>
</tr>
@empty
@endforelse

