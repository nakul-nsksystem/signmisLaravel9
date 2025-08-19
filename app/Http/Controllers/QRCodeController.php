<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Log;

class QRCodeController extends Controller
{
	// QRコード生成
	public function generate($qrcode) {
		// 引数からQRコード(SVG形式)を生成 + Base64化
		return base64_encode(\QrCode::generate($qrcode)) ;
	}

	// QRコード生成(発注用)
	public function generateQRCode4TPOrder($qrcode) {
		// 引数から発注用のQRコード(SVG形式)を生成 + Base64化
		// $apiUrl = url('') . "#/t_p_order/qr/" . $qrcode ;
		// $src = base64_encode(\QrCode::generate($apiUrl)) ;
		
		//改訂版　QR発注が材料明細idのみで対応
		$src = base64_encode(\QrCode::generate($qrcode)) ;


		// API Tester表示用(イメージを表示する場合はpreviewにして確認)
		// return response('<img src="data:image/svg+xml;base64, ' . $src . '">');
		// API Tester表示用(SVGを表示する場合はpreviewにして確認)
		// return \QrCode::generate($apiUrl); 
		return $src;
	}

	// QRコード生成(施工実績入力)
	public function generateQRCode4TProjectConstruction($qrcode) {
		// 引数から発注用のQRコード(SVG形式)を生成 + Base64化
		$apiUrl = url('') . "#/t_project/construction_result/" . $qrcode ;
		$src = base64_encode(\QrCode::generate($apiUrl)) ;
		
		// API Tester表示用(イメージを表示する場合はpreviewにして確認)
		// return response('<img src="data:image/svg+xml;base64, ' . $src . '">');
		// API Tester表示用(SVGを表示する場合はpreviewにして確認)
		// return \QrCode::generate($apiUrl);
		return $src;
	}
	// QRコード生成(物件)
	public function generateQRCode4TProject($qrcode) {
		// 引数から発注用のQRコード(SVG形式)を生成 + Base64化
		$apiUrl = url('') . "#/t_project/edit/" . $qrcode ;
		$src = base64_encode(\QrCode::generate($apiUrl)) ;
		
		// API Tester表示用(イメージを表示する場合はpreviewにして確認)
		// return response('<img src="data:image/svg+xml;base64, ' . $src . '">');
		// API Tester表示用(SVGを表示する場合はpreviewにして確認)
		// return \QrCode::generate($apiUrl);
		return $src;
	}

	// QRコード生成(物件)
	public function generateQRCode4TProjectDelivery($qrcode) {
		// 引数から発注用のQRコード(SVG形式)を生成 + Base64化
		$apiUrl = url('') . "#/api_throw/delivery_comp_qr/" . $qrcode ;
		$src = base64_encode(\QrCode::generate($apiUrl)) ;
		
		// API Tester表示用(イメージを表示する場合はpreviewにして確認)
		// return response('<img src="data:image/svg+xml;base64, ' . $src . '">');
		// API Tester表示用(SVGを表示する場合はpreviewにして確認)
		// return \QrCode::generate($apiUrl);
		return $src;
	}

}