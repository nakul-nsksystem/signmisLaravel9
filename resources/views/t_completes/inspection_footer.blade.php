{{-- footer start --}}
			</tbody>

			<tfoot>
				<tr>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					@if ($isLast)
						{{-- last only --}}
						<th style="font-size:10px">仕入合計</th>
						<th style="padding-right:14px;">{{ number_format($header->total_price + $header->tax) }}</th>
					@else
						<th></th>
						<th></th>
					@endif
				</tr>
			</tfoot>
		</table>
	</div>
</section>
{{-- footer end --}}
