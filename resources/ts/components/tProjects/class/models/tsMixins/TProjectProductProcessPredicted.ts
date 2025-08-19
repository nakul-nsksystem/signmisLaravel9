import _, { curry } from "lodash";
import MKvsConst from "../../../../../consts/MKvsConst";
import ArrayUtil from "../../../../../frameworks/ArrayUtil";
import NumberUtil from "../../../../../frameworks/NumberUtil";
import { MMaterialDetail } from "../../../../masters/class/models/MMaterialDetail";
import { MProcessCategory } from "../../../../masters/class/models/MProcessCategory";
import { MProcesses } from "../../../../masters/class/models/MProcesses";
import { MProcessMaterial } from "../../../../masters/class/models/MProcessMaterial";
import { MProcessOutsources } from "../../../../masters/class/models/MProcessOutsources";
import { TProject } from "../TProject";
import { TProjectProductProcess } from "../TProjectProductProcess";
import { TProjectProductProcessProductions } from "./TProjectProductProcessProductions";

export class TProjectProductProcessPredicted {

    public get IsTProjectProductProcessPredicted():boolean{
        return true ; 
    }

    /*****************************************
     * Bridge系
     *****************************************/

    /**
     * 工程
     */
     get Bridge_MProcessCatgory():MProcessCategory|undefined { 
        if (TProjectProductProcess.is(this)) {
            return this.MProcessCatgory ; 
        }
        return undefined ; 
    }

    
    /**
     * 数量
     */
    get Bridge_Qty():number { 
        if (TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)) {
            return this.TProjectProduct.Qty ?? 0 ; 
        }
        return 0 ; 
    }

    
    /**
     * 有効
     */
    get Bridge_IsEnabled():boolean { 
        if (TProjectProductProcess.is(this) ) {
            return this.is_enabled ?? false  ; 
        }
        return false  ; 
    }

    
    /**
     * 拠点ID
     */
     get Bridge_MBranchId():number { 
        if (TProjectProductProcess.is(this) ) {
            return this.m_branch_id ?? 0  ; 
        }
        return 0 ; 
    }

    //#region  材料系

    /*****************************************
     * 材料系
     *****************************************/
    
    /**
     * 有効な資材費のリスト
     */
     get EnabledMaterials():MProcessMaterial[] { 
        if ( _.isNil( this.Bridge_MProcessCatgory) ) return [] ; 
        if ( _.isNil( this.Bridge_MProcessCatgory.m_process_materials ) ) return [] ; 
        
        const _this = this ; 
        const filterd = this.Bridge_MProcessCatgory.m_process_materials.filter(function(x)
                        {
                            return _this.getIsEnabled(x) ; 
                        }) ;
        
        return filterd ; 

    }
    
    
    
    /**
     * 材料コスト
     */
    material_cost:number = 0 ; 
    get MaterialCost():number { return this.material_cost;}            
    set MaterialCost(v:number ){ this.material_cost = v ; }

    /**
     * 予測 ジョブあたり材料コスト  
     */
    predicted_material_cost_per_job:number = 0 ; 
    // get PredictedMaterialCostPerJob():number { return this.predicted_material_cost_per_job;}            
    // set PredictedMaterialCostPerJob(v:number ){ this.predicted_material_cost_per_job = v ; }

    /**
     * 予測 枚あたり材料コスト  
     */
    predicted_material_cost_per_qty:number = 0 ; 
    get PredictedMaterialCostPerQty():number { return this.predicted_material_cost_per_qty;}            
    set PredictedMaterialCostPerQty(v:number ){ this.predicted_material_cost_per_qty = v ; }

    

    /**
     * 材料費を使うか
     */
    get IsAvailableMaterial():boolean{
        if ( TProjectProductProcess.is(this) ){
            return ! this.IsOutsource && this.EnabledMaterials.length > 0 ; 
        }
        
        return false ; 
    }

    /**
     * 総材料費
     */
    get TotalMaterialCost():number { 
        const _this = this ; 
        
        let res = this.EnabledMaterials.reduce(function (acc, cur){
            const cost = _this.getMaterialCost(cur) ;
            return acc + cost ; 
        } , 0 ) ; 

        // 枚あたりの材料費
        let costPerQty = NumberUtil.invalid2zr(res / this.Bridge_Qty) ; 
        if (! this.Bridge_IsEnabled || ! this.IsAvailableMaterial){
            costPerQty = 0 ; 
            res = 0 ; 
        } 

        this.PredictedMaterialCostPerQty = costPerQty ;
        this.MaterialCost =  res ;
        
        return res ;
    }

    /**
     * 材料掛け率取得
     * @param mProcessMaterial 
     * @returns 
     */
    public getMaterialRate(mProcessMaterial:MProcessMaterial):number{
        let rate = this.getRateValue(mProcessMaterial.rate_type_m_kv_id ?? 0 ,
            mProcessMaterial.rate_value ?? "" ,
            mProcessMaterial.name + "-material") ; 

        return NumberUtil.invalid2zr(rate) ;    
    }

    /**
     * 材料単価
     * @param mProcessMaterial 
     * @returns 
     */
    public getMaterialUnitCost(mProcessMaterial:MProcessMaterial):number{
        let cost = 0 ; 
        
        if ( mProcessMaterial !== undefined && mProcessMaterial !== null ){
            switch ( mProcessMaterial.price_type) {
                case 2 :    // マトリクス
                    if ( _.isNil(mProcessMaterial.m_matrix_id)) return 0 ; 
                    const mtxId = NumberUtil.invalid2zr(mProcessMaterial.m_matrix_id ) ; 
                    const k1Col = mProcessMaterial.matrix_key_01_column ?? "" ; 
                    const k2Col = mProcessMaterial.matrix_key_02_column ?? "" ; 
                    cost = this.getMatrixVal(mtxId ,k1Col ,k2Col ) ; 
                    //console.log(`mtx: ${mtxId}  cost : ${cost}`) ; 
                    break ; 
                
                default : // カラム                    
                    cost = this.getClValue(mProcessMaterial.price_column ?? "") ; 
                    
            }
        }


        return cost ?? 0 ; 
    }

    /**
     * 材料掛け率 * 数量
     * @param mProcessMaterial 
     */
    protected getTotalMaterialRate(mProcessMaterial:MProcessMaterial):number {
        const rate = this.getMaterialRate(mProcessMaterial) ; 
        const totalRate = NumberUtil.invalid2zr(rate * this.Bridge_Qty) ; 

        return totalRate ; 
    
    }

    /**
     * 材料 コスト
     * @param mProcessMaterial 
     */
    public getMaterialCost(mProcessMaterial:MProcessMaterial):number{
        let totalCost = this.getTotalMaterialRate(mProcessMaterial) * 
                        this.getMaterialUnitCost(mProcessMaterial) ; 
        totalCost = NumberUtil.invalid2zr(totalCost) ; 
        totalCost = NumberUtil.round(totalCost ) ; 
        return totalCost ; 
    }

    //#endregion

    //#region  外注系

    
    /**
     * 有効な外注のリスト
     */
     get EnabledOutsources():MProcessOutsources[] { 
        if ( _.isNil( this.Bridge_MProcessCatgory) ) return [] ; 
        if ( _.isNil( this.Bridge_MProcessCatgory?.m_process_outsources ) ) return [] ; 

        if ( TProjectProductProcess.is(this)){
            if ( ! this.IsOutsource ) return [] ; 
        }

        const _this = this ;         
        const filterd = this.Bridge_MProcessCatgory.m_process_outsources.filter(function(x)
                        {
                            return _this.getIsEnabled(x) ; 
                        }) ;
        
        return filterd ; 

    }


    /**
     * 外注を使うか
     */
    get IsAvailableOutsource():boolean{
        if ( TProjectProductProcess.is(this) ){
            return this.IsOutsource && this.EnabledOutsources.length > 0 ; 
        }
        
        return false ; 
    }
    /**
     * 予測 枚あたり外注コスト/ジョブ
     */
    predicted_outsource_cost_per_job:number = 0 ; 
    get PredictedOutsourceCostPerJob():number { return this.predicted_outsource_cost_per_job;}
    set PredictedOutsourceCostPerJob(v:number ){ this.predicted_outsource_cost_per_job = v ; }
 
    /**
     * 予測 枚あたり外注コスト
     */
    predicted_outsource_cost_per_qty:number = 0 ; 
    get PredictedOutsourceCostPerQty():number { return this.predicted_outsource_cost_per_qty;}
    set PredictedOutsourceCostPerQty(v:number ){ this.predicted_outsource_cost_per_qty = v ; }

    /**
     * 外注コスト
     */
    outsource_cost:number = 0 ; 
    get OutsourceCost():number { return this.outsource_cost;}
    set OutsourceCost(v:number ){ this.outsource_cost = v ; }

    /**
     * 総外注費
     */
    get TotalOutsourceCost():number { 
        const _this = this ; 
            
        let res = this.EnabledOutsources.reduce(function (acc, cur){                
            const cost = _this.getOutsourceCost(cur) ;                 
            return acc + cost ; 
        } , 0 ) ; 
        

        // 枚あたりの外注費
        let costPerQty = NumberUtil.invalid2zr(res / this.Bridge_Qty) ; 
        if (! this.Bridge_IsEnabled || ! this.IsAvailableOutsource){
            costPerQty = 0 ; 
            res = 0 ; 
        } 
        
        this.PredictedOutsourceCostPerQty = costPerQty ;
        this.OutsourceCost =  res ;
        
        return res ;               

    }

    
    /**
     * 外注掛け率 
     * @param mProcessOutsource 
     * @returns 
     */
    public getOutsourceRate (mProcessOutsource:MProcessOutsources ):number {
            
        let rate = this.getRateValue(mProcessOutsource.rate_type_m_kv_id ,
                                    mProcessOutsource.rate_value  ,
                                    mProcessOutsource.name + "-outsource") ; 

        return rate ; 
    } 

    
    /**
     * 外注掛け率 * 数量
     * @param mProcessOutsource 
     * @returns 
     */
    public getTotalOutsourceRate (mProcessOutsource:MProcessOutsources ):number {
            
        const rate = this.getOutsourceRate(mProcessOutsource) ; 
        const totalRate = NumberUtil.invalid2zr(rate * this.Bridge_Qty) ; 

        return totalRate ; 
    } 

    /**
     * 外注 コスト(単価)
     * @param mProcessOutsource 
     * @returns 
     */
    public getOutsourceUnitCost (mProcessOutsource:MProcessOutsources ):number {
        //console.log(mProcessOutsource) ; 
        if ( TProjectProductProcess.is(this)){

            if ( this.is_outsource_cost_input) {
                // 手入力フラグ
                //console.log("From input" ) ; 
                return NumberUtil.invalid2zr(this.outsource_cost_by_input ) ; 
            }
            else if ( mProcessOutsource.is_price_ref_from_m_production){
                // 生産先から
                //console.log("From mProduction " ) ; 
                if ( TProjectProductProcessProductions.is(this)){
                    
                    if (this.OutsourceMProduction === undefined )  return 0 ; 
                    //console.log(this.m$cSelectedOutsourceMProduction) ; 
                    return this.OutsourceMProduction.cost_per_hour ?? 0 ; 
    
                }


            }
            else if ( mProcessOutsource.price_column !== undefined 
                && mProcessOutsource.price_column !== null  ){
                // カラムから
                //console.log("From column : " + mProcessOutsource.price_column + " val : " + this.colValue(mProcessOutsource.price_column)) ; 
    
                return this.getClValue(mProcessOutsource.price_column)  ; 
            }
            else {
                // ?
                //console.log("Error") ; 
                return 0 ; 
            }
            
        }
        return 0 ; 
    } 
    
    /**
     * 外注 コスト
     * @param mProcessOutsource 
     * @returns 
     */
    public getOutsourceCost (mProcessOutsource:MProcessOutsources ):number {

        let totalCost = 
            this.getTotalOutsourceRate(mProcessOutsource) * 
            this.getOutsourceUnitCost(mProcessOutsource) ; 

        if ( mProcessOutsource.is_ignore_qty ){
            totalCost /=  this.Bridge_Qty ; 
        }
        totalCost = NumberUtil.invalid2zr(totalCost) ; 
        totalCost = NumberUtil.round(totalCost ) ; 
        return totalCost ; 
    } 




    //#endregion


    //#region 作業コスト系

    
    /**
     * 有効な工程のリスト
     */
    get EnabledProcesses():MProcesses[] { 
        if ( _.isNil( this.Bridge_MProcessCatgory) ) return [] ; 
        if ( _.isNil( this.Bridge_MProcessCatgory?.m_processes ) ) return [] ; 

        const _this = this ;         
        const filterd = this.Bridge_MProcessCatgory.m_processes.filter(function(x)
                        {
                            return _this.getIsEnabled(x) ; 
                        }) ;
        
        return filterd ; 

    }

    
    /**
     * 作業費を使うか
     */
    get IsAvailableWork():boolean{
        if ( TProjectProductProcess.is(this) ){
            return ! this.IsOutsource && this.EnabledProcesses.length > 0 ; 
        }
        
        return false ; 
    }

    /**
     * 準備/ジョブを使うか
     */
    get IsAvailablePreparePerJob():boolean{
        if ( TProjectProductProcess.is(this) ){
            const found = this.EnabledProcesses.find( x => x.is_use_prepare_per_job) ; 
            return found !== undefined && ! this.IsOutsource;  
        }
        
        return false ; 
    }



    /**
     * 作業コスト
     */
    work_cost:number = 0 ; 
    get WorkCost():number { return this.work_cost;}
    set WorkCost(v:number ){ this.work_cost = v ; }

    /**
     * 総作業コスト
     */
    get TotalWorkCost() {
        let totalCost = this.TotalCostPerJob + this.TotalCostPerQty ; 

        if (! this.Bridge_IsEnabled || ! this.IsAvailableWork) totalCost = 0 ; 
        this.WorkCost = totalCost ; 
        return totalCost ; 
    } 

     
    /**
     * 予測作業時間
     */
    predicted_work_hour:number = 0 ; 
    get PredictedWorkHour():number { return this.predicted_work_hour;}            
    set PredictedWorkHour(v:number ){ this.predicted_work_hour = v ; }

    /**
     * 予測作業時間
     */
    get TotalWorkHour() {
        const totalSec = this.TotalSecPerJob + this.TotalSecPerQty * this.Bridge_Qty; 
        let totalHour = NumberUtil.invalid2zr(totalSec / 3600) ;  
        totalHour = NumberUtil.round(totalHour , 4) ;
        // console.log("totalHour : " + totalHour) ; 
        // console.log("totalHour : " + totalHour) ; 
        // console.log("this.Bridge_Qty : " + this.Bridge_Qty) ; 
        
        //if ( isNaN(totalHour) || ! isFinite(totalHour) ) totalHour = 0 ;     
        if (! this.Bridge_IsEnabled || ! this.IsAvailableWork) totalHour = 0 ; 
        this.PredictedWorkHour = totalHour ; 

        return totalHour ; 
    }




    
    //#region  準備/ジョブ
    

    /**
     * 予測 ジョブあたり準備秒数
     */
    predicted_sec_per_job:number = 0 ; 
    get PredictedPrepareSecPerJob():number { return this.predicted_sec_per_job;}            
    set PredictedPrepareSecPerJob(v:number ){ this.predicted_sec_per_job = v ; }
 
    
    /**
     * 予測 ジョブあたり作業コスト
     */
    predicted_work_cost_per_job:number = 0 ; 
    get PredictedWorkCostPerJob():number { return this.predicted_work_cost_per_job;}
    set PredictedWorkCostPerJob(v:number ){ this.predicted_work_cost_per_job = v ; }
    
    /**
     * 準備/ジョブ 総秒数
     */
    get TotalSecPerJob():number{
        const _this = this ; 
            
        let res = this.EnabledProcesses.reduce(function (acc, cur){
            let prepSec = 0 ; 
            if ( cur.is_use_prepare_per_job){
                prepSec = _this.getPreparePerJobSec(cur) ; 
            }
            return acc + prepSec ; 
        } , 0 ) ; 

        if (! this.Bridge_IsEnabled) res = 0 ; 
        this.PredictedPrepareSecPerJob =  res ;             
        
        return res ; 
    }

    /**
     * 準備/ジョブ 総コスト
     */
    get TotalCostPerJob():number {            
        const _this = this ; 
        
        let res = this.EnabledProcesses.reduce(function (acc, cur){
            let prepCost = 0 ; 
            if ( cur.is_use_prepare_per_job){
                prepCost = _this.getPreparePerJobCost(cur) ; 
            }
            return acc + prepCost ; 
        } , 0 ) ; 

        if (! this.Bridge_IsEnabled) res = 0 ; 
        this.PredictedWorkCostPerJob =  res ;
        return res ; 
    } 




    /**
     * 準備/ジョブ 基準値
     * @param mProcess 
     * @returns 
     */
    public getPreparePerJobBaseValue( mProcess:MProcesses):number {
        if (! mProcess.is_use_prepare_per_job ) return 0 ; 
        if (mProcess.prepare_per_job_speed_ref_type == null ) return 0 ; 

        switch ( mProcess.prepare_per_job_speed_ref_type){
            case 1 : // 生産先モード
                if ( TProjectProductProcessProductions.is(this)){
                    return this.getSelectedMProductionModePrepareSecPerJob(mProcess.prepare_per_job_target_m_production_no) ; 
                }
                
            case 2 : // マトリクス                    
                const mtxId = NumberUtil.invalid2zr(mProcess.prepare_per_job_speed_m_matrix_id ) ; 
                const k1Col = mProcess.prepare_per_job_speed_matrix_key_01_column ; 
                const k2Col = mProcess.prepare_per_job_speed_matrix_key_02_column ; 
                return this.getMatrixVal(mtxId ,k1Col  ,k2Col  ) ; 
            case 3 : // 固定値
                return Number(mProcess.prepare_per_job_speed_ref_value) ; 
        }       
        
        return 0 ; 
        
    } 
    
    /**
     * 準備/ジョブ 基準値(難易度反映)
     * @param mProcess 
     * @returns 
     */
    public getPreparePerJobBaseRealValue(mProcess:MProcesses):number{
        const baseValue = this.getPreparePerJobBaseValue(mProcess)  ; 
        const level = this.getLevelOfDifficulty(mProcess.prepare_per_job_speed_difficulty_column) ; 
        //const level = this.levelOfDifficulty(mProcess.operation_speed_difficulty_column) ; 
        let val = NumberUtil.invalid2zr(baseValue / level) ; 
        //if ( isNaN(val) || ! isFinite(val) ) val = 0  ; 

        return val; 
        
    } 

    /**
     * 準備/ジョブ 秒数 
     * @param mProcess 
     * @returns 
     */
    public getPreparePerJobSec (mProcess:MProcesses):number {
        const val = this.getPreparePerJobBaseRealValue(mProcess)  ; 
        let rate = 0 ; 
        if ( mProcess.is_use_prepare_per_job ){
            rate = this.getRateValue(mProcess.prepare_per_job_rate_type_m_kv_id ,mProcess.prepare_per_job_rate_value ,mProcess.name + "-PrepPerJob") ; 
        }
        let calced = NumberUtil.invalid2zr(val * rate) ; 
        calced = NumberUtil.round(calced , 4 ) ; 
        return calced; 
    } 
    
    /**
     * 準備/ジョブ 時間数 
     * @param mProcess 
     * @returns 
     */
    public getPreparePerJobHour(mProcess:MProcesses):number {
        const totalSec = this.getPreparePerJobSec(mProcess)  ; 
        let totalHour = NumberUtil.invalid2zr(totalSec / 3600) ; 
        //if ( isNaN(totalHour) || ! isFinite(totalHour) ) totalHour = 0 ; 
        totalHour = NumberUtil.round(totalHour , 4 ) ; 
        return totalHour ; 
    } 

    /**
     * 準備/ジョブ 総コスト
     * @param mProcess 
     * @returns 
     */
    public getPreparePerJobCost (mProcess:MProcesses):number {
        let totalCost = 0 ; 
        if ( mProcess.prepare_per_job_price_column )
        {
            
            const totalRate = this.getRateValue(mProcess.prepare_per_job_rate_type_m_kv_id ,mProcess.prepare_per_job_rate_value  ,"prep_per_job"); 
            const cost = this.getClValue(mProcess.prepare_per_job_price_column) ; 
            //console.log(`totalRate : ${totalRate} cost : ${cost}`) ; 

            totalCost = NumberUtil.invalid2zr(totalRate * cost) ; 
        }
        else
        {
            const totalHour = this.getPreparePerJobHour(mProcess) ; 
            
            let costPerHour = 0 ; 
            if ( TProjectProductProcessProductions.is(this)){
                costPerHour = this.getSelectedMProductionCostPerHour(mProcess.prepare_per_job_target_m_production_no) ; 
            }
            

            totalCost = NumberUtil.invalid2zr(totalHour * costPerHour );                  

        }
        return NumberUtil.round(totalCost) ;             
    } 

    //#endregion

    //#region 準備・稼働/枚

    /**
     * 予測 枚あたり作業コスト
     */
    predicted_work_cost_per_qty:number = 0 ; 
    get PredictedWorkCostPerQty():number { return this.predicted_work_cost_per_qty;}
    set PredictedWorkCostPerQty(v:number ){ this.predicted_work_cost_per_qty = v ; }
 

    /**
     * 予測 枚あたり秒数
     */
    predicted_sec_per_qty:number = 0 ; 
    get PredictedSecPerQty():number { return this.predicted_sec_per_qty;}            
    set PredictedSecPerQty(v:number ){ this.predicted_sec_per_qty = v ; }

    
    /**
     * 準備・稼働/枚 総秒数
     */
    get TotalSecPerQty():number {            
        const _this = this ; 
        
        let res = this.EnabledProcesses.reduce(function (acc, cur){
            // 準備
            let prepSec = 0 ; 
            if ( cur.is_use_prepare_per_qty){
                prepSec = _this.getPreparePerQtySec(cur) ; 
            }

            // オペ
            let opSec = 0 ; 
            if ( cur.is_use_operation){
                let opHour = _this.getOperationHour(cur) ; 
                opSec = NumberUtil.invalid2zr( opHour * 3600) ;
                //console.log("opSec " + opSec + " hour:" + opHour ) ; 
            }
            
            return acc + prepSec + opSec ; 
        } , 0 ) ; 
        
        if (! this.Bridge_IsEnabled) res = 0 ; 
        res = NumberUtil.round(res , 4 ) ;
        //console.log("cPredictedSecPerQty : " + res) ; 
        this.PredictedSecPerQty = res ;
        
        return res ; 
    } 

    /**
     * 準備・稼働/枚 総コスト
     */
    get TotalCostPerQty():number{
        const _this = this ; 
            
        // console.log("TotalCostPerQty " + this.Bridge_MProcessCatgory?.id) ;  
        // console.log(this.EnabledProcesses) ; 
        let res = this.EnabledProcesses.reduce(function (acc, cur){
            
            // 準備
            let prepCost = 0 ; 
            if ( cur.is_use_prepare_per_qty){
                prepCost = _this.getPreparePetQtyTotalCost(cur) ; 
            }

            // オペ
            let opCost = 0 ; 
            if ( cur.is_use_operation){
                opCost = _this.getOperationTotalCost(cur) ;                     
                
                // console.log("opCost :"  + opCost) ; 
            }
            
            
            return acc + prepCost + opCost ; 
        } , 0 ) ; 

        if (! this.Bridge_IsEnabled) res = 0 ; 
        let costPerQty = NumberUtil.invalid2zr( res / this.Bridge_Qty) ;            
        this.PredictedWorkCostPerQty =  costPerQty ; 

        return NumberUtil.round(res) ; 
    }




    //#region  準備/枚

    /**
     * 準備/枚 基準値
     */
    public getPreparePerQtyBaseValue(mProcess:MProcesses):number {
        if (! mProcess.is_use_prepare_per_qty ) return 0 ; 
        if (mProcess.prepare_per_qty_speed_ref_type == null ) return 0 ; 

        switch ( mProcess.prepare_per_qty_speed_ref_type){
            case 1 : // 生産先モード
                if ( TProjectProductProcessProductions.is(this)){
                    return this.getSelectedMProductionModePrepareSecPerJob(mProcess.prepare_per_qty_target_m_production_no) ; 
                }
            case 2 : // マトリクス                    
                const mtxId = NumberUtil.invalid2zr(mProcess.prepare_per_qty_speed_m_matrix_id ) ; 
                const k1Col = mProcess.prepare_per_qty_speed_matrix_key_01_column ; 
                const k2Col = mProcess.prepare_per_qty_speed_matrix_key_02_column ; 
                return this.getMatrixVal(mtxId ,k1Col ,k2Col ) ; 
                
            case 3 : // 固定値
                return Number(mProcess.prepare_per_qty_speed_ref_value) ; 
        }       
        
        return 0 ; 
        
    } 

    /**
     * 準備/枚 基準値(難易度反映)
     * @param mProcess 
     * @returns 
     */
    public getPreparePerQtyBaseRealValue ( mProcess:MProcesses):number {
        const baseValue = this.getPreparePerQtyBaseValue(mProcess)  ; 
        const level = this.getLevelOfDifficulty(mProcess.prepare_per_qty_speed_difficulty_column) ; 
        //const level = this.levelOfDifficulty(mProcess.operation_speed_difficulty_column) ; 
        let val = NumberUtil.invalid2zr(baseValue * level) ; 
        //if ( isNaN(val) || ! isFinite(val) ) val = 0  ; 
        val = NumberUtil.round(val , 4) ; 
        return val; 
        
    } 
        
    /**
     * 準備/枚 秒数 
     * @param mProcess 
     * @returns 
     */
    public getPreparePerQtySec(mProcess:MProcesses):number {
        const val = this.getPreparePerQtyBaseRealValue(mProcess)  ; 
        let rate = 0 ; 
        if ( mProcess.is_use_prepare_per_qty ){
            rate = this.getRateValue(mProcess.prepare_per_qty_rate_type_m_kv_id ,mProcess.prepare_per_qty_rate_value ,mProcess.name + "-PrepPerQty") ; 
        }
            
        let calced = NumberUtil.invalid2zr(val * rate ) ; 
        //calced = NumberUtil.round(calced , 4) ; 

        return calced ; 
    } 

    /**
     * 準備/枚 総秒数 
     * @param mProcess 
     * @returns 
     */
    public getPreparePerQtyTotalSec(mProcess:MProcesses):number {
        let totalSec = this.getPreparePerQtySec(mProcess) * this.Bridge_Qty ; 
        totalSec = NumberUtil.round(totalSec , 4) ; 
        return totalSec ; 
    } 
    
    /**
     * 準備/枚 総時間 
     * @param mProcess 
     * @returns 
     */
    public getPreparePetQtyTotalHour(mProcess:MProcesses):number {
        const totalSec = this.getPreparePerQtyTotalSec(mProcess) ; 
        let totalHour = NumberUtil.invalid2zr(totalSec / 3600) ; 
        totalHour = NumberUtil.round(totalHour , 4) ; 
        //if ( isNaN(totalHour) || ! isFinite(totalHour) ) totalHour = 0 ; 
        return totalHour ; 
    } 
    
    /**
     * 準備/枚 総コスト
     * @param mProcess 
     * @returns 
     */
    public getPreparePetQtyTotalCost(mProcess:MProcesses):number {
        const totalHour = this.getPreparePetQtyTotalHour(mProcess) ; 
        let costPerHour = 0 ; 
        if ( TProjectProductProcessProductions.is(this)){
            costPerHour = this.getSelectedMProductionCostPerHour(mProcess.prepare_per_qty_target_m_production_no) ; 
        }

        let totalCost = NumberUtil.invalid2zr(totalHour * costPerHour) ; 
        
        //if ( isNaN(totalCost) || ! isFinite(totalCost) ) totalCost = 0 ; 
        return NumberUtil.round(totalCost) ; 
    } 

    //#endregion

    //#region 稼働/枚

    /**
     * 稼働 基準値
     * @param mProcess 
     * @returns 
     */
    public getOperationBaseValue( mProcess:MProcesses):number {
        if (! mProcess.is_use_operation ) return 0 ; 
        if (mProcess.operation_speed_ref_type == null ) return 0 ; 

        switch ( mProcess.operation_speed_ref_type){
            case 1 : // 生産先モード
                if ( TProjectProductProcessProductions.is(this)){
                    return this.getSelectedMProductionSpeed(mProcess.operation_target_m_production_no) ; 
                }
            case 2 : // マトリクス                    
                const mtxId = NumberUtil.invalid2zr(mProcess.operation_speed_m_matrix_id ) ; 
                //console.log("mtxId" + mtxId)  ; 
                const k1Col = mProcess.operation_speed_matrix_key_01_column ; 
                const k2Col = mProcess.operation_speed_matrix_key_02_column ; 
                //console.log("mtxVal " + this.getMatrixVal(mtxId ,k1Col ,k2Col )) ; 
                return this.getMatrixVal(mtxId ,k1Col ,k2Col ) ; 
                
            case 3 : // 固定値
                return Number(mProcess.operation_speed_ref_value) ; 

            
            case 4 : // カラム
                return NumberUtil.invalid2zr(this.getClValue(mProcess.operation_speed_ref_value ?? "")) ;          
        }       
        
        return 0 ; 
        
    } 
    

    /**
     * 稼働/枚 基準値(難易度反映)
     * @param mProcess 
     * @returns 
     */
    getOperationBaseRealValue ( mProcess:MProcesses):number {
        const baseValue = this.getOperationBaseValue(mProcess)  ;             
        const level = this.getLevelOfDifficulty(mProcess.operation_speed_difficulty_column) ; 

        let val = NumberUtil.invalid2zr(baseValue / level) ; 
        //if ( isNaN(val) || ! isFinite(val) ) val = 0  ; 

        return val ; 
        
    } 
    
    /**
     * 準備/枚 秒数 
     * @param mProcess 
     * @returns 
     */
    getOperationHour (mProcess:MProcesses):number {
        const val = this.getOperationBaseRealValue(mProcess)  ; 
        let rate = 0 ; 
        if ( mProcess.is_use_operation ){          
            //console.log("hit kv:" + mProcess.operation_rate_type_m_kv_id + " val:" + mProcess.operation_rate_value )       ; 
            rate = this.getRateValue(mProcess.operation_rate_type_m_kv_id ,mProcess.operation_rate_value ,mProcess.name + "-op" ) ; 
        }
        //console.log("mProcess.is_use_operation : " + mProcess.is_use_operation) ; 
        //console.log("rate:" + rate) ; 

        let hour = NumberUtil.invalid2zr(rate / val)  ; 
        //hour = NumberUtil.round(hour , 4) ; 
        //if ( isNaN(hour) || ! isFinite(hour)) hour = 0 ; 

        return hour ; 
    }    
    /**
     * 稼働/枚 総秒数 
     * @param mProcess 
     * @returns 
     */
    getOperationTotalSec (mProcess:MProcesses):number {
        let totalSec = NumberUtil.invalid2zr((this.getOperationHour(mProcess) * this.Bridge_Qty) / 3600) ; 
        totalSec = NumberUtil.round(totalSec ,4) ; 
        //if ( isNaN(totalSec) || ! isFinite(totalSec) ) totalSec = 0 ; 
        return totalSec ; 
    } 
    /**
     * 稼働/枚 総時間 
     * @param mProcess 
     * @returns 
     */
    getOperationTotalHour (mProcess:MProcesses):number {        
        let totalHour = NumberUtil.invalid2zr(this.getOperationHour(mProcess) *  this.Bridge_Qty); 
        //if ( isNaN(totalHour) || ! isFinite(totalHour) ) totalHour = 0 ; 
        totalHour = NumberUtil.round(totalHour ,4)  ;
        return totalHour; 
    } 

    /**
     * 稼働/枚 総コスト
     * @param mProcess 
     * @returns 
     */
    getOperationTotalCost (mProcess:MProcesses):number {
        const totalHour = this.getOperationTotalHour(mProcess) ; 
        let costPerHour = 0 ; 
        if ( TProjectProductProcessProductions.is(this)){
            costPerHour = this.getSelectedMProductionCostPerHour(mProcess.operation_target_m_production_no) ;             
        }
        // console.log("totalHour:" + totalHour) ; 

        let totalCost = NumberUtil.invalid2zr(totalHour * costPerHour) ; 
        
            
        //if ( isNaN(totalCost) || ! isFinite(totalCost) ) totalCost = 0 ; 
        return NumberUtil.round(totalCost) ; 
    } 



    /**
     * 稼働 基準値 単位
     * @param mProcess 
     * @returns 
     */
    getOperationBaseUnit ( mProcess:MProcesses):string {
        if (! mProcess.is_use_operation ) return "" ; 
        if (mProcess.operation_speed_ref_type == null ) return "" ; 

        switch ( mProcess.operation_speed_ref_type){
            case 1 : // 生産先モード
                if ( TProjectProductProcessProductions.is(this)){
                    const mode = this.getSelectedMProductionMode(mProcess.operation_target_m_production_no) ; 
                    if ( mode === undefined 
                        || mode.speed_unit_m_kv === undefined || mode.speed_unit_m_kv == null) return "" ; 

                    return mode.speed_unit_m_kv.kv_name ?? "" ; 
                }
            case 2 : 
                return "0" ; 
            case 3 : // 固定値
                return mProcess.operation_speed_ref_unit_name ?? "" ; 
        }       
        
        return "" ; 
        
    }

        
    //#endregion


    //#endregion


  

    

    




    //#endregion    

    //#region  トータル系

    total_cost:number = 0 ; 
    get TotalCost():number { 
        let val = 0 ; 

        val = NumberUtil.invalid2zr(this.WorkCost)  
            + NumberUtil.invalid2zr(this.MaterialCost)
            + NumberUtil.invalid2zr(this.OutsourceCost) ; 

        this.total_cost = val  ; 
        return this.total_cost ;
    
    }
    // set TotalCost(v:number ){ this.total_cost = v ; }


    /**
     * 予測 ジョブあたり総コスト
     */
    predicted_cost_per_job:number = 0 ; 
    get PredictedCostPerJob():number { 
        let val = 0 ; 

        val = NumberUtil.invalid2zr(this.predicted_material_cost_per_job) 
            + NumberUtil.invalid2zr(this.PredictedOutsourceCostPerJob)
            + NumberUtil.invalid2zr(this.PredictedWorkCostPerJob ) ; 

        this.predicted_cost_per_job = val ; 
        return this.predicted_cost_per_job;
    
    }
    // set PredictedCostPerJob(v:number ){ this.predicted_cost_per_job = v ; }

    /**
     * 予測 枚あたり総コスト
     */
    predicted_cost_per_qty:number = 0 ; 
    get PredictedCostPerQty():number { 
        let val = 0 ; 

        val = NumberUtil.invalid2zr(this.PredictedMaterialCostPerQty) 
            + NumberUtil.invalid2zr(this.PredictedOutsourceCostPerQty)
            + NumberUtil.invalid2zr(this.PredictedWorkCostPerQty ) ; 

        this.predicted_cost_per_qty = val ;
        return this.predicted_cost_per_qty;
    
    }
    // set PredictedCostPerQty(v:number ){ this.predicted_cost_per_qty = v ; }




  
    //#endregion

    //#region Methods

    /**
     * 掛け率を取得
     * @param valType 
     * @param value 
     * @param target 
     * @returns 
     */
    public getRateValue(valType:number|undefined|null , value:string|undefined|null  ,target = ""):number { 
        // console.log("ValType : " + valType) ; 
        switch ( valType ){
            case MKvsConst.MProcesses.RATE_TYPE_1  :     // 1固定
                return 1 ; 
            case MKvsConst.MProcesses.RATE_TYPE_PRODUCT_COLUMN :     // 商品カラム
                // console.log("RATE_TYPE_PRODUCT_COLUMN") ; 
                if ( TProjectProductProcess.is(this) && !_.isNil(this.TProjectProduct)){
                    // @ts-ignore
                    return NumberUtil.invalid2zr(this.TProjectProduct[value]) ;     
                }
                else { 
                    console.error(`Not TProjectProductProcess or TProjectProduct is null for rate valuetype [ type : ${valType} value : ${value} target : ${target}`) ;                         
                }
                // if (Object.keys(this.params).indexOf(value) === -1 ) return 0 ; 
                // return NumberUtil.invalid2zr(this.params[value]) ; 
            case MKvsConst.MProcesses.RATE_TYPE_COLUMN :     // カラム
                return NumberUtil.invalid2zr(this.getClValue(value ?? "")) ;          
            default : 
                console.error(`Not found rate valuetype [ type : ${valType} value : ${value} target : ${target}`) ; 
        }

        //console.log("2 rateValue " +  value) ; 

        return NumberUtil.invalid2zr( Number(value) ) ; 
    }

    /**
     * カラムの値を取得
     * @param colName 
     * @returns 
     */
    public getClValue(colName:string):number { 


        // @ts-ignore
        return this[colName] ?? 0  ;          
    }

    /**
     * カラムの値を取得 for String
     * @param colName 
     * @returns 
     */
    public getColValueForString(colName:string):string { 
        // @ts-ignore
        return this[colName] ?? ""  ;          
    }

    /**
     * 難易度
     * @param colName 
     * @returns 
     */
    public getLevelOfDifficulty(colName:string|undefined|null):number { 
        if ( _.isNil(colName)) return 1 ; 

        // @ts-ignore
        return this[colName] ?? 1 ;         
    }

    
    /**
     * マトリクスから値取得
     * @param mMtxId 
     * @param k1Col 
     * @param k2Col 
     * @returns 
     */
    protected getMatrixVal(mMtxId:number  ,
        k1Col:string|undefined|null ,
        k2Col:string|undefined|null             
    ){
        let val = 0 ; 
        //const k1Col = mProcess.operation_speed_matrix_key_01_column ; 
        const k1 = this.getColValueForString(k1Col ?? "") ; 
        const isK1Valid = ( k1Col == null || k1Col == "" ) || k1 != ""  ; 
        
        //const k2Col = mProcess.operation_speed_matrix_key_02_column ; 
        const k2 = this.getColValueForString(k2Col ?? "") ; 
        const isK2Valid = ( k2Col == null || k2Col == "" ) || k2 != ""  ; 

        if ( isK1Valid && isK2Valid) {
            if ( mMtxId != 0 ){
                if ( TProjectProductProcess.is(this) && ! _.isNil(this.Store)){                    
                    // @ts-ignore
                    const res = this.Store.masters.getMtxById(this.Bridge_MBranchId ,mMtxId , k1 ,k2) ;                                         
                    if ( res.error !== undefined) 
                    {
                        console.error(res.error) ; 
                    }
                    else{
                        val = Number(res.val1)
                    }    
                }
            }
        }
        return val ; 
    }


    /**
     * enabled_is_columnの値を評価し、有効かを返す
     * @param v 
     * @returns 
     */
    protected getIsEnabled(v:MProcessMaterial|MProcesses|MProcessOutsources):boolean{
        
        const colNames = v.enabled_is_column ; 
        if ( colNames === undefined || colNames == null || colNames == "" ) return true ; 

        const splitedColNames = colNames.split(";") ; 
        // let isEnable = true ; 

        for ( const cName of splitedColNames){
            // Not対応
            if ( cName.substring(0,1) == "!"){
                // @ts-ignore
                const notRes = ! this[cName.substring(1)] ;
                if ( ! notRes ) return false ; 
            }
            else { 
                // @ts-ignore
                const res = this[cName] ;  
                if ( ! res ) return false ; 
            }

        }

        return true ; 
    }

    //#endregion
    

    public static Init(p:TProjectProductProcessPredicted){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }        
        }
    }

    public static is(arg:any):arg is TProjectProductProcessPredicted { 
        if ( arg?.IsTProjectProductProcessPredicted === undefined) return false ; 
        return arg.IsTProjectProductProcessPredicted ; 
    } 
    
}


