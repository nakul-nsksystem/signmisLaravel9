{{-- footer start --}}
			</tbody>
			
			<tfoot>
				<tr>
					<th>
					</th>
					<th>
						{{ $header->slip_memo }}　
					</th>
					<th></th>
					<th></th>
					<th></th>
					@if ($isLast)
						{{-- last only --}}
						<th>合計</th>
						<th>&yen;&nbsp;{{ ReportUtil::numberFormatZeroBlank($header->total_price) }}</th>
					@else
						<th></th>
						<th></th>
					@endif
					<th></th>
				</tr>
			</tfoot>
		</table>
	</div>

@if	($isSecond)
	<div class="box-margin-bottom2">
	</div>
@elseif ($isFirst)
	<div class="box-margin-bottom1">
	</div>
@else
</section>
@endif
{{-- footer end --}}