@php
	$decimalParams = ReportUtil::formatDecimal($item->price, 2, true) ;
@endphp
<tr>
    <td>{{ $start_position + $loop->iteration }}</td>
    <td class="cell">{{ $item->product_name }}</td>
    <td />
    <td>{{ ReportUtil::numberFormatZeroBlank($item->qty) }}</td>
    <td>{{ optional($item->UnitMKv)->kv_name }}</td>
    <td>
		<div>{{ $decimalParams["formatted_num"] }}<span style="visibility:hidden">{{ $decimalParams["postfix"] }}</span></div>
    </td>
    <td>{{ ReportUtil::numberFormatZeroBlank($item->total_price) }}</td>
    <td class="cell">{{ $item->slip_memo }}</td>
</tr>