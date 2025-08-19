<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', config('app.name', 'SignMis'))</title>

    <link rel="stylesheet" href="{{ asset(mix('css/report.css')) }}">
    <script src="{{ asset(mix('js/report.js')) }}" defer></script>

    <script>
        window.Laravel = {
            csrfToken: "{{ csrf_token() }}"
        };
    </script>    
</head>
<body>
    @isset($isView)
		@include('layouts.app_report_style_mode_change')
	@endisset

    @yield('content')
</body>
</html>

<style>
    .sheet {
        /* プレビュー用 */
        @isset($isView)
            /* 用紙サイズ:A4[270mm x 210mm] 余白:上下左右 10mm */
            /* ブラウザの環境差異を考慮して高さに0.1mm余裕をもたせる */
            height: 296.9mm;
            width: 210mm;
            padding: 10mm 10mm;

            /* ドロップシャドウ */
            box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
            margin: 5mm auto;
        @endisset
    }
</style>

@include('layouts.app_report_a4_style')
@yield('style-scoped')