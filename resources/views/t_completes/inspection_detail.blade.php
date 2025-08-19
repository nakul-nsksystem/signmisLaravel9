@php
	$decimalParams = ReportUtil::formatDecimal($item->price, 2) ;
@endphp
<tr>
	<td>{{ ReportUtil::formatDate($item->accounting_date) }}</td>
	<td class="cell">{{ $item->product_name }} {{ $item->h_slip_memo }}</td>
	<td class="cell"></td>
	<td>{{ ReportUtil::numberFormatZeroBlank($item->qty) }}</td>
	<td>{{ $item->unit_m_kv_name }}</td>
	<td><span>{{$decimalParams["formatted_num"]}}<span style="visibility:hidden">{{$decimalParams["postfix"]}}</span></span></td>
	<td style="padding-right:14px;">{{ ReportUtil::numberFormatZeroBlank($item->total_price_or_tax_or_payment) }}</td>
</tr>
