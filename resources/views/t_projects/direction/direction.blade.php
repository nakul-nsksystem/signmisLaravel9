@extends('layouts.app_report_a4_beside')
@section('title', '作業指示書')

@php
	/**曜日検索 */
	$week = array( "日", "月", "火", "水", "木", "金", "土" );
	
	/**曜日色設定 */
	function getDayColor($dayIdx){
		if($dayIdx == 0) return "color:red" ;
		if($dayIdx == 6) return "color:blue" ;
		return "" ;
	} 

	$height_param = 0 ; /**改ページ用高さパラメータ 各要素の高さpx数を参考に算出 */

	function isBreakPageByHeight ($param){
		/**総高さ710 */
		if($param > 710 ) return true ;
	}

@endphp

@section('content')
	{{-- ヘッダー --}}	
	@include('t_projects.direction.direction_header', [$header, 'isFirst'=>TRUE])

	@php
		/**改ページ用定数
		*タイトル部分 48 
		*顧客情報各行 54
		*納品タイトル行 36
		*納品情報行 24 
		*/
		
		$titleConstant = 48 ;
		$headerRowConstant = 54 ;
		$minDeliRowConstant = 36 ;
		$deliveryRowConstant = 32 ;

		/**初期値 指示書と書いてあるタイトル部分+顧客情報2行 */
		$height_param += $titleConstant + ( $headerRowConstant * 2 ) ;

		/**納品情報 */
		if(count($header->TProjectDeliveries)) {
			/**ヘッダー部分合算 */
			$height_param += $minDeliRowConstant + $deliveryRowConstant * count($header->TProjectDeliveries) ;
			
		} else {
			/**納品情報デフォルト値 */
			$height_param += $minDeliRowConstant;
		}

	@endphp
	{{-- 明細 --}}
	@forelse ($details as $item)
		@php
			/**改ページ用定数
			*商品名納期行 45
			*納期行 18
			*工程各行 18
			*バッジ行 27
			*サムネイル 160
			*pタグ 27
			*分割タイトル＋重ねしろ行
			*分割板割表各行 36
			*分割図 200 
			*padding 9 	
			
			*合計最低値 117 ( 45 + (工程各行*4) ) */

			$productTitleConstant = 45 ;
			$productDeliveryConstant = 18 ;
			$processConstant = 18 ;
			$badgeConstant = 27 ;
			$thumbnailConstant = 160 ;
			$paragraphConstant = 27 ;
			$sepTitleConstant = 36 ;
			$tableConstant = 36 ;
			$sepSvgConstant = 150 ;
			$paddingConstant = 9 ;

			$detailHeight = 117 ;

			/**バッジ有無判定 */
			if( isset($item->specified_m_kv_id) || isset($item->warranty_m_kv_id)  || $item->is_needed_labels_for_fire_prevention) {

				$detailHeight += $badgeConstant ;

			}

			/**納期数から高さ取得 */
			/** if( empty($item->TProjectDeliveries) ) */
			if(count($item->TProjectDeliveries)) {
				$detailHeight += $productDeliveryConstant * count($header->TProjectDeliveries) ;
			}
			
			/**工程数・備考から工程の高さパラメータを取得*/
			$processHeight = 0 ;			
			foreach($item->TProjectProductProcesses as $process) {
				if($process->is_enabled) {
					if(isset($process->memo)) $processHeight += $processConstant ;

					for ($i = 1; $i <= 9; $i++) {
						$displayName = 'display_' . str_pad($i, 2, 0, STR_PAD_LEFT); 

						if(isset($process[$displayName])) $processHeight += $processConstant ;
					}
				}
			}
			
			/**分割板割デフォルト値 9(padding) */
			$sepHeight = 9 ;
			$layoutHeight = 9 ;

			/**分割があるかどうか */
			$isSep = $item->num_of_sep_w >= 2 || $item->num_of_sep_h >= 2 ? true : false ;
			
			if($isSep){
				/**分割タイトルと重ね代 + th + サムネイル + td * 行数 */
				$sepHeight = $sepTitleConstant + $tableConstant + $sepSvgConstant + ($tableConstant * count($item->TProjectProductSeparates)) ;
			}

			if(count($item->TProjectProductBoardlayouts)){
				/**板割pタグ + th + td * 行数 */
				$layoutHeight = $paragraphConstant + $tableConstant + ($tableConstant * count($item->TProjectProductBoardlayouts)) ;
			}

			/**分割か板割か大きい方を取得 */
			$sepOrLayHeight = max($sepHeight,$layoutHeight) ; 
			
			/**合計値 */
			$sum = $productTitleConstant + $processHeight + $sepOrLayHeight ; 
			
			/**合計値が最低値を上回る場合に採用 */
			if($sum > 99) {
				$detailHeight = $sum ;
			}
			
			/**現在設定されている高さパラメータが150(サムネイル分の高さ)に満たないかつサムネイルが設定されている場合 */
			if($detailHeight < $thumbnailConstant && isset($item->t_project_file_id)) $detailHeight = $thumbnailConstant ;

			$height_param += $detailHeight + $paddingConstant;

		@endphp
		{{-- 改ページ判定 --}}
		@if (isBreakPageByHeight($height_param))
		
			@include('t_projects.direction.direction_footer', [$header, 'isLast'=>false])

			{{-- ヘッダー --}}
			@include('t_projects.direction.direction_header', [$header, 'isFirst'=>FALSE])
			@php
				$height_param = $titleConstant + $detailHeight;
			@endphp
		@endif
		{{-- 1行単位で出力 --}}
		@include('t_projects.direction.direction_detail', [$item])
			
	@empty
	@endforelse

	{{-- フッター --}}
	@include('t_projects.direction.direction_footer', [$header, 'isLast'=>TRUE])

@endsection

@section('style-scoped')
<style>
	/* タイトル */
	.box-title {
		display: table;
		width: 1045px;
		background-color: var(--style-mode-production, #FEF);
		border-bottom: solid 1px #EEE;
	}
	
	/* タイトル[タイトル] */
	.box-title-label {
		display: table-cell;
		width: 60%;
		background-color: var(--style-mode-production, #E6E6FA);
		font-size: 20px;
		font-weight: bold !important;
		text-align: center;	
	}

	/* タイトル[ページ] */
	.box-title-page {
		display: table-cell;
		width: 20%;
		background-color: var(--style-mode-production, #F0FFFF);
		font-size: 9px;
		text-align: right;
	}
	.box-title-left {
		display: table-cell;
		width: 20%;
		background-color: var(--style-mode-production, #F0FFFF);
		font-size: 9px;
		vertical-align: bottom;

	}
	/* item override：*/
	.item-underline {
		margin: 3px;
		border-bottom : 1px solid #EEE;
		background-color: var(--style-mode-production, white);
	}

	/* ヘッダー */
	.box-row {
		display: table;
		width: 1045px;	
		background-color: var(--style-mode-production, #F8F8FF);
		font-size: 12px;
		/* margin-bottom:2px; */
	}

	/* ヘッダー */
	.box-col-1 {
		display: table-cell ;
		width:8% ;
		background-color: var(--style-mode-production, #FFFFEE) ;
	}
	.box-col-2 {
		display: table-cell ;
		width:16% ;
		background-color: var(--style-mode-production, #F0FFFF) ;
	}
	.box-col-3 {
		display: table-cell ;
		width:28% ;
		background-color: var(--style-mode-production, #FFFFEE) ;
	}
	.box-col-4 {
		display: table-cell ;
		width:32% ;
		background-color: var(--style-mode-production, #F0FFFF) ;
	}
	.box-col-5 {
		display: table-cell ;
		width:40% ;
		background-color: var(--style-mode-production, #F0FFFF) ;
		vertical-align: top;

	}
	.box-col-6 {
		display: table-cell ;
		width:50% ;
		background-color: var(--style-mode-production, #F0FFFF) ;c
		vertical-align: top;

	}
	.box-col-7 {
		display: table-cell ;
		width:66% ;
		background-color: var(--style-mode-production, #F0FFFF) ;
		vertical-align: top;

	}
	.box-col-12 {
		display: table-cell ;
		width:100% ;
		background-color: var(--style-mode-production, #F0FFFF) ;
		/* border-bottom: solid 1px #EEE; */

	}
	.box-row label {
		font-weight: bold !important;
		font-size: 10px;
	}

	.emphasis {
		font-weight: bold !important;
		color:red;		
	}
	.emphasis2 {
		font-weight: bold !important;
		color:red;
		font-size: 16px;

	}
	.product {
		background-color: var(--style-mode-production, #F0FFFF) ;
		font-weight: bold !important;
		font-size: 14px;
	}
	.productQty {
		background-color: var(--style-mode-production, #F0FFFF) ;
		font-weight: bold !important;
		/* font-size: 16px; */
		/* font-size: 14px; */
		/* float: right; */
		margin-left:10px
	}
	.right {
		float: right;
		margin-left:10px
	}

	.badge {
		color: #fff;
		padding: 0.2rem 0.3rem;
		border-radius: 1rem;
		text-transform: uppercase;
		text-align: center;
		white-space: nowrap;

	}

	/**バッジカラー　名称bootstrap準拠 */
	.badge[attribute|="badge-primary"] {
		background-color: #3998DB;
	}
	.badge[attribute|="badge-info"] {
		background-color: #6cb2eb;
		color: #000000;
	}
	.badge[attribute|="badge-dark"] {
		background-color: #000000;
	}
	.badge[attribute|="badge-light"] {
		background-color: #FFFFFF;
		color: #000000;
	}
	.badge[attribute|="badge-secondary"] {
		background-color: #808080;
	}
	.badge[attribute|="badge-danger"] {
		background-color: #E74C3C;
	}
	.badge[attribute|="badge-success"] {
		background-color: #5CBD9D;
	}
	.badge[attribute|="badge-warning"] {
		background-color: #F29C33;
	}

	/**文字カラー　名称bootstrap準拠 */
	.text-primary {
		color: #3998DB;
	}
	.text-info {
		color: #6cb2eb;
	}
	.text-dark {
		color: #000000;
	}
	.text-light {
		color: #FFFFFF;
	}
	.text-secondary {
		color: #808080;
	}
	.text-danger {
		color: #E74C3C;
	}
	.text-success {
		color: #5CBD9D;
		/* border-bottom: solid 2px */
	}
	.text-warning {
		color: #F29C33;
	}

	/* 明細 */
	
	.box-detail {
		display: table;
		width: 1045px;
		/* height: 200px;	 */

		border: solid 1px #EEE;
		font-size: 12px;
	}
	.box-detail-thumbnail {
		display: table-cell;
		/* border: solid 1px #EEE;	 */
		background-color: var(--style-mode-production, #FFFFEE) ;
		width: 250px;
		height:150px;
		text-align:center;
		vertical-align: middle	;
	}
	.box-detail-thumbnail-empty {
		display: table-cell;
		/* border: solid 1px #EEE;	 */
		background-color: var(--style-mode-production, #FFFFEE) ;
		width: 250px;
	}
	.box-detail-card {
		display: table-cell;
		/* display: table; */
		width: 895px;
		/* width:100%; */
		vertical-align: top;
	}
	.box-detail-row {
		display: table;
		/* display: table; */
		/* width: 895px; */
		width:100%;
		/* vertical-align: top; */
	}
	.box-detail-row div {
		margin:0;
		padding:0 ;
	}
	.box-detail-row div[attribute|="emphasis"] {
		font-weight: bold !important;
		color:red;
	}



	/* @明細：ヘッダー・フッター・データ */
	th, td {
		/* override */
		height: 14px;
	}
	table {
		width : 95% ;
	}

	/* 請求明細：左揃え tdはデフォルト左揃えなので記入しない */
	table[class|="board"] th:nth-of-type(1) {
		/* text-align: left; */
	}

	/* 請求明細：センター */
	table[class|="board"] td:nth-of-type(1),
	table[class|="board"] td:nth-of-type(2),
	table[class|="separate"] td:nth-of-type(1){
		text-align: center;
	}

    /* 請求明細：右揃え */

	table[class|="board"] td:nth-of-type(3) {
        text-align: right;
    }

    /* 明細：縦罫線 */
	table[class|="board"] th:nth-of-type(1),
	table[class|="board"] th:nth-of-type(2),
	table[class|="board"] td:nth-of-type(1),
	table[class|="board"] td:nth-of-type(2) {
		border-right: 1px solid #ccc;
    }

	
</style>
@endsection