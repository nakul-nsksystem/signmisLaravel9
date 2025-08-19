@extends('layouts.app_report_a4')
@section('title', '請求書')

@php
	$lines_per_page  = 23;                                                           /* 1ページ表示行 */
	$page            = 0 ;                                                           /* 現在ページ */
	$total_page      = ReportUtil::totalPage(count($details), $lines_per_page) ;     /* 総ページ数 */
	$empty_row_count = ReportUtil::emptyRowCount(count($details), $lines_per_page) ; /* 最終ページの空行数 */
@endphp

@section('content')
	{{-- ヘッダー --}}
	@if ($header->MCustomer->invoice_m_kv_id == 1110004)
		{{-- 請求ヘッダー：今回のみ --}}
		@include('t_completes.invoice_header_this_time', [$header, 'isFirst'=>TRUE, ++$page, $total_page])
	@else
		{{-- 請求ヘッダー：標準 --}}
		@include('t_completes.invoice_header', [$header, 'isFirst'=>TRUE, ++$page, $total_page])
	@endif

	{{-- 明細 --}}
	@forelse ($details as $item)
		{{-- 改ページ判定 --}}
		@if (ReportUtil::isBreakPage($loop->iteration, $lines_per_page))
			{{-- フッター --}}
			@include('t_completes.invoice_footer', [$header, 'isLast'=>FALSE])

			@if ($header->MCustomer->invoice_m_kv_id == 1110004)
				{{-- 請求ヘッダー：今回のみ --}}
				@include('t_completes.invoice_header_this_time', [$header, 'isFirst'=>FALSE, ++$page, $total_page])
			@else
				{{-- 請求ヘッダー：標準 --}}
				@include('t_completes.invoice_header', [$header, 'isFirst'=>FALSE, ++$page, $total_page])
			@endif
		@endif

		{{-- 1行単位で出力 --}}
		@include('t_completes.invoice_detail', [$item])
	@empty
	@endforelse

	{{-- 空行 --}}
	@include('layouts.app_report_empty_row', ['rows'=>$empty_row_count, 'cols'=>7])
	{{-- フッター --}}
	@include('t_completes.invoice_footer', [$header, 'isLast'=>TRUE])
@endsection

@section('style-scoped')
<style>
	/* 本体 */
	body {
		/* 請求書のフォントは明朝体を指定 */
		font-family: 'IPAMincho';
	}

	/* @セレクタ[box] */
	div[class|="box"] {
		padding: 2px;
	}

	/* タイトル */
	.box-title {
		display: table;
		width: 710px;
		background-color: var(--style-mode-production, #FEF);
		border-bottom: solid 1px #EEE;
		margin: 20px 0 10px 0;
	}
	
	/* タイトル[タイトル] */
	.box-title-label {
		display: table-cell;
		width: 80%;
		background-color: var(--style-mode-production, #E6E6FA);
		font-size: 20px;
		font-weight: bold;
		text-align: center;
	}

	/* タイトル[ページ] */
	.box-title-page {
		display: table-cell;
		width: 10%;
		background-color: var(--style-mode-production, #F0FFFF);
		font-size: 9px;
		text-align: right;
	}

	/* 社印 */
	.company_seal {
		/* .header-の基準位置から指定 */
		position:absolute;
		right:0;
	}

	/* 自社ロゴ */
	.company_logo {
		/* .header-の基準位置から指定 */
		position:absolute;
		right:220px;
	}

	/* ヘッダー */
	.box-header {
		display: table;
		width: 710px;
		background-color: var(--style-mode-production, #F8F8FF);
		font-size: 12px;
	}

	/* ヘッダー[取引先] */
	.box-header-customer {
		display: table-cell;
		width: 40%;
		background-color: var(--style-mode-production, #F0FFFF);
	}

	/* ヘッダー[請求情報] */
	.box-header-info {
		display: table-cell;
		width: 27%;
		background-color: var(--style-mode-production, #F5FFFA);
	}

	/* ヘッダー[請求情報] 親要素
	   wkhtmltopdfがflex未対応なのでwkhtmltopdf向けの指定[-webkit-box]も追加 */
	.box-header-info-flex {
		display: flex;
		display: -webkit-box;
	}

	/* ヘッダー[自社] */
	.box-header-company {
		display: table-cell;
		width: 33%;
		background-color: var(--style-mode-production, #E6E6FA);
		
		/* ロゴ表記用 */
		position: relative;
	}

	/* ヘッダー備考 */
	.box-header-note {
		display: table;
		width: 710px;
		background-color: var(--style-mode-production, #FFFFEE);
		border-top: solid 1px #EEE;
		font-size: 10px;
	}

	/* ヘッダー備考[請求文言] */
	.box-header-note-memo {
		display: table-cell;
		width: 50%;
		background-color: var(--style-mode-production, #E6E6FA);
	}

	/* ヘッダー備考[銀行情報] */
	.box-header-note-bank {
		display: table-cell;
		width: 50%;
		background-color: var(--style-mode-production, #F0FFFF);
        text-align: right;
	}

	/* 明細 */
	.box-detail {
		display: table;
		width: 710px;
	}

	/* フッター */
	.box-footer {
		display: table;
		width: 710px;
		background-color: var(--style-mode-production, #FFFFEE);
		font-size: 10px;
	}

	/* テーブル */
	table {
		/* 角の丸めを外す */
		border-radius: initial;
		border-collapse: collapse;
		/* 右揃えに設定 wkhtmltopdfだとflex未対応なのでfloat指定 */
		float: right;
		/* マージン: 上右下左 */
		margin: 0 0 5px 0;
    }

	/* テーブル */
	table[class|="detail"] {
		/* マージン: 上右下左 */
		margin: 0;
	}

	/* テーブルヘッダー */
	thead th:first-child:last-child {
		/* 角の丸めを外す */
		border-radius: initial;
	}

    /* 請求ラベル：センター */
    table[class|="invoice"]	th:nth-child(n+1):nth-child(-n+7) {
		text-align: center;
    }

		/* 請求データ：右揃え */
		table[class|="invoice"]	td:nth-child(n+1):nth-child(-n+7) {
			text-align: right;
			padding-right: 10px;
		}

		/* 請求ラベル：縦罫線 */
		table[class|="invoice"]	th:nth-child(n+1):nth-child(-n+4) {
			border-right: 1px solid #ccc;
		}

		/* 請求ラベル：縦罫線 */
		table[class|="invoice"]	td:nth-child(n+1):nth-child(-n+4) {
			border-right: 1px solid #ccc;
		}

		/* 請求ラベル：縦罫線 赤枠 */
		table[class|="invoice"]	th:nth-child(n+5):nth-child(-n+6),
		table[class|="invoice"]	td:nth-child(n+5):nth-child(-n+6) {
			border-right: 1px solid red;
		}

		/* 請求ラベル：横罫線 赤枠 */
		table[class|="invoice"]	th:nth-child(n+6):nth-child(-n+6) {
			border-top: 1px solid red;
		}

		/* 請求ラベル：横罫線 赤枠 */
		table[class|="invoice"]	td:nth-child(n+6):nth-child(-n+6) {
			border-bottom: 1px solid red;
		}

	/* 今回請求ラベル：センター */
	table[class|="invoice_this_time"] th:nth-child(n+1):nth-child(-n+3) {
		text-align: center;
	}

		/* 今回請求データ：右揃え */
		table[class|="invoice_this_time"] td:nth-child(n+1):nth-child(-n+3) {
			text-align: right;
			padding-right: 10px;
		}

		/* 今回請求ラベル：縦罫線 */
		table[class|="invoice_this_time"] th:nth-child(n+1):nth-child(-n+1) {
			border-right: 1px solid #ccc;
		}

		/* 今回請求ラベル：縦罫線 */
		table[class|="invoice_this_time"] td:nth-child(n+1):nth-child(-n+1) {
			border-right: 1px solid #ccc;
		}

		/* 今回請求ラベル：縦罫線 赤枠 */
		table[class|="invoice_this_time"] th:nth-child(n+2):nth-child(-n+3),
		table[class|="invoice_this_time"] td:nth-child(n+2):nth-child(-n+3) {
			border-right: 1px solid red;
		}

		/* 今回請求ラベル：横罫線 赤枠 */
		table[class|="invoice_this_time"] th:nth-child(n+3):nth-child(-n+3) {
			border-top: 1px solid red;
		}

		/* 今回請求ラベル：横罫線 赤枠 */
		table[class|="invoice_this_time"] td:nth-child(n+3):nth-child(-n+3) {
			border-bottom: 1px solid red;
		}

	/* 請求明細：左揃え tdはデフォルト左揃えなので記入しない */
	table[class|="detail"] th:nth-of-type(2),
	table[class|="detail"] th:nth-of-type(3) {
		text-align: left;
	}

	/* 請求明細：センター */
	table[class|="detail"] td:nth-of-type(1),
	table[class|="detail"] td:nth-of-type(5) {
		text-align: center;
	}

    /* 請求明細：右揃え */
	table[class|="detail"] td:nth-of-type(4),
	table[class|="detail"] td:nth-of-type(6),
	table[class|="detail"] td:nth-of-type(7) {
        text-align: right;
    }

    /* 明細ヘッダーと明細：縦罫線 */
	table[class|="detail"] thead th:nth-of-type(1),
	table[class|="detail"] thead th:nth-of-type(3),
	table[class|="detail"] thead th:nth-of-type(5),
	table[class|="detail"] thead th:nth-of-type(6),
	table[class|="detail"] td:nth-of-type(1),
	table[class|="detail"] td:nth-of-type(3),
	table[class|="detail"] td:nth-of-type(5),
	table[class|="detail"] td:nth-of-type(6) {
		border-right: 1px solid #ccc;
    }

	/* 明細：ヘッダー・フッター・データ */
	th, td {
		/* padding 上右下左 */
		padding: 0px 4px 0px 4px;
		height: 30px;
	}
</style>
@endsection