<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('auth/user', function (Request $request) {
    return $request->user()->getInfo();
});

Route::group(['middleware' => ['api']], function () {

    Route::prefix('auth')->group(function () {
        Route::post('/login', "Auth\LoginController@login");
        Route::post('/logout', "Auth\LoginController@logout");
        Route::post('/reset', 'Auth\ForgotPasswordController@sendResetLinkEmail');
    });
});

Route::group(['middleware' => ['auth:sanctum', "api"]], function () {

    Route::resource('mBranch', 'Api\MBranchApiController');
    Route::resource('mCalendar', 'Api\MCalendarApiController');
    Route::resource('mMatrix', 'Api\MMatrixApiController');
    Route::resource('mMaterial', 'Api\MMaterialApiController');
    Route::resource('mRole', 'Api\MRoleApiController');
    Route::resource('mRoleKey', 'Api\MRoleKeyApiController');
    Route::resource('mRoleKeyCategory', 'Api\MRoleKeyCategoryApiController');
    Route::resource('mTag', 'Api\MTagApiController');
    Route::resource('mTagCategory', 'Api\MTagCategoryApiController');
    Route::resource('mTax', 'Api\MTaxApiController');
    Route::resource('mUser', 'Api\MUserApiController');
    Route::resource('mValidate', 'Api\MValidateApiController');

    Route::resource('smOption', 'Api\SmOptionApiController');
    Route::resource('smUserOption', 'Api\SmUserOptionApiController');
    // 個別設定からtProjectを取得 home画面で使用
    Route::post('tProject/findBySmUserOptions', 'Api\TProjectApiController@findBySmUserOptions')
        ->name("api.tProject.findBySmUserOptions");

    Route::get('mUserOption/findByMUserId/{mUserId?}', 'Api\MUserOptionApiController@findByMUserId');
    Route::post('mUserOption/updateOrCreateOptions', 'Api\MUserOptionApiController@updateOrCreateOptions')
        ->name("api.mUserOption.updateOrCreateOptions");
    Route::resource('mUserOption', 'Api\MUserOptionApiController');

    Route::get('mUser/findByMTag/{mTagId?}', 'Api\MUserApiController@findByMTag');

    Route::get(
        'tProjectConstruction/searchByYm/{year}/{mon}',
        'Api\TProjectConstructionApiController@searchByYm'
    )
        ->name("api.tProjectConstruction.searchByYm");

    Route::get('tProjectConstruction/showWithResults/{id}', 'Api\TProjectConstructionApiController@showWithResults')
        ->name("api.tProjectConstruction.showWithResults")
        ->where('id', '[0-9]+');

    Route::get('tProjectDelivery/showWithResults/{id}', 'Api\TProjectDeliveryApiController@showWithResults')
        ->name("api.tProjectDelivery.showWithResults")
        ->where('id', '[0-9]+');

    Route::get('mKvCategory', 'Api\MKvCategoryApiController@index')
        ->name("api.mKvCategoryApiController.index");

    Route::get(
        'mKvCategory/byKey/{key}',
        'Api\MKvCategoryApiController@indexByKvKey'
    )
        ->name("api.mKvCategoryApiController.indexByKvKey");

    Route::get('mBranch', 'Api\MBranchApiController@index')
        ->name("api.mBranch.index");
    Route::get('mCustomer/fBaN/{mBranchId?}/{dealingMKvId?}/{input?}', 'Api\MCustomerApiController@findByBrancheAndName')
        ->name("api.mCustomer.findByBrancheAndName")->where('mBranchId', '[0-9]+');
    Route::get('mCustomer/fBaA/{mBranchId?}/{dealingMKvId?}/{searchColumn?}/{input?}', 'Api\MCustomerApiController@findByBrancheAndAnykey')
        ->name("api.mCustomer.findByBrancheAndAnykey")->where('mBranchId', '[0-9]+');
    Route::get('mCustomer/fBaD/{mBranchId}/{dealingMKvId}', 'Api\MCustomerApiController@findByBrancheAndDealingMKvId')
        ->name("api.mCustomer.findByBrancheAndDealingMKvId");
    Route::post('mCustomer/findByIds', 'Api\MCustomerApiController@findByIds')
        ->name("api.mCustomer.findByIds");
    //取引先csv
    Route::post('mCustomer/exportCsv', 'Api\MCustomerApiController@exportCsv')
        ->name("api.mCustomer.exportCsv");

    Route::get('mCustomerPerson/findByMCustomerId/{mCustomerId?}', 'Api\MCustomerPersonApiController@findByMCustomerId');

    // 材料
    Route::get('mMaterialDetail/findByMMaterialId/{mMaterialId}', 'Api\MMaterialDetailApiController@findByMMaterialId')
        ->name("api.mMaterialDetail.findByMMaterialId")
        ->where('mMaterialId', '[0-9]+');
    Route::get('mMaterialDetail/showWithParent/{id}/{isIvt?}', 'Api\MMaterialDetailApiController@showWithParent')
        ->name("api.mMaterialDetail.showWithParent");
    Route::post('mMaterialDetail/retrieveWithParent', 'Api\MMaterialDetailApiController@retrieveWithParent')
        ->name("api.mMaterialDetail.retrieveWithParent");
    Route::resource('mMaterialDetail', 'Api\MMaterialDetailApiController');

    Route::post('mMaterial/retrieve', 'Api\MMaterialApiController@retrieve')
        ->name("api.mMaterial.retrieve");
    Route::post('mMaterial/retrieveWithDetails', 'Api\MMaterialApiController@retrieveWithDetails')
        ->name("api.mMaterial.retrieveWithDetails");
    Route::post('mMaterial/findByIds', 'Api\MMaterialApiController@findByIds')
        ->name("api.mMaterial.findByIds");
    //材料csv
    Route::post('mMaterialDetail/exportCsv', 'Api\MMaterialDetailApiController@exportCsv')
        ->name("api.mMaterialDetail.exportCsv");


    Route::post('mCustomer/retrieve',  'Api\MCustomerApiController@retrieve')
        ->name("api.mCustomer.retrieve");

    Route::post('mCalendar/retrieve',  'Api\MCalendarApiController@retrieve')
        ->name("api.mCalendar.retrieve");
    Route::post('mCalendar/getByRange',  'Api\MCalendarApiController@getByRange')
        ->name("api.mCalendar.getByRange");

    Route::post('tProductionDay/searchByDay',  'Api\TProductionDayApiController@searchByDay')
        ->name("api.tProductionDay.searchByDay");

    Route::get('tProject/findByUserId/{mUserId}', 'Api\TProjectApiController@findByUserId')
        ->name("api.tProject.findByUserId")
        ->where('mUserId', '[0-9]+');

    /**物件出力系 */
    // 見積書出力
    Route::get('tProject/createEstimate/{id}/{view?}', 'Api\TProjectApiController@createEstimate');

    // 下げ札出力
    Route::get('tProject/createHungTag/{id}/{view?}', 'Api\TProjectApiController@createHungTag');

    // 指示書出力
    Route::get('tProject/createDirection/{id}/{view?}', 'Api\TProjectApiController@createDirection');
    Route::get('tProject/createDirectionNew/{id}/{view?}', 'Api\TProjectApiController@createDirectionNew');

    // 現場指示書
    // Route::get('tProject/createConstructionDirection/{id}/{view?}', 'Api\TProjectApiController@createConstructionDirection') ;
    Route::get('tProjectConstruction/createConstructionDirection/{id}/{view?}', 'Api\TProjectConstructionApiController@createConstructionDirection');
    Route::get('tProjectDelivery/createConstructionDirection/{id}/{view?}', 'Api\TProjectDeliveryApiController@createConstructionDirection');

    // 物件を売上完了
    Route::post('tProject/salesComplete',  'Api\TProjectApiController@salesComplete')
        ->name("api.tProject.salesComplete");

    //見積承認
    Route::get('tProject/approveEst/{id}/{type}',  'Api\TProjectApiController@approveEst');

    Route::post('tProject/retrieve',  'Api\TProjectApiController@retrieve')
        ->name("api.tProject.retrieve");

    Route::post('tProject/retrieve4TProducts',  'Api\TProjectApiController@retrieve4TProducts')
        ->name("api.tProject.retrieve4TProducts");

    Route::post('tProject/retrieve4Production',  'Api\TProjectApiController@retrieve4Production')
        ->name("api.tProject.retrieve4Production");

    Route::get('tProjectProduct/{tProjectProductId?}',  'Api\TProjectProductApiController@show')
        ->name("api.tProjectProduct.show");

    Route::post('tProjectProduct/getByIds4copy',  'Api\TProjectProductApiController@getByIds4copy')
        ->name("api.tProjectProduct.getByIds4copy");

    Route::post('tProjectDelivery/getByIds4copy',  'Api\TProjectDeliveryApiController@getByIds4copy')
        ->name("api.tProjectDelivery.getByIds4copy");

    Route::resource('tProjectProductProcess', 'Api\TProjectProductProcessApiController');
    Route::post('tProjectProductProcess/searchByMProduction',  'Api\TProjectProductProcessApiController@searchByMProduction')
        ->name("api.tProjectProductProcess.searchByMProduction");

    Route::post('tProjectProductProcess/searchRemains',  'Api\TProjectProductProcessApiController@searchRemains')
        ->name("api.tProjectProductProcess.searchRemains");

    Route::post('tProjectProductProcess/checkUpdatedAt',  'Api\TProjectProductProcessApiController@checkUpdatedAt')
        ->name("api.tProjectProductProcess.checkUpdatedAt");

    Route::post('tProjectProductProcess/get4updateCost',  'Api\TProjectProductProcessApiController@get4updateCost')
        ->name("api.tProjectProductProcess.get4updateCost");

    Route::post('tProjectProductProcess/updateList',  'Api\TProjectProductProcessApiController@updateList')
        ->name("api.tProjectProductProcess.updateList");

    // 発注連動用
    Route::post('tProjectProductProcess/retrieveWithTPOrderDetails',  'Api\TProjectProductProcessApiController@retrieveWithTPOrderDetails')
        ->name("api.tProjectProductProcess.retrieveWithTPOrderDetails");

    // 納品予定リスト
    Route::post('tProjectDelivery/changeByDeliveryList',  'Api\TProjectDeliveryApiController@changeByDeliveryList')
        ->name("api.tProjectDelivery.changeByDeliveryList");
    Route::post('tProjectDelivery/retrieve',  'Api\TProjectDeliveryApiController@retrieve')
        ->name("api.tProjectDelivery.retrieve");
    Route::post('tProjectDelivery/sendMail',  'Api\TProjectDeliveryApiController@sendMail')
        ->name("api.tProjectDelivery.sendMail");

    Route::get('tProjectDelivery/searchByYm/{year}/{mon}', 'Api\TProjectDeliveryApiController@searchByYm')
        ->name("api.tProjectDelivery.searchByYm");

    Route::get('tProjectDelivery/completeByQr/{id}', 'Api\TProjectDeliveryApiController@completeByQr')
        ->name("api.tProjectDelivery.completeByQr");

    // 納品集計
    Route::post('tProjectDelivery/retrieve4Summary',  'Api\TProjectDeliveryApiController@retrieve4Summary')
        ->name("api.tProjectDelivery.retrieve4Summary");

    Route::post('tProjectMail/getInfoByEml',  'Api\TProjectMailApiController@getInfoByEml')
        ->name("api.tProjectMail.getInfoByEml");
    Route::post('tProjectMail/deleteWithFiles',  'Api\TProjectMailApiController@deleteWithFiles')
        ->name("api.tProjectMail.deleteWithFiles");
    Route::post('tProjectMail/deleteOnlyMail',  'Api\TProjectMailApiController@deleteOnlyMail')
        ->name("api.tProjectMail.deleteOnlyMail");

    Route::get('tProjectFile/dropboxTest',  'Api\TProjectFileApiController@dropboxTest');
    Route::post('tProjectFile/saveFile',  'Api\TProjectFileApiController@saveFile')
        ->name("api.tProjectfile.saveFile");
    Route::post('tProjectFile/deleteFile',  'Api\TProjectFileApiController@deleteFile')
        ->name("api.tProjectfile.deleteFile");
    Route::post('tProjectFile/deleteTempFile',  'Api\TProjectFileApiController@deleteTempFile')
        ->name("api.tProjectfile.deleteTempFile");
    Route::post('tProjectFile/updateFile',  'Api\TProjectFileApiController@updateFile')
        ->name("api.tProjectfile.updateFile");
    Route::post('tProjectFile/downloadFile',  'Api\TProjectFileApiController@downloadFile')
        ->name("api.tProjectfile.downloadFile");
    Route::get('tProjectFile/getAccessToken',  'Api\TProjectFileApiController@getAccessToken');

    Route::post('tPOrderDetail/retrieveWithParent',  'Api\TPOrderDetailApiController@retrieveWithParent')
        ->name("api.tPOrderDetail.retrieveWithParent");
    Route::post('tPOrder/retrieveWithDetails',  'Api\TPOrderApiController@retrieveWithDetails')
        ->name("api.tPOrder.retrieveWithDetails");

    Route::post('tPOrderDetail/retrieve4Summary',  'Api\TPOrderDetailApiController@retrieve4Summary')
        ->name("api.tPOrderDetail.retrieve4Summary");

    Route::get('tPOrder/createPO/{id}/{view?}', 'Api\TPOrderApiController@createPO');

    //SS連携
    Route::get('rtSsOrder/getOrderList', 'Api\RtSsOrderApiController@getOrderList')
        ->name("api.rtSsOrder.getOrderList");

    Route::get('rtSsOrder/getJsonByXml/{orderNo}', 'Api\RtSsOrderApiController@getJsonByXml')
        ->name("api.rtSsOrder.getJsonByXml");

    Route::resource('mCustomer', 'Api\MCustomerApiController');
    Route::get('mCustomer/getZipInfo/{zipcode}', 'Api\MCustomerApiController@getZipInfo');
    Route::get('mCustomer/getFurigana/{value}', 'Api\MCustomerApiController@getFurigana');
    Route::get('mCustomer/checkTxn/{id}', 'Api\MCustomerApiController@checkTxn');

    Route::resource('mProcessCategory', 'Api\MProcessCategoryApiController');
    Route::get('mProcessCategory/searchByProductionMKvId/{mKvId}', 'Api\MProcessCategoryApiController@searchByProductionMKvId');

    Route::resource('mProcessMaterial', 'Api\MProcessMaterialApiController');
    Route::resource('mProcessOutsource', 'Api\MProcessOutsourceApiController');
    Route::resource('mProcessLabel', 'Api\MProcessLabelApiController');
    Route::resource('mProcess', 'Api\MProcessApiController');
    Route::resource('mProductCategory', 'Api\MProductCategoryApiController');
    Route::resource('mProduction', 'Api\MProductionApiController');
    Route::post('mProduction/thumbnailUpload/{id}', 'Api\MProductionApiController@thumbnailUpload');
    Route::resource('mProductionMode', 'Api\MProductionModeApiController');
    Route::resource('mProductionOption', 'Api\MProductionOptionApiController');

    Route::post('mUser/thumbnailUpload/{id}', 'Api\MUserApiController@thumbnailUpload');

    Route::resource('tProjectConstruction', 'Api\TProjectConstructionApiController');
    Route::resource('tProjectConstructionResult', 'Api\TProjectConstructionResultApiController');
    Route::resource('tProjectDelivery', 'Api\TProjectDeliveryApiController');
    Route::resource('tProject', 'Api\TProjectApiController');

    Route::resource('tProductionDay', 'Api\TProductionDayApiController');
    Route::resource('tProductionDayGroup', 'Api\TProductionDayGroupApiController');

    Route::post('tProductionDayGroup/getProductionDaysByIds', 'Api\TProductionDayGroupApiController@getProductionDaysByIds')
        ->name('api.TProductionDayGroupApiController.getProductionDaysByIds');

    Route::post('tProductionProcessPlan/destroyByIds', 'Api\TProductionProcessPlanApiController@destroyByIds')
        ->name('api.tProductionProcessPlan.destroyByIds');

    Route::post('tProductionResult/retrieve4summary', 'Api\TProductionResultApiController@retrieve4summary')
        ->name('api.tProductionResult.retrieve4summary');

    Route::resource('tPOrder', 'Api\TPOrderApiController');
    Route::resource('tPOrderDetail', 'Api\TPOrderDetailApiController');

    // 仕入(tPInvoice・tPInvoiceDetail)
    Route::resource('tPInvoice', 'Api\TPInvoiceApiController');
    Route::resource('tPInvoiceDetail', 'Api\TPInvoiceDetailApiController');
    Route::post('tPInvoice/retrieve', 'Api\TPInvoiceApiController@retrieve')
        ->name("api.tPInvoice.retrieve");
    Route::post('tPInvoiceOrderList/retrieve', 'Api\TPInvoiceOrderListApiController@retrieve')
        ->name("api.tPInvoiceOrderList.retrieve");

    // 仕入集計
    Route::post('tPInvoiceDetail/retrieve4Summary',  'Api\TPInvoiceDetailApiController@retrieve4Summary')
        ->name("api.tPInvoiceDetail.retrieve4Summary");


    // 売上(tSale・tSaleDetail)
    Route::resource('tSale', 'Api\TSaleApiController');
    Route::resource('tSaleDetail', 'Api\TSaleDetailApiController');
    Route::post('tSale/retrieve', 'Api\TSaleApiController@retrieve')
        ->name("api.tSale.retrieve");
    Route::post('tSaleProjectList/retrieve', 'Api\TSaleProjectListApiController@retrieve')
        ->name("api.tSaleProjectList.retrieve");

    // 売上集計
    Route::post('tSaleSummary/retrieve4Summary',  'Api\TSaleSummaryApiController@retrieve4Summary')
        ->name("api.tSaleSummary.retrieve4Summary");




    // 納品書出力
    Route::get('tSale/deliveryNote/{id}/{view?}', 'Api\TSaleApiController@deliveryNote');
    Route::post('tSale/batchDeliveryNote', 'Api\TSaleApiController@batchDeliveryNote');

    // 販売管理連携
    Route::post('ExportTSale/retrieve', 'Api\ExportTSaleApiController@retrieve')
        ->name('api.ExportTSale.retrieve');
    Route::post('ExportTSale/export', 'Api\ExportTSaleApiController@export')
        ->name('api.ExportTSale.export');
    Route::post('ExportTPInvoice/retrieve', 'Api\ExportTPInvoiceApiController@retrieve')
        ->name('api.ExportTPInvoice.retrieve');
    Route::post('ExportTPInvoice/export', 'Api\ExportTPInvoiceApiController@export')
        ->name('api.ExportTPInvoice.export');
    // 会計連携
    Route::post('exportPaymentSale/retrieve', 'Api\ExportPaymentSaleApiController@retrieve')
        ->name('api.exportPaymentSale.retrieve');
    Route::post('exportPaymentSale/export', 'Api\ExportPaymentSaleApiController@export')
        ->name('api.exportPaymentSale.export');
    Route::post('exportPaymentSale/chkAllCompleted', 'Api\ExportPaymentSaleApiController@chkAllCompleted')
        ->name('api.exportPaymentSale.chkAllCompleted');

    Route::post('exportPaymentPurchase/retrieve', 'Api\ExportPaymentPurchaseApiController@retrieve')
        ->name('api.exportPaymentPurchase.retrieve');
    Route::post('exportPaymentPurchase/export', 'Api\ExportPaymentPurchaseApiController@export')
        ->name('api.exportPaymentPurchase.export');
    Route::post('exportPaymentPurchase/chkAllCompleted', 'Api\ExportPaymentPurchaseApiController@chkAllCompleted')
        ->name('api.exportPaymentPurchase.chkAllCompleted');

    // 売上締・仕入締(tComplete)
    Route::post('tCompleteSummary/retrieve', 'Api\TCompleteSummaryApiController@retrieve')
        ->name('api.tCompleteSummary.retrieve');
    Route::post('tComplete/retrieve', 'Api\TCompleteApiController@retrieve')
        ->name('api.tComplete.retrieve');
    Route::post('tComplete/completes', 'Api\TCompleteApiController@completes')
        ->name('api.tComplete.completes');
    Route::post('tComplete/check', 'Api\TCompleteApiController@check')
        ->name('api.tComplete.check');
    Route::post('tComplete/process', 'Api\TCompleteApiController@process')
        ->name('api.tComplete.process');
    Route::post('tComplete/cancel', 'Api\TCompleteApiController@cancel')
        ->name('api.tComplete.cancel');
    Route::post('tComplete/completeInfo', 'Api\TCompleteApiController@completeInfo')
        ->name('api.tComplete.completeInfo');
    Route::post('tComplete/completeInfoOne', 'Api\TCompleteApiController@completeInfoOne')
        ->name('api.tComplete.completeInfoOne');

    // 入金・支払(tCompleteDetail)
    Route::resource('tCompleteDetail', 'Api\TCompleteDetailApiController');
    Route::post('tCompleteDetail/retrieve', 'Api\TCompleteDetailApiController@retrieve')
        ->name('api.tCompleteDetail.retrieve');

    // 請求書出力
    Route::get('tComplete/invoice/{id}/{view?}', 'Api\TCompleteApiController@invoice');
    Route::post('tComplete/download', 'Api\TCompleteApiController@download');

    // *** SignMIS 帳票出力 ***
    // 物件一覧表
    Route::post('vSummaryProject/retrieve', 'Api\SignmisReports\VSummaryProjectApiController@retrieve')
        ->name('api.vSummaryProject.retrieve');
    Route::post('vSummaryProject/exportCsv', 'Api\SignmisReports\VSummaryProjectApiController@exportCsv')
        ->name('api.vSummaryProject.exportCsv');

    // 他拠点生産商品集計表
    Route::post('vSummaryRemoteBranchProduct/retrieve', 'Api\SignmisReports\VSummaryRemoteBranchProductApiController@retrieve')
        ->name('api.vSummaryRemoteBranchProduct.retrieve');
    Route::post('vSummaryRemoteBranchProduct/exportCsv', 'Api\SignmisReports\VSummaryRemoteBranchProductApiController@exportCsv')
        ->name('api.vSummaryRemoteBranchProduct.exportCsv');

    // 売上明細表
    Route::post('vDetailSale/retrieve', 'Api\SignmisReports\vDetailSaleApiController@retrieve')
        ->name('api.vDetailSale.retrieve');
    Route::post('vDetailSale/exportCsv', 'Api\SignmisReports\vDetailSaleApiController@exportCsv')
        ->name('api.vDetailSale.exportCsv');

    // 未請求一覧表
    Route::post('vUnclaimedSale/retrieve', 'Api\SignmisReports\VUnclaimedSaleApiController@retrieve')
        ->name('api.vUnclaimedSale.retrieve');
    Route::post('vUnclaimedSale/exportCsv', 'Api\SignmisReports\VUnclaimedSaleApiController@exportCsv')
        ->name('api.vUnclaimedSale.exportCsv');

    // 請求一覧表
    Route::post('vCompleteSale/retrieve', 'Api\SignmisReports\VCompleteSaleApiController@retrieve')
        ->name('api.vCompleteSale.retrieve');
    Route::post('vCompleteSale/exportCsv', 'Api\SignmisReports\VCompleteSaleApiController@exportCsv')
        ->name('api.vCompleteSale.exportCsv');

    // 入金明細表
    Route::post('vPaymentSale/retrieve', 'Api\SignmisReports\VPaymentSaleApiController@retrieve')
        ->name('api.vPaymentSale.retrieve');
    Route::post('vPaymentSale/exportCsv', 'Api\SignmisReports\VPaymentSaleApiController@exportCsv')
        ->name('api.vPaymentSale.exportCsv');

    // 売掛元帳
    Route::post('vLedgerSale/retrieve', 'Api\SignmisReports\VLedgerSaleApiController@retrieve')
        ->name('api.vLedgerSale.retrieve');
    Route::post('vLedgerSale/exportCsv', 'Api\SignmisReports\VLedgerSaleApiController@exportCsv')
        ->name('api.vLedgerSale.exportCsv');

    // 売掛残高一覧表
    Route::post('vBalanceSale/retrieve', 'Api\SignmisReports\VBalanceSaleApiController@retrieve')
        ->name('api.vBalanceSale.retrieve');
    Route::post('vBalanceSale/exportCsv', 'Api\SignmisReports\VBalanceSaleApiController@exportCsv')
        ->name('api.vBalanceSale.exportCsv');

    // 売上集計表
    Route::post('vSummarySale/retrieve', 'Api\SignmisReports\VSummarySaleApiController@retrieve')
        ->name('api.vSummarySale.retrieve');
    Route::post('vSummarySale/exportCsv', 'Api\SignmisReports\VSummarySaleApiController@exportCsv')
        ->name('api.vSummarySale.exportCsv');

    // 仕入明細表
    Route::post('vDetailPurchase/retrieve', 'Api\SignmisReports\vDetailPurchaseApiController@retrieve')
        ->name('api.vDetailPurchase.retrieve');
    Route::post('vDetailPurchase/exportCsv', 'Api\SignmisReports\vDetailPurchaseApiController@exportCsv')
        ->name('api.vDetailPurchase.exportCsv');

    // 未仕入締一覧表
    Route::post('vUnclaimedPurchase/retrieve', 'Api\SignmisReports\VUnclaimedPurchaseApiController@retrieve')
        ->name('api.vUnclaimedPurchase.retrieve');
    Route::post('vUnclaimedPurchase/exportCsv', 'Api\SignmisReports\VUnclaimedPurchaseApiController@exportCsv')
        ->name('api.vUnclaimedPurchase.exportCsv');

    // 仕入締一覧表
    Route::post('vCompletePurchase/retrieve', 'Api\SignmisReports\VCompletePurchaseApiController@retrieve')
        ->name('api.vCompletePurchase.retrieve');
    Route::post('vCompletePurchase/exportCsv', 'Api\SignmisReports\VCompletePurchaseApiController@exportCsv')
        ->name('api.vCompletePurchase.exportCsv');

    // 支払明細表
    Route::post('vPaymentPurchase/retrieve', 'Api\SignmisReports\VPaymentPurchaseApiController@retrieve')
        ->name('api.vPaymentPurchase.retrieve');
    Route::post('vPaymentPurchase/exportCsv', 'Api\SignmisReports\VPaymentPurchaseApiController@exportCsv')
        ->name('api.vPaymentPurchase.exportCsv');

    // 買掛元帳
    Route::post('vLedgerPurchase/retrieve', 'Api\SignmisReports\VLedgerPurchaseApiController@retrieve')
        ->name('api.vLedgerPurchase.retrieve');
    Route::post('vLedgerPurchase/exportCsv', 'Api\SignmisReports\VLedgerPurchaseApiController@exportCsv')
        ->name('api.vLedgerPurchase.exportCsv');

    // 買掛残高一覧表
    Route::post('vBalancePurchase/retrieve', 'Api\SignmisReports\VBalancePurchaseApiController@retrieve')
        ->name('api.vBalancePurchase.retrieve');
    Route::post('vBalancePurchase/exportCsv', 'Api\SignmisReports\VBalancePurchaseApiController@exportCsv')
        ->name('api.vBalancePurchase.exportCsv');

    // 生産グルーピング設定
    Route::resource('mProductionGroupConfig', 'Api\MProductionGroupConfigApiController');
    Route::get('mProductionGroupConfig/findByBranchAndProcessCategoryMkv/{mBranchId}/{mKvId}', 'Api\MProductionGroupConfigApiController@findByBranchAndProcessCategoryMkv');

    //在庫
    Route::resource('tIvtMaterial', 'Api\TIvtMaterialApiController');
    Route::post('tIvtMaterial/retrieve', 'Api\TIvtMaterialApiController@retrieve')
        ->name('api.tIvtMaterial.retrieve');

    Route::post('tIvtMaterial/saveMultiRow', 'Api\TIvtMaterialApiController@saveMultiRow')
        ->name('api.tIvtMaterial.saveMultiRow');

    //在庫編集
    Route::get('tIvtMaterial/getByMMaterialDetailId/{mMatDsId}/{date}', 'Api\TIvtMaterialApiController@getByMMaterialDetailId');
    //入庫予定リスト
    Route::post('tIvtMaterialPOList/retrieve', 'Api\TIvtMaterialPOListApiController@retrieve')
        ->name('api.tIvtMaterialPOList.retrieve');

    //QRから検索
    Route::get('tIvtMaterial/showByQr/{id}', 'Api\TIvtMaterialApiController@showByQr');
    //QRラベル発行
    Route::post('tIvtMaterial/createQrLabel/{view?}', 'Api\TIvtMaterialApiController@createQrLabel')
        ->name('api.tIvtMaterial.createQrLabel');




    //point
    Route::get('tProjectPoint/preview/{tProjectId}', 'Api\TProjectPointApiController@preview');
    Route::post('tProjectPoint/batchSave', 'Api\TProjectPointApiController@batchSave')
        ->name('api.tProjectPoint.batchSave');
    Route::post('tProjectPoint/batchClosingSave', 'Api\TProjectPointApiController@batchClosingSave')
        ->name('api.tProjectPoint.batchClosingSave');
    Route::post('tProjectPoint/getProjectList', 'Api\TProjectPointApiController@getProjectList')
        ->name('api.tProjectPoint.getProjectList');
    Route::post('tProjectPoint/getTProject4Point', 'Api\TProjectPointApiController@getTProject4Point')
        ->name('api.tProjectPoint.getTProject4Point');

    Route::post('tProjectPoint/getTProject4PointClosing', 'Api\TProjectPointApiController@getTProject4PointClosing')
        ->name('api.tProjectPoint.getTProject4PointClosing');

    Route::post('tProjectPoint/validateClosing', 'Api\TProjectPointApiController@validateClosing')->name('api.tProjectPoint.validateClosing');

    Route::resource('tProjectPoint', 'Api\TProjectPointApiController');

    Route::resource('tUserPoint', 'Api\TUserPointApiController');

    Route::post('tUserPoint/getByMUserId', 'Api\TUserPointApiController@getByMUserId')->name('api.tUserPoint.getByMUserId');
    Route::get('tUserPoint/getByTProjectId/{tProjectId}', 'Api\TUserPointApiController@getByTProjectId');
    Route::post('tUserPoint/getApproveList', 'Api\TUserPointApiController@getApproveList')
        ->name('api.tUserPoint.getApproveList');

    Route::post('tUserPoint/approve', 'Api\TUserPointApiController@approve')
        ->name('api.tUserPoint.approve');

    // ポイント集計
    Route::post('tUserPointSummary/retrieve4Summary',  'Api\TUserPointSummaryApiController@retrieve4Summary')
        ->name("api.tUserPointSummary.retrieve4Summary");


    /**** DurstWorkFlow */
    Route::post('durstwf/createXml', 'Api\MProductionExtTools\DurstWfApiController@createXml')
        ->name("api.durstwf.createXml");

    // Route::get('durstwf/login/{username}/{pass}', 'Api\MProductionExtTools\DurstWfApiController@login')
    //     ->name("api.durstwf.login");

    Route::post('durstwf/createJob', 'Api\MProductionExtTools\DurstWfApiController@createJob')
        ->name("api.durstwf.createJob");

    Route::get('durstwf/getOutputTemplates', 'Api\MProductionExtTools\DurstWfApiController@getOutputTemplates')
        ->name("api.durstwf.getOutputTemplates");

    Route::get('durstwf/getImposeTemplates', 'Api\MProductionExtTools\DurstWfApiController@getImposeTemplates')
        ->name("api.durstwf.getImposeTemplates");

    Route::post('durstwf/impose/{jobId}', 'Api\MProductionExtTools\DurstWfApiController@impose')
        ->name("api.durstwf.impose");

    Route::get('durstwf/getImposeResult/{jobId}/{fileTypeKey}', 'Api\MProductionExtTools\DurstWfApiController@getImposeResult')
        ->name("api.durstwf.getImposeResult");

    Route::get('durstwf/sendToPrinter/{jobId}', 'Api\MProductionExtTools\DurstWfApiController@sendToPrinter')
        ->name("api.durstwf.sendToPrinter");

    //eskoAE Phoenix
    Route::post('graphicLayout/getJson4Tiling', 'Api\GraphicLayoutApiController@getJson4Tiling')
        ->name("api.graphicLayout.getJson4Tiling");

    //ocrApi
    Route::post('msCv/analyzeByOcr', 'Api\MsCvApiController@analyzeByOcr')
        ->name("api.msCv.analyzeByOcr");

    // base64サムネイルを変更
    Route::get('tProjectFile/decordBase64', 'Api\TProjectFileApiController@decordBase64');

    // mailtest
    Route::post('mailTest', function (Request $param) {
        $ssMailConf = [
            'default' => env('SS_MAIL_MAILER', 'smtp'),
            'mailers' => [
                'smtp' => [
                    'transport' => 'smtp',
                    'host' => config('app.ss_mail_host', 'smtp.mailgun.org'),
                    'port' => config('app.ss_mail_port', 587),
                    'encryption' => config('app.ss_mail_encryption', 'tls'),
                    'username' => config('app.ss_mail_username'),
                    'password' => config('app.ss_mail_password'),
                    'timeout' => null,
                    'auth_mode' => null,
                ],
            ],
            'from' => [
                'address' => config('app.ss_mail_from_address', 'hello@example.com'),
                'name' => config('app.ss_mail_name', 'Signmis'),

            ],
        ];

        //configの書き換えはリクエスト中のみ
        //同時にリクエストを起こしても影響なし
        if ($param["key"] == 1) {
            config(['mail' => $ssMailConf]);
        }
        // log::debug(config('mail.from.name'));

        Mail::raw('nsk mail test', function ($message) {
            $message->to('reas@nsksystem.co.jp')->subject('nsk mail test');
        });

        return "mailed";
    });

    // 全キャッシュ削除Api
    Route::get('clearAllCache', function () {
        Cache::flush();
        return "cache cleared";
    });
});
