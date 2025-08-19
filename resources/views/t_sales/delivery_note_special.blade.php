@extends('layouts.app_report_a4')
@section('title', '納品書')

@php
	$start_position  = 0  ;                                                          /* 現在ページの開始行No */
	$lines_per_page  = 10 ;                                                          /* 1ページ表示行 */
	$page            = 0  ;                                                          /* 現在ページ */
	$total_page      = ReportUtil::totalPage(count($details), $lines_per_page) ;     /* 総ページ数 */
	$empty_row_count = ReportUtil::emptyRowCount(count($details), $lines_per_page) ; /* 最終ページの空行数 */
	$chunks          = $details->chunk($lines_per_page) ;                            /* ページ行数毎に分割 */
@endphp

@section('content')
	@forelse ($chunks as $items)
		{{-- 明細行が有る場合の納品書 --}}
		@php
			/* 開始行Noを現在ページ数から計算 */
			$start_position = $page * $lines_per_page ;
		@endphp

		{{-- [控え] ヘッダー・空行・フッター --}}
		@include('t_sales.delivery_note_special_header', [$header, 'isFirst'=>TRUE, ++$page, $total_page, 'title'=>'納 品 書 [控]'])
		@foreach ($items as $item)
			@include('t_sales.delivery_note_special_detail', [$item])
		@endforeach
		@if ($loop->last)
			@include('layouts.app_report_empty_row', ['rows'=>$empty_row_count, 'cols'=>8])
		@endif
		@include('t_sales.delivery_note_special_footer', ['isFirst'=>TRUE, 'isLast'=>$loop->last])

		{{-- [納品書] ヘッダー・空行・フッター --}}
		@include('t_sales.delivery_note_special_header', [$header, 'isFirst'=>FALSE, $page, $total_page, 'title'=>'納 品 書'])
		@foreach ($items as $item)
			@include('t_sales.delivery_note_special_detail', [$item])
		@endforeach
		@if ($loop->last)
			@include('layouts.app_report_empty_row', ['rows'=>$empty_row_count, 'cols'=>8])
		@endif
		@include('t_sales.delivery_note_special_footer', ['isFirst'=>FALSE, 'isLast'=>$loop->last])
	@empty
	@endforelse
@endsection

@section('style-scoped')
<style>
    .sheet {
		/* 用紙サイズの余白をoverride:上右下左 */
		@isset($isView)
			/* プレビュー用 */
			padding: 10mm 10mm 10mm 17mm ;
        @else
			/* 実印刷用 */
			padding: 0mm 0mm 0mm 7mm ;
        @endisset
    }

	/* タイトル */
	.box-title {
		display: table;
		width: 700px;
		background-color: var(--style-mode-production, #FEF);
		border-bottom: solid 1px #EEE;
	}

	/* タイトル[タイトル] */
	.box-title-label {
		display: table-cell;
		width: 80%;
		background-color: var(--style-mode-production, #E6E6FA);
		font-size: 15px;
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

	/* 自社ロゴ */
	.logo {
		/* .header-の基準位置から指定 */
		position:absolute;
		right:225px;
	}

	/* ヘッダー */
	.box-header {
		display: table;
		width: 700px;
		background-color: var(--style-mode-production, #F8F8FF);
		font-size: 12px;
	}

	/* ヘッダー[取引先] */
	.box-header-customer {
		display: table-cell;
		width: 43%;
		background-color: var(--style-mode-production, #F0FFFF);
	}

	/* ヘッダー[伝票] */
	.box-header-info {
		display: table-cell;
		width: 25%;
		background-color: var(--style-mode-production, #F5FFFA);
	}

	/* ヘッダー[自社] */
	.box-header-company {
		display: table-cell;
		width: 32%;
		background-color: var(--style-mode-production, #E6E6FA);
		
		/* ロゴ表記用 */
		position: relative;
	}

	/* ヘッダー備考 */
	.box-header-note {
		display: table;
		width: 700px;
		background-color: var(--style-mode-production, #FFFFEE);
		border-top: solid 1px #EEE;
		font-size: 10px;
	}

	/* ヘッダー備考コンテンツ1 */
	.box-header-note-01 {
		display: table-cell;
		width: 75%;
		background-color: var(--style-mode-production, #E6E6FA);
	}
	/* ヘッダー備考コンテンツ2 */
	.box-header-note-02 {
		display: table-cell;
		width: 25%;
		font-weight: bold;
		background-color: var(--style-mode-production, #F5FFFA);
	}



	/* テーブル */
	.detail {
		width: 685px;
	}

	/* 明細 */
	.box-detail {
		display: table;
		width: 700px;
	}

	/* @明細：ヘッダー・フッター・データ */
	th, td {
		padding: 2px;
		height: 20px;
	}

	/* @各項目：文字数が多いver */
	.cell {
		font-size: 10px;
		max-height: 28px;
		overflow: hidden;
		white-space: nowrap;
	}

	/* フッター */
	.box-footer {
		display: table;
		width: 700px;
		background-color: var(--style-mode-production, #FFFFEE);
	}

	/* 下余白 */
	.box-margin-bottom {
		/* A4縦 半分位置の調整用 */
		display: table;
		width: 700px;
		height: 40px;
		background-color: var(--style-mode-production, #F5FFFA);
	}

	/* 明細：左揃え tdはデフォルト左揃えなので記入しない */
	th:nth-of-type(2),
	th:nth-of-type(3),
	th:nth-of-type(8) {
		text-align: left;
	}

	/* 明細：センター */
	th:nth-of-type(1),
	td:nth-of-type(1),
	th:nth-of-type(5),
	td:nth-of-type(5) {
		text-align: center;
	}

    /* 明細：右揃え */
	th:nth-of-type(4),
	td:nth-of-type(4),
	th:nth-of-type(6),
	td:nth-of-type(6),
	th:nth-of-type(7),
	td:nth-of-type(7) {
        text-align: right;
    }

    /* 明細：縦罫線 */
	td:nth-of-type(1),
	td:nth-of-type(3),
	td:nth-of-type(5),
	td:nth-of-type(6),
	td:nth-of-type(7) {
		border-right: 1px solid #ccc;
    }
</style>
@endsection