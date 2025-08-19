@extends('layouts.app_aft_login')

@section('js-header') 
@endsection

@section('css') 
@endsection

@section('content')
<example-component></example-component>
<sample-vue-comp1 :a="5"></sample-vue-comp1>
<contents-component></contents-component>
@endsection

@section('js-footer')
<div id="vue1">
    <input type="text" v-model="aa" >
</div>
<script>
    let bb = 5 ;
    console.assert(typeof Vue !== 'undefined') ; 
    console.log(Vue) ; 
    console.log(axios) ; 
    
    var vm = new Vue({
        el : "#vue1" ,
        data : {
            aa : "11111111" ,
        }
    }) ; 



</script>
@endsection
