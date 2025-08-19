<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DemopdfController extends Controller
{
	//
	public function pdf_gen() {
		$pdf = \PDF::loadView('demopdf_gen');
		
		//return $pdf->download("test.pdf") ; 
		// PDF出力
		return $pdf->stream();
		// Html出力
		//return view('demopdf_gen');
	}

}