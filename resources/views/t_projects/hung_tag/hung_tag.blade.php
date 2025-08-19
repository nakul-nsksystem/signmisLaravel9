@extends('layouts.app_report_a4')
@section('title', '下げ札')

@php
	$page       = 0 ;             		 /* 現在ページ */
	$total_page = count($details) ;     /* 総ページ数 */
@endphp

@section('content')
	@forelse ($details as $item)
	<section class="sheet">
		@include('t_projects.hung_tag.hung_tag_detail', [$item,$isInternal = false])
		<hr>
		@include('t_projects.hung_tag.hung_tag_detail', [$item,$isInternal = true])
	</section>

	@empty
	@endforelse
@endsection

@section('style-scoped')
<style>
	/* item override：*/
	.item-underline {
		margin: 3px;
		border-bottom : 1px solid #ccc;
		background-color: var(--style-mode-production, white);
	}

	/**中央線 */
	hr {
		height: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}	
	hr {
		margin-top: 1rem;
		border-top: 1px dashed #ccc;
		height: 1em;
		text-align: center;
	}
	hr::after {
		content: "";
		color: #ccc;
		position: relative;
	}
	/* 明細 */
	.box-detail {
		display: table;
		width: 710px;
		height: 134mm; /* 要素の高さを指定 */
		overflow: hidden;
	}

	/* @明細：ヘッダー・フッター・データ */
	th, td {
		/* override */
		position: relative;
	}

    /* 明細：縦罫線・社内向けお客様用高さ設定*/
	table[class|="4customer"] td 
	{
		border-right: 1px solid #ccc;
		height: 48px;
    }
	table[class|="4internal"] td 
	{
		border-right: 1px solid #ccc;
		height: 32px;
    }

	/**項目名 */
	.header {
		background:#eee !important;
		text-align:center!important ;
	}
	/**一番上の行 */
	.toptd {
		border-top: none !important;
		max-height:40px !important
	}
	/**右にボーダーを使用しない行 */
	.bltd {
		border-right: none !important;
	}

	/**目立たせる文字 */
	.emphas {
		font-size : 18px ;
		font-weight: bold
	}

	/**材料名長いと..で見切れる用に */
	.material-name {
		width:98%;
		overflow:hidden; 
		white-space:nowrap;
		text-overflow: ellipsis; 
	}

	/**サムネイル・QR系 */
	.thumb-wrap {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		height:228px;
	}

	table[class|="4customer"] div[class|="thumb-wrap"] {
		height:228px;
	}
	table[class|="4internal"] div[class|="thumb-wrap"] {
		height:165px;
	}
	.thumb {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		max-width:98%;
		max-height:98%;

	}

	/**ロゴ部分 */
	.branch-wrap {
		margin-top:0.5rem;
		position: relative;
	}
	.logo {
		display: inline-block ;
		vertical-align: middle;
		width:auto;
		height:30px;
		margin-right: 5px;
	}
	.branch {
		display: inline-block ;
		position: absolute;
	}

	
</style>
@endsection