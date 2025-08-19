{{-- footer start --}}
			</tbody>
			@if($isLast)
				<tfoot>
					<tr class="footer-Individual">
						<th></th>
						<th></th>
						<th></th>
						<th>合計</th>
						<th>
							&yen;&nbsp;{{number_format($header["totalPrice"])}}
						</th>
					</tr>
				</tfoot>
			@endif
		</table>
	</div>
	@if($isLast)

		<div class="box-footer">
			<div class="box-footer-memo">
				備考:
				<p class="memoContent">{{$header->estimate_memo}}</p>
			</div>
		</div>
	@endif

</section>
{{-- footer end --}}