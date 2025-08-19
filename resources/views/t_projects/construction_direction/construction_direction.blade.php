@extends('layouts.app_report_a4')
@section('title', '現場指示書')

@php
	$lines_per_page  = 1 ;															 /* 1ページ表示行 */	
	$page            = 0 ;                                                           /* 現在ページ */
	$total_page      = ReportUtil::totalPage(count($header), $lines_per_page) ;     /* 総ページ数 */

@endphp

@section('content')
	{{-- ヘッダー --}}

	{{-- 明細 --}}
	@forelse ($header as $item)
		{{-- ヘッダー --}}
		@include('t_projects.construction_direction.construction_direction_header', [$item, 'isFirst'=>TRUE, ++$page, $total_page])
		
		@include('t_projects.construction_direction.construction_direction_detail', [$item])
		
		{{-- フッター --}}
		@include('t_projects.construction_direction.construction_direction_footer', [$header, 'isLast'=>FALSE])

	@empty
	@endforelse

@endsection

@section('style-scoped')
<style>
	/* タイトル */
	.box-title {
		display: table;
		width: 710px;
		background-color: var(--style-mode-production, #FEF);
		/* border-bottom: solid 1px #EEE; */
	}
	
	/* タイトル[タイトル] */
	.box-title-label {
		display: table-cell;
		width: 60%;
		background-color: var(--style-mode-production, #E6E6FA);
		font-size: 20px;
		font-weight: bold;
		text-align: center;
	}
	/* タイトル[ページ] */
	.box-title-left {
		display: table-cell;
		width: 20%;
		background-color: var(--style-mode-production, #F0FFFF);
		font-size: 9px;
	}
	/* タイトル[ページ] */
	.box-title-page {
		display: table-cell;
		width: 20%;
		background-color: var(--style-mode-production, #F0FFFF);
		font-size: 9px;
		text-align: right;
	}
	/* item override：*/
	.item-underline {
		margin: 3px;
		border-bottom : 1px solid #ccc;
		background-color: var(--style-mode-production, white);
	}

	/* ヘッダー */
	.box-header {
		display: table;
		width: 710px;
		background-color: var(--style-mode-production, #F8F8FF);
		font-size: 12px;
	}

	/* 明細 */
	.box-detail {
		display: table;
		width: 710px;
	}
	.box-detail thead th {
		background: white;

	}

	/* フッター */
	.box-footer {
		display: table ;
		width: 710px ;
		background-color: var(--style-mode-production, #FFFFEE) ;
		margin-top:20px ;
	}

	/**フッターメモ欄 */
	.box-footer-memo {
		display: table-cell ;
		width: 100% ;
		border: solid 1px #ccc ;
		border-radius: 5px;
		font-size: 10px ;
		height: 100px;
	}
	.memoContent {
		font-size: 13px;
		margin-top:0;
		white-space:pre-wrap; 
		word-wrap:break-word;
	}

	/* @明細：ヘッダー・フッター・データ */
	th, td {
		/* override */
		height: 14px;
	}

	.tdHeader {
		text-align: center;
		font-weight: bold;
		background-color:#eee !important;
	}

	/* 請求明細：左揃え tdはデフォルト左揃えなので記入しない */
	table[class|="detail"] th:nth-of-type(5) {
		text-align: left;
	}

	/* 請求明細：センター */
	table[class|="detail"] td:nth-of-type(8) {
		text-align: center;
	}

    /* 請求明細：右揃え */
	table[class|="detail"] td:nth-of-type(5) {
        text-align: right;
    }

    /* 明細：縦罫線 */
	table[class|="detail"] th:nth-of-type(1),
	table[class|="detail"] th:nth-of-type(2),
	table[class|="detail"] td:nth-of-type(1),
	table[class|="detail"] td:nth-of-type(2) {
		border-right: 1px solid #ccc;
    }

	/**セカンドヘッダー */
	tr[class|="second-header"] td:nth-of-type(1),
	tr[class|="second-header"] td:nth-of-type(2),
	tr[class|="second-header"] td:nth-of-type(4),
	tr[class|="second-header"] td:nth-of-type(5) {
		text-align: center;
	}

	/**hu */
	tr[class|="footer-Individual"] th:nth-of-type(1),
	tr[class|="footer-Individual"] th:nth-of-type(2),
	tr[class|="footer-Individual"] th:nth-of-type(4),
	tr[class|="footer-Individual"] th:nth-of-type(5) {
		border-right: none;
	}

	    /* 明細：縦罫線 */
	table[class|="estimate-sign-table"] td:nth-of-type(1),
	table[class|="estimate-sign-table"] td:nth-of-type(2) {
		border-right: 1px solid #ccc;
    }

	
</style>
@endsection