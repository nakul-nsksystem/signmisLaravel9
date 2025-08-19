@extends('layouts.app_aft_login')

@section('content')
<!-- <v-app :user="{{Auth::user()}}"></v-app> -->
<?php 
    $custName = config("app.customer_key") ; 
?>
<v-app 
    :app-name="'{{ config('app.name', 'SignMis') }}'"
    :csrf="'{{ csrf_token() }}'"
    :root-url="'{{url('/')}}'"
    :customer-key="'{{$custName}}'"
    :company-logo="'{{config('app.logo_svg', 'img/company-logo.svg')}}'"
    :company-logo-width="{{config('app.logo_width', '38')}}"
    :company-logo-height="{{config('app.logo_height', '38')}}"
    >
    
</v-app>
    

@endsection
