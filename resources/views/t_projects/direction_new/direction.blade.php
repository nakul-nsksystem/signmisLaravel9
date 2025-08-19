@extends('layouts.app_report_a4')
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

	$height_param = 0 ; /**改ページ用高さパラメータ 各要素の高さmm数を参考に算出 */

	function isBreakPageByHeight ($param){
		/**総高さ297mm 印刷用マージン30*/

		if($param > 267 ) return true ;
	}

@endphp

@section('content')
	{{-- ヘッダー --}}	
	@include('t_projects.direction_new.direction_header', [$header, 'isFirst'=>TRUE])

	@php
		/**改ページ用定数
		*物件名から客先担当行まで 25
		*最短納期行 7
		*納期ヘッダー・顧客情報表ヘッダー＆行 6
		*納品情報行 10
		*上マージン 10
		*下マージン 2
		*/
		
		$titleConst 	  		= 25 ;
		$minDeliRowConst  		= 7 ;
		$headerRowConst   		= 6 ;
		$deliveryRowConst 	    = 10 ;
		$titleTopMarginConst 	= 10 ;
		$titleBottomMarginConst = 2 ;

		/**初期値 指示書と書いてあるタイトル部分+顧客情報2行 */
		$height_param += $titleConst  ;

		/**納品情報 */
		if(count($header->TProjectDeliveries)) {
			/**ヘッダー部分合算 */
			$height_param += $minDeliRowConst + $headerRowConst + $deliveryRowConst * count($header->TProjectDeliveries) + $titleBottomMarginConst ;
			
		} else {
			/**納品情報デフォルト値 */
			$height_param += $minDeliRowConst + $headerRowConst ;
		}

		/**顧客情報行を追加 */
		$height_param += $headerRowConst * 2 ;

		/**マージン分を追加 */
		$height_param += $titleTopMarginConst + $titleBottomMarginConst  ;


	@endphp

	{{-- 明細 --}}
	@forelse ($details as $item)
		@php
			/**改ページ用定数
			*商品エリアマージン 5
			*商品名納期行 7
			*納期行 7
			*商品区分・寸法・伸ばし・バッジエリア 15
			*工程各行 4.5
			*サムネイル 40
			*分割・板割タイトル＋重ねしろ行 6
			*分割板割表各行 6
			*分割図 32
			
			*合計最低値 117 ( 45 + (工程各行*4) ) */

			$productMarginConst = 3 ;
			$productTitleConst = 9 ;
			$productDlvConst = 8 ;
			$productInfoConst = 15 ;
			$processConst = 4.5 ;
			$thumbnailConst = 40 ;
			$sepTitleConst = 6 ;
			$tableConst = 6 ;
			$sepSvgConst = 32 ;

			$detailHeight = 0 ;

			$minHeight = $thumbnailConst + ($productMarginConst * 2);

			/**上下マージン */
			$detailHeight = $productMarginConst * 2 ;
			/**商品名 */
			$detailHeight += $productTitleConst ;

			/**納期数から高さ取得 */
			if(count($item->TProjectDeliveries) > 0) {
				$detailHeight += $productDlvConst * count($item->TProjectDeliveries) ;
			} 

			/**商品情報行を追加 */
			$detailHeight += $productInfoConst ;

			/**制作担当者行 */
			if(isset($item->operator_m_user_id)) $detailHeight += 6;
			
			/**工程数・備考から工程の高さパラメータを取得*/
			$processHeight = 0 ;			
			foreach($item->TProjectProductProcesses as $process) {
				if($process->is_enabled) {
					if(isset($process->memo)) $processHeight += $processConst ;

					for ($i = 1; $i <= 9; $i++) {
						$displayName = 'display_' . str_pad($i, 2, 0, STR_PAD_LEFT); 

						if(isset($process[$displayName])) $processHeight += $processConst ;
					}
				}
			}
			$detailHeight += $processHeight ;
			
			
			/**分割板割デフォルト値 9(padding) */
			$sepHeight = 0 ;
			$layoutHeight = 0 ;

			/**分割があるかどうか */
			$isSep = $item->num_of_sep_w >= 2 || $item->num_of_sep_h >= 2  ;
			
			if($isSep){
				/**テーブル部分と　画像部分の高い方の値を取得 */

				$sepLeftPart = $productMarginConst + $sepTitleConst + $tableConst + ($tableConst * count($item->TProjectProductSeparates)); 
				$sepHeight =  $sepSvgConst > $sepLeftPart  ?  $sepSvgConst : $sepLeftPart;
			}

			if(count($item->TProjectProductBoardlayouts)){
				/**板割pタグ + th + td * 行数 */
				$layoutHeight = $productMarginConst + $sepTitleConst + $tableConst + ($tableConst * count($item->TProjectProductBoardlayouts)) ;
			}

			$detailHeight += ( $sepHeight + $layoutHeight );
			
			
			/**現在設定されている高さパラメータが150(サムネイル分の高さ)に満たないかつサムネイルが設定されている場合 */
			if($detailHeight < $minHeight && isset($item->t_project_file_id)) $detailHeight = $minHeight ;

			$height_param += $detailHeight ;

		@endphp
		{{-- 改ページ判定 --}}
		@if (isBreakPageByHeight($height_param))
		
			@include('t_projects.direction_new.direction_footer', [$header, 'isLast'=>false])

			{{-- ヘッダー --}}
			@include('t_projects.direction_new.direction_header', [$header, 'isFirst'=>FALSE])
			@php
				$height_param = ( $titleConst + $titleBottomMarginConst ) + $detailHeight;
			@endphp
		@endif
		{{-- 1行単位で出力 --}}
		@include('t_projects.direction_new.direction_detail', [$item])
			
	@empty
	@endforelse

	{{-- フッター --}}
	@include('t_projects.direction_new.direction_footer', [$header, 'isLast'=>TRUE])

@endsection

@section('style-scoped')
<style>

	/* @セレクタ[box] */
	div[class|="box"] {
		/*padding: 3px;*/
		/*0421追加*/
		padding-top: 2px;
		padding-bottom: 2px;
	}



	/* タイトル[タイトル] */
	.box-title-label {
		background-color: var(--style-mode-production, #E6E6FA);
		font-size: 22px;
		/* font-weight: bold; */
		/* letter-spacing: 0.08rem; */
		text-align: right;
	}

	/* タイトル[ページ] */
	.box-title-page {
		background-color: var(--style-mode-production, #F0FFFF);
		/*font-size: 9px;*/
		text-align: right;
		/*0421追加*/
		font-size: 8px;
		padding: 0 !important;
	}

	.box-title-left {
		background-color: var(--style-mode-production, #F0FFFF);
		/* vertical-align: bottom; */
		/*0421追加*/
		text-align: right;
		font-size: 14px;
		padding: 0 !important;
		font-weight: 300;
	}

	/* item override：*/
	.item-underline {
		margin: 3px;
		border-bottom: 1px solid #EEE;
		padding-bottom: 3px !important;
		background-color: var(--style-mode-production, white);
	}

	/* ヘッダー */
	.box-row {
		display: table;
		/*0421追加*/
		width: 719px;
		background-color: var(--style-mode-production, #F8F8FF);
		font-size: 12px;
		/* margin-bottom:2px; */
	}

	/* ヘッダー */
	.box-col-1 {
		display: table-cell;
		/*width:8% ;*/
		/*0421追加*/
		width: 10%;
		/*background-color: var(--style-mode-production, #FFFFEE) ;*/
	}

	.box-col-2 {
		display: table-cell;
		width: 16%;
		/*background-color: var(--style-mode-production, #F0FFFF) ;*/
	}

	.box-col-3 {
		display: table-cell;
		width: 28%;
		/*background-color: var(--style-mode-production, #FFFFEE) ;*/
	}

	.box-col-4 {
		display: table-cell;
		/*width:32% ;*/
		width: 37%;
		/*background-color: var(--style-mode-production, #F0FFFF) ;*/
		/*0421追加*/
		letter-spacing: -0.02rem;
	}

	.box-col-5 {
		display: table-cell;
		width: 40%;
		background-color: var(--style-mode-production, #F0FFFF);
		vertical-align: top;

	}

	.box-col-6 {
		display: table-cell;
		width: 50%;
		/*background-color: var(--style-mode-production, #F0FFFF) ;*/
		vertical-align: top;

	}

	.box-col-7 {
		display: table-cell;
		width: 66%;
		background-color: var(--style-mode-production, #F0FFFF);
		vertical-align: top;

	}
	.box-col-8 {
		display: table-cell;
		width: 66%;
		background-color: var(--style-mode-production, #F0FFFF);
		vertical-align: top;
	}
	.box-col-9 {
		display: table-cell;
		width: 75%;
		background-color: var(--style-mode-production, #F0FFFF);
		vertical-align: top;
	}
	.box-col-10 {
		display: table-cell;
		width: 83%;
		background-color: var(--style-mode-production, #F0FFFF);
		vertical-align: top;
	}

	.box-col-12 {
		display: table-cell;
		width: 100%;
		/*background-color: var(--style-mode-production, #F0FFFF) ;*/
		/* border-bottom: solid 1px #EEE; */

	}

	.box-row label {
		/*font-weight: bold !important;*/
		font-size: 10px;
		/*0421追加*/
		font-size: 12px;
	}

	.emphasis {
		font-weight: bold !important;
		color: red;
	}

	.emphasis2 {
		font-weight: bold !important;
		color: red;
		font-size: 13.5px;
		display: inline-block;
		padding-top: 3px;
		padding-bottom: 3px;
		padding: 2px 3.3px;

	}

	.product {
		/*background-color: var(--style-mode-production, #F0FFFF) ;*/
		font-weight: bold !important;
		/*0421追加*/
		font-size: 18px;
	}

	.productQty {
		/*background-color: var(--style-mode-production, #F0FFFF) ;*/
		font-weight: bold !important;
		/* font-size: 16px; */
		/* font-size: 14px; */
		/* float: right; */
		font-size:18px
		margin-left: 10px
	}

	.right {
		float: right;
		margin-left: 10px
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
		/*0421追加*/
		color: #2F9551;
	}

	.text-warning {
		color: #F29C33;
	}

	/* 明細 */

	.box-detail {
		display: table;
		/*0421追加*/
		width: 719px;
		border-bottom: 1px solid #EEE;
		font-size: 12px;
	}

	.box-detail-thumbnail {
		display: table-cell;
		/* width: 250px; */
		width: 15%;
		height:150px;
		text-align: center;
		/*0421追加*/
		padding-top: 12px !important;
	}

	.box-detail-thumbnail-empty {
		display: table-cell;
		/* border: solid 1px #EEE;	 */
		/*background-color: var(--style-mode-production, #FFFFEE) ;*/
		/* width: 250px; */
		width: 15%;
	}

	.box-detail-card {
		display: table-cell;
		width: 85%;
		/* width: 700px; */
		vertical-align: top;

	}

	.box-detail-row {
		display: table;
		/* width: 895px; */
		width: 100%;
		/* vertical-align: top; */
	}

	.box-detail-row div {
		margin: 0;
		padding: 0;
	}

	.box-detail-row div[attribute|="emphasis"] {
		font-weight: bold !important;
		color: red;
	}


	/* @明細：ヘッダー・フッター・データ */
	th,
	td {
		/* override */
		height: 14px;
	}

	table {
		/*0421追加*/
		width: 100%;
		border-radius: initial;
	}

	/* 請求明細：左揃え tdはデフォルト左揃えなので記入しない */
	table[class|="board"] th:nth-of-type(1) {
		/* text-align: left; */
	}

	/* 請求明細：センター */
	table[class|="board"] td:nth-of-type(1),
	table[class|="board"] td:nth-of-type(2),
	table[class|="separate"] td:nth-of-type(1) {
		text-align: center;
	}

	/* 請求明細：右揃え */

	table[class|="board"] td:nth-of-type(3) {
		text-align: center;
	}

	/* 明細：縦罫線 */
	table[class|="board"] th:nth-of-type(1),
	table[class|="board"] th:nth-of-type(2),
	table[class|="board"] td:nth-of-type(1),
	table[class|="board"] td:nth-of-type(2) {
		border-right: 1px solid #ccc;
	}


	/*----------0421追加---------*/

	/*ページ番号*/
	.page {
		position: absolute;
		white-space:nowrap;
		right: 10mm;
		top: 8mm;
		font-size: 10px;
		font-weight: 100;
	}

	/*物件情報 左揃え*/
	.box-col-3-3 label {
		display: inline-block;
		width: 35%;
	}


	.box-detail-row .box-col-1 {
		padding-left: 7px;
	}
	/*商品情報-表の背景色交互*/
	.proccess_info {
		margin: 3px;
	}
	/*商品情報-表の背景色交互*/
	.proccess_info .box-detail-row:nth-child(2n) {
		background-color: #F3F3F3;
		/*padding-left: 7px!important;*/
		box-sizing: border-box;
	}

	.proccess_info .box-detail-row:nth-child(2n+1) {
		/*padding-left: 7px!important;*/
		background-color: #FBFBFB;
		box-sizing: border-box;
	}

	/*商品情報-表の余白*/
	.proccess_info .box-detail-row {
		padding: 1.6px;
	}

	/*物件情報*/
	.box-title2 {
		font-size: 15.5px;
		font-weight: 600;
		border-bottom: 1px solid #707070a6;
		margin-bottom: 2px;
		padding-bottom: 4px;
	}

	/*納品情報-タイトル*/
	.box-row .box-row1 label {
		font-size: 15.5px;
		font-weight: 600;
	}

	.box-row .box-row1 {
		margin-top: 8px;
		margin-bottom: 2px;
	}

	/*納品情報-表タイトル*/
	.box-row.box-row2 {
		background: #115D9D;
		color: white;
		padding-left: 12px;
		box-sizing: border-box;
	}

	/*納品情報-表余白*/
	.box-row3 .box-row {
		padding: 2px !important;
		padding-bottom: 3px !important;
	}

	/*最短納期*/
	.box-col-3.box-col-3-1 {
		background: #093A62;
		color: white !important;
		width: 22%;
	}

	.emphasis2 {
		color: white;
		margin-right: 11px;
	}

	.box-row.box-row4 {
		padding: 0;
	}

	/*納品情報-表背景色*/
	.dlv_infos .box-row:nth-child(2n) {
		background-color: #F3F3F3;
		box-sizing: border-box;
	}

	.dlv_infos .box-row:nth-child(2n+1) {
		background-color: #FBFBFB;
		box-sizing: border-box;
	}

	/*受注日・客先注文No.上余白*/
	.box-row5 {
		margin-top: 6px;
	}

	/*商品一覧*/
	div#detailCard {
		/* padding-top: 2.5mm;
		padding-bottom: 2.5mm; */
	}

	.box-detail1 {
		margin-top: 30px;
		border-top: solid 1px #70707096;
	}



	/*商品情報ボックス左余白あける*/
	.box-detail-card {
		/* padding-left: 23px; */
	}


	/*配達方法*/
	.item.item1 span {
		border: 2px solid;
		padding: 2px 5px;
		font-weight: bold;

	}

	/*納期*/
	.item.item1 span.emphasis {
		border: 2px solid #115D9D;
		color: #115D9D;
		margin-left: 1.5px;
	}

	/*商品数*/
	span.productQty .emphasis {
		font-size: 22px !important;
	}

	/*商品情報下の余白あける*/
	.box-col-3.box-col-3-2 {
		/* margin-bottom: 13px; */
		font-weight: 500;
	}

	/*商品情報の表*/
	thead th {
		background: #093a62;
		color: white;
		border-radius: 0px !important;
		font-weight: 500;
	}

	/*ページ上部装飾*/
	img.top_img {
		/* margin-top:6mm; */
		width: 100%;
		/* height: 15mm; */
	}
	/*板割タイトル*/
	.box-detail-row p {
		margin-bottom: 4px;
		font-size: 12.5px;
		font-weight: bold;
	}

	/*分割・重ね代*/
	.box-col-6-1 {
		font-weight: bold;
	}
	/** */
	.sepOrBLDiv {
		margin-top:10px !important;
	}


	.svg {
		display: inline-block;
  		background-repeat: no-repeat;
	}

	.project_name {
		font-size: 18px;
		font-weight: 600;
		border-bottom:solid 1px  #EEE;
		padding-bottom: 2px;
		margin-bottom:15px ;
		white-space:nowrap ;
		overflow:hidden;
		text-overflow:ellipsis;
		max-width: 472px;
		
	}
	.header-border {
		border-bottom:1px solid #EEE;
		margin-top:6px
	}

</style>
@endsection