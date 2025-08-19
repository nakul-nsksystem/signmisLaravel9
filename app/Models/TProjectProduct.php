<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProjectProduct extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];

    protected $casts = [
        'size_w' => 'double',
        'size_h' => 'double',
        'size_extend_t' => 'double',
        'size_extend_b' => 'double',
        'size_extend_l' => 'double',
        'size_extend_r' => 'double',
        'sqm' => 'double',
        'total_sqm' => 'double',
        'weight' => 'double',
        'total_weight' => 'double',
        'num_of_sep_w' => 'int',
        'sep_way_w' => 'int',
        'num_of_sep_h' => 'int',
        'sep_way_h' => 'int',
        'sep_overlap_length' => 'double',
        'qty'    => 'integer',
        'cost'       => 'double',
        'total_cost' => 'double',
        'sell_price' => 'double',
        'total_sell_price' => 'double',
        'profit'       => 'double',
        'total_profit' => 'double',
        'profit_per'   => 'double',
        'variable_cost'   => 'double',
        'total_variable_cost'   => 'double',
        'margin_profit'         => 'double',
        'total_margin_profit'   => 'double',
        'margin_profit_per'     => 'double',        
        'total_hour_for_production' => 'double',
    ];

    
    protected $unsetChildren = ["m_product_category" ,"warranty_m_kv" ,"specified_m_kv","t_project_file" ,"t_project_deliveries"] ; 
    

    protected $childModels = 
        [
            "TProjectProductProcesses" =>  "App\Models\TProjectProductProcess" ,
            "TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
            "TProjectProductBoardlayouts" =>  "App\Models\TProjectProductBoardlayout" ,
            "TProjectProductEstimateDetails" =>  "App\Models\TProjectProductEstimateDetail" ,
        ] ; 

    protected $delInsChildModels = 
        [
            "TProjectProductSeparates" =>  "App\Models\TProjectProductSeparate" ,
            "TProjectProductBoardlayouts" =>  "App\Models\TProjectProductBoardlayout" ,
        ] ; 

    public function WarrantyMKv()
    {
        return $this
            ->belongsTo('App\Models\MKv' , "warranty_m_kv_id")
            ->withTrashed();
    }
    
    public function SpecifiedMKv()
    {
        return $this
            ->belongsTo('App\Models\MKv' , "specified_m_kv_id")
            ->withTrashed();
    }
    
    public function MProductCategory()
    {
        return $this
            ->belongsTo('App\Models\MProductCategory')
            ->withTrashed();
    }
    
    public function TProject()
    {
        return $this
            ->belongsTo('App\Models\TProject' )
            ->withTrashed();
    }

    public function TProjectFile()
    {
        return $this
            ->belongsTo('App\Models\TProjectFile') ;
    }
    
    

    public function TProjectProductProcesses() 
    {
        return $this
            ->hasMany('App\Models\TProjectProductProcess')
            ->orderby("order_no") ; 
            
    }

    /**
     * 分割
     */
    public function TProjectProductSeparates() 
    {
        return $this
            ->hasMany('App\Models\TProjectProductSeparate')
            ->orderby("id") ; 
    }

    /**
     * 板レイアウトの材料寸法リスト
     */
    
    public function TProjectProductBoardlayouts() 
    {
        return $this
            ->hasMany('App\Models\TProjectProductBoardlayout')
            ->orderby("qty" ,"desc") ; 
    }

    /**
     * 見積り明細行
     */
    public function TProjectProductEstimateDetails()
    {
        return $this
            ->hasMany('App\Models\TProjectProductEstimateDetail') 
            ->orderby("order_no") ; 
            
    }

    public function UnitMKv() 
    {
        return $this
            ->belongsTo('App\Models\MKv'); 
            
    }

    /**
     * 制作担当
     */
    public function OperatorMUser() 
    {
        return $this
            ->belongsTo('App\User',"operator_m_user_id")
            ->withTrashed();            
    }

    public function TProjectDeliveries()
    {
        return $this
            ->belongsToMany('App\Models\TProjectDelivery' ,'App\Models\TProjectDeliveryProductLink' )
            ->as("t_project_delivery_product_link") 
            ->withPivot(['qty']);


    }

    public function MBranch() 
    {
        return $this
            ->belongsTo('App\Models\MBranch',"m_branch_id")
            ->withTrashed();            
    }
    


    //protected $appends = ['main_material' ,'lami_material' ,'calced_delivery_date' ];
    // protected $appends = ['calced_delivery_date' ];

    
    private function getMaterialValues($material){
        if ( $material == null ) return null ; 

        $material->Supplier ; 
        $material->CategoryMKv ; 
        $material->SubCategoryMKv ; 
        $material->TotalPriceCalcMKv ; 
        $material->MTags; 
        $material->MMaterialDetails ; 
        
        return $material ; 

        // $mat = array(
        //     "id" => $material["id"] , 
        //     "name" => $material["name"] , 
        //     "display_name" => $material["display_name"] , 
        //     "category_m_kv_id" => $material["category_m_kv_id"] , 
        //     "sub_category_m_kv_id" => $material["sub_category_m_kv_id"] , 
        //     "m_branch_id" => $material["m_branch_id"] , 
        //     "supplier_m_customer_id" => $material["supplier_m_customer_id"] , 
        //     "total_price_calc_m_kv_id" => $material["total_price_calc_m_kv_id"] , 
        //     "accounts_title_m_kv_id" => $material["accounts_title_m_kv_id"] , 
        //     "is_stocked" => $material["is_stocked"] , 
        //     "thickness" => $material["thickness"] ,  
        //     "memo" => $material["memo"] ,          
        //     "m_tags"  
        // )  ; 

        // return $mat ; 
    }

    /**
     * メインの材料 必要に応じてappends
     */
    public function getMainMaterialAttribute()
    {
        return $this->getMainMaterial(false) ; 
        
    }

    public function getMainMaterialWithRelationsAttribute(){
        return $this->getMainMaterial(true) ; 
    }

    protected function getMainMaterial($isIncludeRelations ){
        $material = null ; 
        foreach ($this->TProjectProductProcesses as $process   ){
            //Log::debug($process->MProcessCategory) ; 
            if ($process->MProcessCategory["is_main_material"]) {                
                if ( $process["is_01"] ){
                    $material = array(
                        "name" => $process["s_01"] , 
                        "display_name" => $process["s_01"] , 
                    ) ;

                }
                else {                     
                    if ( $isIncludeRelations ){
                        $material = $this->getMaterialValues($process->MMaterial01) ; 
                    }
                    else { 
                        $material = $process->MMaterial01 ; 
                    }
                    
                }
            }
        }
        return $material ; 

    }



    /**
     * ラミの材料 必要に応じてappends
     */
    public function getLamiMaterialAttribute(){
        return $this->getLamiMaterial(false ) ; 
        
    }

    
    /**
     * ラミの材料 必要に応じてappends
     */
    public function getLamiMaterialWithRelationsAttribute()
    {
        return $this->getLamiMaterial(true ) ; 
        
    }

    
    protected function getLamiMaterial($isIncludeRelations ){
        $material = null ; 
        foreach ($this->TProjectProductProcesses as $process   ){
            //Log::debug($process->MProcessCategory) ; 
            if ($process->MProcessCategory["is_lami_material"] && 
                $process["is_enabled"]  ) {
                if ( $process["is_01"] ){
                    $material = array(
                        "name" => $process["s_01"] , 
                        "display_name" => $process["s_01"] , 
                    ) ;
                }
                else {     
                    if ( $isIncludeRelations ){
                        $material = $this->getMaterialValues($process->MMaterial01) ; 
                    }
                    else { 
                        $material = $process->MMaterial01 ; 
                    }
                }
                //$material = $process->MMaterial01 ; 
                
            }
        }
        return $material ; 

        $material = null ; 
        foreach ($this->TProjectProductProcesses as $process   ){
            //Log::debug($process->MProcessCategory) ; 
            if ($process->MProcessCategory["is_main_material"]) {                
                if ( $process["is_01"] ){
                    $material = array(
                        "name" => $process["s_01"] , 
                        "display_name" => $process["s_01"] , 
                    ) ;

                }
                else {                     
                    if ( $isIncludeRelations ){
                        $material = $this->getMaterialValues($process->MMaterial01) ; 
                    }
                    else { 
                        $material = $process->MMaterial01 ; 
                    }
                    
                }
            }
        }
        return $material ; 

    }

    public function getCalcedDeliveryDateAttribute()
    {
        // $dt = $this["delivery_date"] ; 
        $dt = null ; 

        foreach ($this->TProjectDeliveries as $delivery){        

            $at = $delivery["delivery_at"] ; 
            if ( is_null($dt) || $at < $dt ) {
                $dt = $delivery["delivery_at"] ;
                // $min = $delivery ; 
            }
        }
        if ( is_null($dt) ){
            if (! is_null($this->TProject["min_delivery"])) {
                $dt = $this->TProject["min_delivery"]["delivery_at"] ; 
            }
        }
                                    
        return $dt ; 
    }

    

}
