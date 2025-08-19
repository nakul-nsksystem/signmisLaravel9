<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SamplesController extends Controller
{
	//
	public function dragfiles() {
		return view('samples.dragfiles');
	}

	public function vue($num){
		
		return view("samples.vue{$num}" );
	}

}