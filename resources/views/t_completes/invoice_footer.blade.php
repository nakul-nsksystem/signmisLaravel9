{{-- footer start --}}
			</tbody>

			<tfoot>
				<tr>
					@if ($isLast)
						{{-- last only --}}
						<th style="font-size:10px; color:red; white-space:nowrap; overflow:visible;">締日後のご入金につきましては請求書に反映しない旨をご了承下さい。</th>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th style="font-size:10px">御買上 合計</th>
						<th style="padding-right:14px;">{{ number_format($header->total_price + $header->tax) }}</th>
					@else
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
					@endif
				</tr>
			</tfoot>
		</table>
	</div>
</section>
{{-- footer end --}}
