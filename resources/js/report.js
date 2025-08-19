function StyleModeChange() {
	// css変数を読み込む
	const rootstyle = document.documentElement.style.getPropertyValue('--style-mode-production');

	if (!rootstyle || rootstyle == 'transparent') {
		// スタイルを消去して開発確認用に設定
		document.documentElement.style.setProperty('--style-mode-production', 'unset');
	} else {
		// スタイルをリリース用に設定(transparent:透明)
		document.documentElement.style.setProperty('--style-mode-production', 'transparent');
	}
}
