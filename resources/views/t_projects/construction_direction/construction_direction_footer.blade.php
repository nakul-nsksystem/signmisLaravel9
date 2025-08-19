{{-- footer start --}}
	<div class="box-footer">
		<div class="box-footer-memo">
			持ち物:
			<p class="memoContent">{{$item->construction_belongings}}</p>

		</div>
	</div>

	<div class="box-footer">
		<div class="box-footer-memo">
			備考:
			<p class="memoContent">{{$item->memo}}</p>

		</div>
	</div>
	<div class="box-detail">

		<table class="detail" style="margin-top:20px">
			<thead>
				<tr>
					<th style="background:#eee;">図面QR</th>
					<th style="background:#eee;">終了実績入力QR</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style="text-align:center">
						<img src="data:image/svg+xml;base64,{{$tProjectQr}}" width="100" height="100">
					</td>
					<td style="text-align:center">
						<img src="data:image/svg+xml;base64,{{$item->qrcode}}" width="100" height="100">
					</td>
				</tr>
			
			</tbody>
		</table>	
		</div>
</section>
{{-- footer end --}}