<style>
    /* A4レポート用の共通スタイルを設定 */

	/* @セレクタ[box] */
	div[class|="box"] {
		padding: 3px;
	}

	/* @表：*/
	table {
		table-layout: fixed;
		border: 1px solid #ccc;
		border-collapse: separate;
		border-spacing: 0;
		border-radius: 5px;
		width: 705px;
	}

	/* @ヘッダー：幅固定 */
	.item[attribute="fixed-width"] {
		/* 列幅固定にしてレイアウト保持 */
		overflow: hidden;
		white-space: nowrap;
		width: 290px;
	}

	/* @明細：ヘッダー */
	thead th {
		background: #eee;
	}

	/* @明細：フッター */
	tfoot th {
		border-top: 1px solid #ccc;
		overflow: hidden;
		font-weight: normal;
		text-align: right;
	}
	
	/* @明細：ヘッダー・フッター・データ */
	th, td {
		padding: 4px;
		font-size: 12px;
		height: 28px;
	}

	/* @明細：各行 */
	td {
		/* 行間線 */
		border-top: 1px solid #ccc;
	}

    /* @各項目：*/
	.item {
		margin: 3px;
		background-color: var(--style-mode-production, white);
	}

	/* @各項目：文字数が多いver */
	.cell {
		font-size: 10px;
		max-height: 28px;
		overflow: hidden;
	}

	/* @明細：偶数列のスタイル */
	td:nth-child(even) {
		/* 偶数列の背景色(デバッグ用) */
		background-color: var(--style-mode-production, #eee);
	}

	/* @ヘッダーの左側：角を丸める設定 */
	thead th:first-child {
		border-radius: 5px 0 0 0;
	}

	/* @ヘッダーの右側：角を丸める設定 */
	thead th:last-child {
		border-radius: 0 5px 0 0;
	}
</style>