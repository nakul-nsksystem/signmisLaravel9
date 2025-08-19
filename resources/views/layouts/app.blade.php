<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'SignMis') }}</title>
    <!-- <link rel="shortcut icon" href="{{ asset('/favicon.ico') }}"> -->
    <link rel="shortcut icon" href="{{ asset(config('app.favicon', 'favicon.ico')) }}">
    
    <!-- Scripts -->
    @yield('js-header') 

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel ="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <!-- Styles -->
    <link href="{{ asset(mix('css/app.css')) }}" rel="stylesheet">
    <link href="{{ asset(mix('css/custom.css')) }}" rel="stylesheet">
    @yield('css') 

    <script>
        window.Laravel = {
            csrfToken: "{{ csrf_token() }}"
        };
    </script>    
</head>
<body class="bg-dark  text-white">
    @yield('layout-body')    

    <script src="{{ asset(mix('js/manifest.js')) }}"></script>
    <script src="{{ asset(mix('js/vendor.js')) }}"></script>
    <script src="{{ asset(mix('js/app.js')) }}"></script>

    @yield('js-footer') 
</body>
</html>
