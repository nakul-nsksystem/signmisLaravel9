<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', 'HomeController@index')->name('home')->middleware('auth');
// Route::get('/home', 'HomeController@index')->name('home')->middleware('auth');

//Auth::routes();
//Auth::routes(['register' => false ,"login" => false ,"verity" => false]);


// Route::get('password/reset', 'Auth\ForgotPasswordController@showLinkRequestForm')->name('password.request') ;
// Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email') ;
Route::get('password/reset/{token}', 'Auth\ResetPasswordController@showResetForm')->name('password.reset') ;
Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.update') ;


// PDF出力
Route::get('demopdf/demopdf_gen', 'DemopdfController@pdf_gen')->name('demopdf_gen.index');

// File Drag
Route::get('samples/dragfiles', 'SamplesController@dragfiles');

// Vue
Route::get('samples/vue/{num}', 'SamplesController@vue');

// Project
Route::get('t_project/edit/{id?}' , 'TProjectController@edit')->name("t_project.edit") ;

// QRCode
Route::get('qrcode/generate/{qrcode}', 'QRCodeController@generate');
Route::get('qrcode/generate_tporder/{qrcode}', 'QRCodeController@generateQRCode4TPOrder');

// Route::get('/v/{any?}', function () {
//     return view('home');
// })->where('any', '.*');

Route::get('/{any?}', function () { 
    return view('home');
})->where('any', '.*');
