@extends('layouts.app_report_a4')
@section('title', '見積書')

@php
	$lines_per_page  = 18 ;															 /* 1ページ表示行 */	
	$page            = 0 ;                                                           /* 現在ページ */

	$rowCnt = count($details) ;														 /**見積り明細行を含む総行数 */
	foreach($details as $product) {
		if(isset($product->TProjectProductEstimateDetails)) {
			$rowCnt += count($product->TProjectProductEstimateDetails) ;
		}
	}
	$loopCnt =  0 ;																	/**ループ中の行数 */

	$total_page = ReportUtil::totalPage($rowCnt, $lines_per_page) ;     		 	/* 総ページ数 */


	function PositioningLogo($branchName) {
		if(empty($branchName)) return "right:205px;" ;
		$strCnt = mb_strwidth($branchName) ;
		$logoPadding = 6 * $strCnt + 12 ;
		$style = "right:" . $logoPadding . "px; width:60px; margin-top:5px" ;
		return $style ;
	}

@endphp

@section('content')
	{{-- ヘッダー --}}
	@include('t_projects.estimate.estimate_header', [$header, 'isFirst'=>TRUE, ++$page, $total_page])

	{{-- 明細 --}}
	@forelse ($details as $item)
		{{-- 改ページ判定 --}}
		@php

			/**見積り明細行を含めた現在の行数を取得 */
			if(isset($item->TProjectProductEstimateDetails)) {
				$loopCnt += 1 + count($item->TProjectProductEstimateDetails);
			}
			$empty_row_count = ReportUtil::emptyRowCount($loopCnt, $lines_per_page) ; 		 /* 最終ページの空行数 */
			if($header->delivery_fee>0) $empty_row_count -= 1 ;			 /** 最終ページの空行数 送料がある場合 */ 
			if($header->construction_fee>0) $empty_row_count -= 1 ;			 /** 最終ページの空行数 納品代がある場合 */ 

		@endphp
		@if (ReportUtil::isBreakPage($loopCnt, $lines_per_page,true)) 
			@php
				/**改ページ時に行数カウントをリセット */
				$loopCnt = 1 + count($item->TProjectProductEstimateDetails);
			@endphp
			{{-- フッター --}}
			@include('t_projects.estimate.estimate_footer', [$header, 'isLast'=>FALSE])
			{{-- ヘッダー --}}
			@include('t_projects.estimate.estimate_header', [$header, 'isFirst'=>FALSE, ++$page, $total_page])
		@endif

		{{-- 1行単位で出力 --}}
		@include('t_projects.estimate.estimate_detail', [$item])
	@empty
	@endforelse
	
	@if($header->delivery_fee>0)
		@include('t_projects.estimate.estimate_detail_delivery_fee', [$header])
	@endif
	@if($header->construction_fee>0)
		@include('t_projects.estimate.estimate_detail_construction_fee', [$header])
	@endif
	{{-- 空行 --}}
	@include('layouts.app_report_empty_row', ['rows'=>$empty_row_count, 'cols'=>5])

	{{-- フッター --}}
	@include('t_projects.estimate.estimate_footer', [$header, 'isLast'=>TRUE])
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
	/* item override：*/
	.item-underline {
		margin: 3px;
		border-bottom : 1px solid #ccc;
		background-color: var(--style-mode-production, white);
	}

	/* 社印・ロゴ */
	.logo {
		/* .header-の基準位置から指定 */
		position:absolute;
		/* right:205px; */
	}
	/* 角印 */
	.sign {
		/* .header-の基準位置から指定 */
		position:absolute;
		right:5px;
		top : 70px
	}


	/**署名捺印欄 */
	.estimate-sign-table{
		width: 165px;
		height:55px;
		border: 1px solid #ccc;
		float: right;

	}


	.estimate-sign-table td {
		width:55px;
		text-align:center;
		border-top:none
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
		width:90% ;
		background-color: var(--style-mode-production, #F0FFFF) ;
		font-size: 16px ;
	}
	/* ヘッダー[取引先] */
	.box-header-condition {
		width: 80%;
		background-color: var(--style-mode-production, #F0FFFF) ;
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
		text-align : right ;
		width: 32%;
		background-color: var(--style-mode-production, #E6E6FA);
		
		/* ロゴ表記用 */
		position: relative;
	}

	/* ヘッダー備考 */
	.box-header-note {
		display: table ;
		width: 80% ;
		background-color: var(--style-mode-production, #FFFFEE) ;

	}

	/* ヘッダー備考 */
	.box-header-note-memo {
		display: table-cell ;
		background-color: var(--style-mode-production, #E6E6FA) ;
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
		margin-top:10px ;
	}

	/**フッターメモ欄 */
	.box-footer-memo {
		display: table-cell ;
		width: 100% ;
		border: solid 1px #ccc ;
		border-radius: 5px;
		font-size: 10px ;
		height: 85px;
	}
	.memoContent {
		font-size: 13px;
		margin-top:0;
		white-space:pre-wrap; 
		word-wrap:break-word;
	}	
	/* @各項目：文字数が多いver */
	.cell {
		width : 98% ;
		font-size: 10px;
		max-height: 14px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}


	/* @明細：ヘッダー・フッター・データ */
	th, td {
		/* override */
		height: 18px;
	}

	/* 請求明細：左揃え tdはデフォルト左揃えなので記入しない */
	table[class|="detail"] th:nth-of-type(1) {
		text-align: left;
	}

	/* 請求明細：センター */
	table[class|="detail"] td:nth-of-type(8) {
		text-align: center;
	}

    /* 請求明細：右揃え */

	table[class|="detail"] th:nth-of-type(5),

	table[class|="detail"] td:nth-of-type(2),
	table[class|="detail"] td:nth-of-type(4),
	table[class|="detail"] td:nth-of-type(5) {
        text-align: right;
    }

    /* 明細：縦罫線 */
	table[class|="detail"] th:nth-of-type(1),
	table[class|="detail"] th:nth-of-type(4),
	table[class|="detail"] td:nth-of-type(1),
	table[class|="detail"] td:nth-of-type(3),
	table[class|="detail"] td:nth-of-type(4) {
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