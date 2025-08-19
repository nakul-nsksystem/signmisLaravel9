@extends('layouts.app_report_a4')
@section('title', '発注書')

@php
	$lines_per_page  = 11 ;                                                          /* 1ページ表示行 */
	$page            = 0 ;                                                           /* 現在ページ */
	$total_page      = ReportUtil::totalPage(count($details), $lines_per_page) ;     /* 総ページ数 */
	$empty_row_count = ReportUtil::emptyRowCount(count($details), $lines_per_page) ; /* 最終ページの空行数 */
@endphp

@section('content')
	{{-- ヘッダー --}}
	@include('t_p_order.po_header', [$header, 'isFirst'=>TRUE, ++$page, $total_page])

	{{-- 明細 --}}
	@forelse ($details as $item)
		{{-- 改ページ判定 --}}
		@if (ReportUtil::isBreakPage($loop->iteration, $lines_per_page))
			{{-- フッター --}}
			@include('t_p_order.po_footer', [$header, 'isLast'=>FALSE])
			{{-- ヘッダー --}}
			@include('t_p_order.po_header', [$header, 'isFirst'=>FALSE, ++$page, $total_page])
		@endif

		{{-- 1行単位で出力 --}}
		@include('t_p_order.po_detail', [$item])
	@empty
	@endforelse

	{{-- 空行 --}}
	@include('layouts.app_report_empty_row', ['rows'=>$empty_row_count, 'cols'=>7])

	{{-- フッター --}}
	@include('t_p_order.po_footer', [$header, 'isLast'=>TRUE])
@endsection

@section('style-scoped')
<style>
	/* タイトル */
	.box-title {
		display: table;
		width: 710px;
		background-color: var(--style-mode-production, #FEF);
		border-bottom: solid 1px #EEE;
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

	.item {
		margin : 0
	}

	/* 社印・ロゴ */
	.logo {
		/* .header-の基準位置から指定 */
		position:absolute;
		right:195px;
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

		background-color: var(--style-mode-production, #F0FFFF) ;
		font-size: 16px ;
		

	}

	/* ヘッダー */
	.box-header-info {
		display: table-cell;
		width: 25%;
		background-color: var(--style-mode-production, #F5FFFA);
	}

	/* ヘッダー[自社] */
	.box-header-company {
		display: table-cell;
		width: 32%;
		text-align:right;
		background-color: var(--style-mode-production, #E6E6FA);
		
		/* ロゴ表記用 */
		position: relative;
	}

	/* ヘッダー備考 */
	.box-header-note {
		display: table ;
		width: 95% ;
		background-color: var(--style-mode-production, #FFFFEE) ;
		margin-top:15px ;

	}

	/* ヘッダー備考 */
	.box-header-note-memo {
		display: table-cell ;
		width: 50% ;
		background-color: var(--style-mode-production, #E6E6FA) ;
	}

	/* 明細 */
	.box-detail {
		display: table;
		width: 710px;
	}

	/* フッター */
	.box-footer {
		display: table ;
		width: 710px ;
		background-color: var(--style-mode-production, #FFFFEE) ;
		font-size: 10px ;
		margin-top:30px ;
	}

	/**フッターメモ欄 */
	.box-footer-memo {
		display: table-cell ;
		width: 100% ;
		border: solid 1px #ccc ;
		font-size: 10px ;
		height: 95px;
	}
	.memoContent {
		font-size: 13px;
		margin-top:0;
		max-height: 95px;
		white-space:pre-wrap; 
		word-wrap:break-word;
		overflow-y: hidden;
	}

	/**商品名 */
	.materialname {
		font-size: 13px;
		/* max-height: 28px; */
		overflow: hidden;
	}

	/* @明細：ヘッダー・フッター・データ */
	th, td {
		/* override */
		height: 46px;
	}



	/* 請求明細：左揃え tdはデフォルト左揃えなので記入しない */
	/* table[class|="detail"] th:nth-of-type(5) {
		text-align: left;
	} */

	.nowrap {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.wrap {
		white-space: normal;
	}

    /* 請求明細：右揃え */
	table[class|="detail"] td:nth-of-type(1),
	table[class|="detail"] td:nth-of-type(3),
	table[class|="detail"] td:nth-of-type(5),
	table[class|="detail"] td:nth-of-type(6) {
        text-align: right;
    }

    /* 明細：縦罫線 */
	table[class|="detail"] td:nth-of-type(1),
	table[class|="detail"] td:nth-of-type(2),
	table[class|="detail"] td:nth-of-type(4),
	table[class|="detail"] td:nth-of-type(5),
	table[class|="detail"] td:nth-of-type(6){
		border-right: 1px solid #ccc;
    }
</style>
@endsection