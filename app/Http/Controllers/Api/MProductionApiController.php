<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\FileNotFoundErrorException;
use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Traits\ThumbnailUploadTrait ; 
use App\Http\Controllers\Controller;
use App\Models\MProduction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Cache;


class MProductionApiController extends BaseApiController
{
    use ThumbnailUploadTrait ; 

    private $mBranchColumns = ":m_branches.id,m_branches.order_no,m_branches.name,m_branches.short_name" ; 
    private $mSpeedUnitKvColumns = ":m_kvs.id,m_kvs.kv_name" ; 
    private $mProcessCategoryColumns = ":m_process_categories.id,m_process_categories.cd,m_process_categories.name" ; 
    private $mProductCategoryColumns = ":m_product_categories.id,m_product_categories.cd,m_product_categories.name" ; 
    private $mProductionModesColumns = ":m_production_modes.id,m_production_modes.m_production_id,m_production_modes.order_no,m_production_modes.order_no,m_production_modes.name,m_production_modes.machine_mode_name,m_production_modes.prepare_sec_per_qty,m_production_modes.speed_per_hour,m_production_modes.speed_unit_m_kv_id,m_production_modes.description" ; 
    private $mProductionOptionsColumns = ":m_production_options.id,m_production_options.m_production_id,m_production_options.order_no,m_production_options.name,m_production_options.speed_rate,m_production_options.num_of_colors,m_production_options.num_of_colors_for_cost,m_production_options.num_of_white_for_cost,m_production_options.num_of_varnish_for_cost" ; 
    private $mCustomerColumns = ":m_customers.id" ; 
    

    private $cacheKey = "m_productions" ;


    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = MProduction::class ;
    }

    private function getBuilder() : Builder
    {
        return $this->model
            ::with("MProcessCategories" . $this->mProcessCategoryColumns) 
            ->with("MProductCategories" . $this->mProductCategoryColumns)
            ->with("MProductionExtTool") 
            ->with("MProductionModes"   . $this->mProductionModesColumns)
            ->with("MProductionModes.MProcessCategories"   . $this->mProcessCategoryColumns)
            ->with("MProductionModes.SpeedUnitMKv"   . $this->mSpeedUnitKvColumns)
            ->with("MProductionOptions" . $this->mProductionOptionsColumns)
            ->with("MBranch"            . $this->mBranchColumns ) 
            ->with("MCustomer:id,name,short_name"          ) ; 
    }

    public function index()
    {
        // $data = $this->getBuilder()         
        //     ->orderBy("order_no" ,"asc")
        //     ->get()  ;
        $data = $this->getByCache() ;
        return $data->values()->all();
        

    }
    protected function getByCache()
    {
        $data = Cache::rememberForever($this->cacheKey , function () {
            return $this->getBuilder()         
            ->orderBy("order_no" ,"asc")
            ->get()  ; 
        });
        return $data ;
    }
    
    

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->getBuilder()
            ->find($id);
        
        if (! $row){
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        
        return $row ; 
    }

    /**
     * サムネイルアップロード
     */
    // public function thumbnailUpload( Request $request, $id){
    //     $row = $this->show($id) ; 
        
    //     $file = $request->file("thumbnail")  ; 
    //     if ( ! $file){  
    //         return $this->thumbnailDelete($row) ; 
    //         // $error = new FileNotFoundErrorException() ; 
    //         // throw $error ;             
    //     }

    //     $storagePath = $row["thumbnail_path"] ; 
    //     if ($storagePath){
    //         if ( Storage::disk("public")->exists($storagePath)){
    //             Storage::disk("public")->delete($storagePath) ; 
    //         }
    //     }

    //     $path = Storage::disk("public")->put("m_productions" ,$file) ; 
    //     $row["thumbnail_path"] = $path ; 
    //     $row->save();        
    //     return $row ; 
    //     // dd($row) ;

    // }

    // /**
    //  * サムネイルの削除
    //  */
    // private function thumbnailDelete($row){
    //     $storagePath = $row->thumbnail_path ; 
    //     if ($storagePath){
    //         if ( Storage::disk("public")->exists($storagePath)){
    //             Storage::disk("public")->delete($storagePath) ; 
    //         }
    //         $row["thumbnail_path"] = null ; 
    //         $row->save();        

    //     }
        
    //     return $row ; 


    // }

    protected function saveRow($request ,$row )
    {        
        $data = $request->all() ; 
        
        $mProduteCategoryIds =  $data["m_product_category_ids"] ; 
        $mProcessCategoryIds =  $data["m_process_category_ids"] ; 

        foreach($mProcessCategoryIds as $key => $val) 
        { 
            if(is_null($val)) unset($mProcessCategoryIds[$key]); 
        } 

        unset($data["m_product_category_ids"]) ; 
        unset($data["m_process_category_ids"]) ; 

        // 子供ごとSave
        $row->fillIncChildren($data) ;
        
        DB::beginTransaction();
        try {
            $row->push();        
            $row->MProductCategories()->sync($mProduteCategoryIds) ;
            $row->MProcessCategories()->sync($mProcessCategoryIds) ;
            } catch (\PDOException $pdoException)
        {
            $this->throwDbError($pdoException) ; 
        }        
        catch (\Exception $e) { 
            DB::rollBack();
            Log::debug($e) ; 
        }
        DB::commit() ;
        
        //DBに更新をかけたタイミングでキャッシュを削除する
        $this->ClearCache($this->cacheKey) ;
        
        return $row ; 
    } 
    

    
    public function destroy($id)
    {
        $row = $this->model::find($id) ;

        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        if ($row instanceof BaseModel) {
            $deleted = $row->deleteWithChildren() ; 
        } else {
            $deleted = $row->delete() ;
        }
        
        $this->ClearCache($this->cacheKey) ;

        return compact('deleted') ;
    }

}
