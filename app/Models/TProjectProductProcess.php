<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpParser\Builder\Class_;

class TProjectProductProcess extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ,'deleted_at'];

    protected $unsetChildren = ["m_process_category" ] ; 

    protected $childModels = 
    [
        "TProductionResults" =>  TProductionResult::class,
    ] ; 

    //
    protected $casts = [
        'outsource_cost_by_input'   => 'double',
        'outsource_qty'             => 'double',

        'predicted_sec_per_job' => 'double',
        'predicted_sec_per_qty' => 'double',
        'predicted_work_hour'   => 'double',
        'predicted_material_cost_per_job'  => 'double',
        'predicted_material_cost_per_qty'  => 'double',
        'predicted_outsource_cost_per_job' => 'double',
        'predicted_outsource_cost_per_qty' => 'double',
        'predicted_work_cost_per_job' => 'double',
        'predicted_work_cost_per_qty' => 'double',
        'predicted_cost_per_job'      => 'double',
        'predicted_cost_per_qty'      => 'double',

        'work_cost'         => 'double',
        'material_cost'     => 'double',
        'outsource_cost'    => 'double',
        'total_cost'        => 'double',

        'process_mater'         => 'double',
        'total_process_mater'   => 'double',

        'custom_sqm'         => 'double',
        'total_custom_sqm'   => 'double',

        'is_01'        => 'bool',
        'is_02'        => 'bool',
        'is_03'        => 'bool',
        'is_04'        => 'bool',
        'is_05'        => 'bool',
        'is_06'        => 'bool',
        'is_07'        => 'bool',
        'is_08'        => 'bool',
        'is_09'        => 'bool',
        'is_10'        => 'bool',
        'is_11'        => 'bool',
        'is_12'        => 'bool',
        'is_13'        => 'bool',
        'is_14'        => 'bool',
        'is_15'        => 'bool',
        'is_16'        => 'bool',
        'is_17'        => 'bool',
        'is_18'        => 'bool',
        'is_19'        => 'bool',
        'is_20'        => 'bool',
        'is_21'        => 'bool',
        'is_22'        => 'bool',
        'is_23'        => 'bool',
        'is_24'        => 'bool',
        'is_25'        => 'bool',
        'is_26'        => 'bool',
        'is_27'        => 'bool',
        'is_28'        => 'bool',
        'is_29'        => 'bool',
        'is_30'        => 'bool',
        'is_31'        => 'bool',
        'is_32'        => 'bool',
        'is_33'        => 'bool',
        'is_34'        => 'bool',
        'is_35'        => 'bool',
        'is_36'        => 'bool',
        'is_37'        => 'bool',
        'is_38'        => 'bool',
        'is_39'        => 'bool',

        'n_01'        => 'double',
        'n_02'        => 'double',
        'n_03'        => 'double',
        'n_04'        => 'double',
        'n_05'        => 'double',
        'n_06'        => 'double',
        'n_07'        => 'double',
        'n_08'        => 'double',
        'n_09'        => 'double',
        'n_10'        => 'double',
        'n_11'        => 'double',
        'n_12'        => 'double',
        'n_13'        => 'double',
        'n_14'        => 'double',
        'n_15'        => 'double',
        'n_16'        => 'double',
        'n_17'        => 'double',
        'n_18'        => 'double',
        'n_19'        => 'double',
        'n_20'        => 'double',
        'n_21'        => 'double',
        'n_22'        => 'double',
        'n_23'        => 'double',
        'n_24'        => 'double',
        'n_25'        => 'double',
        'n_26'        => 'double',
        'n_27'        => 'double',
        'n_28'        => 'double',
        'n_29'        => 'double',
        'n_30'        => 'double',
        'n_31'        => 'double',
        'n_32'        => 'double',
        'n_33'        => 'double',
        'n_34'        => 'double',
        'n_35'        => 'double',
        'n_36'        => 'double',
        'n_37'        => 'double',
        'n_38'        => 'double',
        'n_39'        => 'double',
        'n_40'        => 'double',
        'n_41'        => 'double',
        'n_42'        => 'double',
        'n_43'        => 'double',
        'n_44'        => 'double',
        'n_45'        => 'double',
        'n_46'        => 'double',
        'n_47'        => 'double',
        'n_48'        => 'double',
        'n_49'        => 'double',
        'n_50'        => 'double',
        'n_51'        => 'double',
        'n_52'        => 'double',
        'n_53'        => 'double',
        'n_54'        => 'double',
        'n_55'        => 'double',
        'n_56'        => 'double',
        'n_57'        => 'double',
        'n_58'        => 'double',
        'n_59'        => 'double',
        'n_60'        => 'double',
        'n_61'        => 'double',
        'n_62'        => 'double',
        'n_63'        => 'double',
        'n_64'        => 'double',
        'n_65'        => 'double',
        'n_66'        => 'double',
        'n_67'        => 'double',
        'n_68'        => 'double',
        'n_69'        => 'double',
        'n_70'        => 'double',
        'n_71'        => 'double',
        'n_72'        => 'double',
        'n_73'        => 'double',
        'n_74'        => 'double',
        'n_75'        => 'double',
        'n_76'        => 'double',
        'n_77'        => 'double',
        'n_78'        => 'double',
        'n_79'        => 'double',
        'n_80'        => 'double',
        'n_81'        => 'double',
        'n_82'        => 'double',
        'n_83'        => 'double',
        'n_84'        => 'double',
        'n_85'        => 'double',
        'n_86'        => 'double',
        'n_87'        => 'double',
        'n_88'        => 'double',
        'n_89'        => 'double',
        
        
    ];

    // 生産管理で使用するカラム
    public static $productionColumns = 
    [
        "id" , 
        "t_project_product_id" ,
        "order_no" ,
        "is_enabled" ,
        "m_branch_id" ,
        "m_process_category_id" ,
        "supplier_m_customer_id" ,
        "is_outsource" ,
        "outsource_m_production_id" ,
        "display_01" ,
        "display_01" ,
        "display_02" ,
        "display_03" ,
        "display_04" ,
        "display_05" ,
        "display_06" ,
        "display_07" ,
        "display_08" ,
        "display_09" ,
        "display_prod_01",
        "display_prod_02",
        "display_prod_03",
        "display_prod_04",
        "display_prod_05",
        "display_prod_06",
        "display_prod_07",
        "display_prod_08",
        "display_prod_09",
        "m_production_id_01",
        "m_production_mode_id_01",
        "m_production_option_id_01",
        "m_production_id_02",
        "m_production_mode_id_02",
        "m_production_option_id_02",
        "m_production_id_03",
        "m_production_mode_id_03",
        "m_production_option_id_03",
        "m_production_id_04",
        "m_production_mode_id_04",
        "m_production_option_id_04",        
        "m_material_id_01" , 
        "m_material_id_02" , 
        "m_material_id_03" , 
        "is_01" , 
        "s_01" , 
        "memo" ,
        "predicted_sec_per_job" ,
        "predicted_sec_per_qty" ,
        "predicted_work_hour" ,
        "predicted_material_cost_per_job" ,
        "predicted_material_cost_per_qty" ,
        "material_cost" , 
        "predicted_outsource_cost_per_job" ,
        "predicted_outsource_cost_per_qty" ,
        "outsource_cost" ,
        "predicted_work_cost_per_job" ,
        "predicted_work_cost_per_qty" ,
        "work_cost" ,
        "predicted_cost_per_job" ,
        "predicted_cost_per_qty" ,        
        "total_cost" , 
        "process_mater" ,
        "total_process_mater" ,
        "custom_sqm" ,
        "total_custom_sqm" ,
        "updated_at"
    ] ; 

    
    // 生産管理　分析で使用するカラム
    public static $productionSummaryColumns = 
    [
        "id" , 
        "t_project_product_id" ,
        "order_no" ,
        "is_enabled" ,
        "m_process_category_id" ,
        "total_custom_sqm"
        
    ] ; 

    
    public static function getProductionColumnsWithTName() {
        $rtn = [] ; 
        $tName = "t_project_product_processes." ; 
        $columns = self::$productionColumns ; 
        foreach ($columns as $col){
            $rtn[] = $tName . $col ; 
        }
        return $rtn ; 
    }

    
    public static function getProductionSummaryColumnsWithTName() {
        $rtn = [] ; 
        $tName = "t_project_product_processes." ; 
        $columns = self::$productionSummaryColumns ; 
        foreach ($columns as $col){
            $rtn[] = $tName . $col ; 
        }
        return $rtn ; 
    }

    public static function getProductionColumnStr() {
        return ":" . join("," , self::$productionColumns) ; 
    }
    

    public static function getProductionSummaryColumnStr() {
        return ":" . join("," , self::$productionSummaryColumns) ; 
    }
    

    protected $syncPivotModels = 
    [
        "TPOrderDetails" => 
            [
                "modelClass" => TProjectProductProcessOrderDetail::class , 
                "pivotName"  => "t_project_product_process_order_detail" , 
                "foreignKey" => "t_project_product_process_id" , 
            ] ,
        
    ] ; 
    

    /**
     * 
     */
    public function TProjectProduct()
    {
        return $this->belongsTo('App\Models\TProjectProduct');
    }
    /**
     * 
     */
    public function MProcessCategory()
    {
        return $this->belongsTo('App\Models\MProcessCategory');
    }

    public function MMaterial01() 
    {
        return $this->belongsTo('App\Models\MMaterial' , "m_material_id_01");
    }

    // public function TPOrderDetails()
    // {
    //     return $this->hasMany('App\Models\TPOrderDetail');
    // }

    /**
     * Pivot経由の発注明細
     */
    public function TPOrderDetails()
    {

        return $this
            ->belongsToMany('App\Models\TPOrderDetail' ,'App\Models\TProjectProductProcessOrderDetail' )                
            ->as("t_project_product_process_order_detail")
            // ->withTimestamps()
            ->withPivot(['id' ,'order_no' , 'is_preceding'])
            ->orderBy("order_no") ;

            //
    }


    public function MBranch()
    {
        return $this->belongsTo('App\Models\MBranch');
    }
    public function SupplierMCustomer()
    {
        return $this->belongsTo('App\Models\MCustomer');
    }


    /**
     * この工程に属する生産計画グループ
     */
    public function TProductionDayGroups()
    {
        return $this->belongsToMany(TProductionDayGroup::class , TProductionProcessPlan::class)
                ->as("t_production_process_plan")
                ->withPivot(['id' ,'order_no' , 'qty' ])
                ->orderBy("order_no") ;

    }

    


    /**
     * 生産計画データ
     */
    public function TProductionProcessPlans() 
    {
        return $this
            ->hasMany(TProductionProcessPlan::class); 
            
    }

    
    /**
     * 生産実績データ
     */
    public function TProductionResults() : HasMany
    {
        return $this
            ->hasMany(TProductionResult::class); 
            
    }


    /**
     * Methods
     */

    /**
     * 生産先IDからtmp_target_production_noを設定する
     */
    public function ReflectTmpTargetProductionNo($mProductionId) {       
        
            
        if ( $this->m_production_id_01 === $mProductionId ) { 
            $this->tmp_target_production_no = "01" ; 
            return ; 
        }
        
        if ( $this->m_production_id_02 === $mProductionId ) { 
            $this->tmp_target_production_no = "02" ; 
            return ; 
        }
        
        if ( $this->m_production_id_03 === $mProductionId ) { 
            $this->tmp_target_production_no = "03" ; 
            return ; 
        }
        
        if ( $this->m_production_id_04 === $mProductionId ) { 
            $this->tmp_target_production_no = "04" ; 
            return ; 
        }
        else { 
            $this->tmp_target_production_no = "05" ; 
        }

    }
    

    /**
     * Scopes 
     * 
     * 
     * 
     */


    /**
     * Enabled
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true );
    }

    /**
     * 受注済みのみ
     */
    public function scopeTProjectOrdered($query) { 
        return 
            $query->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('t_project_products')
                    ->join('t_projects' ,function($joinQuery){
                        $joinQuery
                            ->on("t_projects.id" , "=" ,"t_project_products.t_project_id")
                            ->whereNotNull("ordered_at")  ; 
                    })
                    ->whereColumn('t_project_product_processes.t_project_product_id', 't_project_products.id') ; 
                    
            }) ; 
        
    }

    public function scopeResultDoesntExists ($query){
        // Todo :: 難しい

        // $query->whereDoesntHave("TProductionDayGroups", function ($query) {
        //     $query->select(DB::raw(1))
        //         ->from('t_production_day_groups' )
        //         ->join('t_production_results' , function($joinQuery){
        //             $joinQuery
        //                 ->on("t_production_day_groups.id" , "=" ,"t_production_results.t_production_day_group_id")
        //                 ->whereNotNull("t_production_results.deleted_at") ; 
        //         }) ;
        //         // ->whereColumn('t_production_results.t_production_day_group_id', 't_production_day_groups.id') ; 
                

        //     // $query->select(DB::raw(1))
        //     // ->from('t_project_products')
        //     // ->join('t_projects' ,function($joinQuery){
        //     //     $joinQuery
        //     //         ->on("t_projects.id" , "=" ,"t_project_products.t_project_id")
        //     //         ->whereNotNull("ordered_at")  ; 
        //     // })
        //     // ->whereColumn('t_project_product_processes.t_project_product_id', 't_project_products.id') ; 
            
        // }) ; 

        return $query ; 
        // $query->whereExists("TProductionDayGroups", function ($query) {
        //     $query->whereDoesntHave("TProductionDayGroups", function ($query) {
        //     }
        // }
    }
    

    /**
     * t_projects.type_flg = 0 のものだけ取得
     */
    public function scopeTProjectActive($query)
    {
        return 
            $query->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('t_project_products')
                    ->join('t_projects' ,function($joinQuery){
                        $joinQuery
                            ->on("t_projects.id" , "=" ,"t_project_products.t_project_id")
                            ->where("t_projects.type_flg" , 0) ; 
                    })
                    ->whereColumn('t_project_product_processes.t_project_product_id', 't_project_products.id') ;                     
            }) ; 
            
    }

    
    /**
     * t_projects.type_flg = 0 のものだけ取得
     * 納期も指定
     */
    public function scopeTProjectActiveAndDelivery($query , $deliveryFrom ,$deliveryTo )
    {
        return 
            $query->whereExists(function ($query) use ($deliveryFrom ,$deliveryTo) {
                $query->select(DB::raw(1))
                    ->from('t_project_products')
                    ->join('t_projects' ,function($joinQuery){
                        $joinQuery
                            ->on("t_projects.id" , "=" ,"t_project_products.t_project_id")
                            ->where("t_projects.type_flg" , 0) ; 

                    })
                    ->whereColumn('t_project_product_processes.t_project_product_id', 't_project_products.id')  ;

                // 納期指定
                // Log::debug("Noki") ; 
                $deliveryDateCName = 'IFNULL(`t_project_products`.`delivery_date` ,(select MIN(delivery_at) from t_project_deliveries where t_project_deliveries.t_project_id = t_projects.id )) ';
                if (! empty($deliveryFrom ) || ! empty($deliveryTo )){
                    
                    // Log::debug("Noki -A") ; 
                    if ( ! empty($deliveryFrom ) && ! empty($deliveryTo ) ){
                        // from ~ to
                        // Log::debug("Noki -from ~ to") ; 
                        $query->whereRaw("{$deliveryDateCName} BETWEEN ? AND ? " ,[$deliveryFrom , $deliveryTo] );
                    }
                    else if ( empty($deliveryFrom )){
                        // ～ to
                        // Log::debug("Noki -~ to") ; 
                        $query->whereRaw("{$deliveryDateCName} <= ? " ,[$deliveryTo ] );
                    }
                    else if ( empty($deliveryTo )){
                        // from ~ 
                        // Log::debug("Noki -from ~ ") ; 
                        $query->whereRaw("{$deliveryDateCName} >= ? " ,[$deliveryFrom ] );
                    }                    

                } 

            }) ; 
            
    }



}
