import _, { isBoolean } from "lodash";
import ClassUtil from "../../../../frameworks/ClassUtil";
import MastersUtil from "../../../../frameworks/MastersUtil";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { applyTsMixins } from "../../../../frameworks/TsMixins";
import { MCustomer } from "../../../masters/class/models/MCustomer";
import { MKvCategory } from "../../../masters/class/models/MKvCategory";
import { MMaterial } from "../../../masters/class/models/MMaterial";
import { MMaterialDetail } from "../../../masters/class/models/MMaterialDetail";
import { MProcessCategory } from "../../../masters/class/models/MProcessCategory";
import { MProcesses } from "../../../masters/class/models/MProcesses";
import { MProcessMaterial } from "../../../masters/class/models/MProcessMaterial";
import { MProcessOutsources } from "../../../masters/class/models/MProcessOutsources";
import { MProductCategory } from "../../../masters/class/models/MProductCategory";
import { MProduction } from "../../../masters/class/models/MProduction";
import { MProductionMode } from "../../../masters/class/models/MProductionMode";
import { MProductionOption } from "../../../masters/class/models/MProductionOption";
import { TProductionProcessPlan } from "../../../tProductions/class/models/TProductionProcessPlan";
import { TProductionResult } from "../../../tProductions/class/models/TProductionResult";
import TProjectProductProcessUtil from "../TProjectProductProcessUtil";
import { TProjectAbstract } from "./TProjectAbstract";
import { TProjectProduct } from "./TProjectProduct";
import { TProjectProductProcessBacksideTape } from "./tsMixins/process/TProjectProductProcessBacksideTape";
import { TProjectProductProcessBoardMaterial } from "./tsMixins/process/TProjectProductProcessBoardMaterial";
import { TProjectProductProcessConstruction } from "./tsMixins/process/TProjectProductProcessConstruction";
import { TProjectProductProcessDataCreation } from "./tsMixins/process/TProjectProductProcessDataCreation";
import { TProjectProductProcessExpendable } from "./tsMixins/process/TProjectProductProcessExpendable";
import { TProjectProductProcessJointCartain } from "./tsMixins/process/TProjectProductProcessJointCartain";
import { TProjectProductProcessLami } from "./tsMixins/process/TProjectProductProcessLami";
import { TProjectProductProcessMaterial } from "./tsMixins/process/TProjectProductProcessMaterial";
import { TProjectProductProcessMulticut } from "./tsMixins/process/TProjectProductProcessMulticut";
import { TProjectProductProcessPacking } from "./tsMixins/process/TProjectProductProcessPacking";
import { TProjectProductProcessPate } from "./tsMixins/process/TProjectProductProcessPate";
import { TProjectProductProcessPlotHalfcut } from "./tsMixins/process/TProjectProductProcessPlotHalfcut";
import { TProjectProductProcessPostCartain } from "./tsMixins/process/TProjectProductProcessPostCartain";
import { TProjectProductProcessPostPvc } from "./tsMixins/process/TProjectProductProcessPostPvc";
import { TProjectProductProcessPrimar } from "./tsMixins/process/TProjectProductProcessPrimar";
import { TProjectProductProcessPrint } from "./tsMixins/process/TProjectProductProcessPrint";
import { TProjectProductProcessPurchaseProduct } from "./tsMixins/process/TProjectProductProcessPurchaseProduct";
import { TProjectProductProcessReboardWork } from "./tsMixins/process/TProjectProductProcessReboardWork";
import { TProjectProductProcessSheetCut } from "./tsMixins/process/TProjectProductProcessSheetCut";
import { TProjectProductProcessUniteMaterials } from "./tsMixins/process/TProjectProductProcessUniteMaterials";
import { TProjectProductProcessUvcoat } from "./tsMixins/process/TProjectProductProcessUvcoat";
import { TProjectProductProcessProductions } from "./tsMixins/TProjectProductProcessProductions";
import { TProjectProductProcessUseBoardLayout } from "./tsMixins/TProjectProductProcessUseBoardLayout";
import { TProjectProductProcessSurfaceCoating } from "./tsMixins/process/TProjectProductProcessSurfaceCoating";
import { TProjectProductProcessPredicted } from "./tsMixins/TProjectProductProcessPredicted";
import { IDbHasTimestamp } from "../../../../models/IDbHasTimestamp";
import { TProjectProductProcessDiscount } from "./tsMixins/process/TProjectProductProcessDiscount";
import { TProjectProductProcessUniteRoleMaterials } from "./tsMixins/process/TProjectProductProcessUniteRoleMaterials";

/**
 * 商品工程
 */
export interface ITProjectProductProcess {  

    //list:Array<object> ;
    

    
}

export class TProjectProductProcess extends TProjectAbstract implements ITProjectProductProcess,IDbHasTimestamp { 

    // protected _store?:object  = undefined; 
    protected _t_project_product?:TProjectProduct  = undefined; 
    public _mixins ?:any[] ; 

    created_at:Date|null = null ;     
    updated_at:Date|null = null ;     


    public is_enabled:boolean = false ;
    public is_removable:boolean = false ;
    public order_no:number = 0  ; 

    public m_branch_id?:number  = undefined;
    public m_process_category_id?:number  = undefined; 
    public m_process_category?:MProcessCategory = undefined ; 

    public planed_production_at?:any   = undefined; 
    // public predicted_work_hour?:number ; 
    public t_production_process_plan?:TProductionProcessPlan  = undefined ; 
    public t_production_process_plans:Array<TProductionProcessPlan> = [] ; 
    public t_p_order_details:Array<object> = [] ; 

    public t_production_results : Array<TProductionResult> = []; 

    public t_project_product?:TProjectProduct  = undefined; 
    
    // 生産先ID
    m_production_id_01?:number = undefined;
    m_production_mode_id_01?:number = undefined;
    m_production_option_id_01?:number = undefined ;

    m_production_id_02?:number = undefined ;
    m_production_mode_id_02?:number = undefined ;
    m_production_option_id_02?:number = undefined ;

    m_production_id_03?:number = undefined ;
    m_production_mode_id_03?:number = undefined ;
    m_production_option_id_03?:number = undefined ;

    m_production_id_04?:number = undefined ;
    m_production_mode_id_04?:number = undefined ;
    m_production_option_id_04?:number = undefined ;

    memo?:string = undefined ; 

    get MProductCategory():MProductCategory|undefined { 
        if (! _.isNil( this.TProjectProduct)  ){
            return this.TProjectProduct.MProductCategory ; 
        }
        return undefined ; 
    }


    /**
     * 材料自体のカテゴリーID
     */
    get MaterialCategoryMKvId():number { 
        return this.MProductCategory?.material_category_m_kv_id ?? 0 ; 
    }

    /**
     * 材料の商品ーフィルタ用MKvID
     */
    get MaterialSelectCategoryMKvId():number { 
        if (! _.isNil( this.TProjectProduct) && ! _.isNil(this.Store) ){
        
            // @ts-ignore
            const category:MKvCategory|undefined = this.Store.masters.getMKvCategoryByKey('m_materials-category_m_kv_id') ;                         
            if ( category === undefined) return 0 ; 

            const foundMKv = category.m_kvs.find(x => x.id == this.MaterialCategoryMKvId ) ;             
            return foundMKv?.target_m_kv_category_id ?? 0 ; 
        }
        return 0 ; 
    }

    // summary
    process_mater:number = 0 ; 
    get ProcessMater () : number { 

        let val = 0 ; 
        if (! _.isNil( this._t_project_product) ){
            val = NumberUtil.ceil(this.TotalProcesMater / this._t_project_product?.Qty , 3 )  ; 
        }
        this.process_mater = val  ; 
        return this.process_mater ; 
    }

    
    total_process_mater:number = 0 ; 
    get TotalProcesMater ():number { 

        return this.total_process_mater; 
    } 

    /**
     * カスタム㎡数　（両面などで使用）
     */
    custom_sqm:number = 0 ;     
    get CustomSqm(){ return this.custom_sqm ; }
    set CustomSqm(val){ this.custom_sqm = val ; }
    
    /**
     * 合計カスタム㎡数　（両面などで使用）
     */
    total_custom_sqm:number = 0 ; 
    get TotalCustomSqm ():number { 

        let val = 0 ; 
        if (! _.isNil( this._t_project_product) ){
            val = NumberUtil.ceil(this.CustomSqm * this._t_project_product?.Qty , 3 )  ; 
        }

        this.total_custom_sqm = val  ; 
        return this.total_custom_sqm ; 
    } 
    
    

    // material
    _m_material01?:MMaterial = undefined; 
    get m_material01()  { return this._m_material01 ; }
    set m_material01(val) { 
        let parsed = undefined ; 
        // console.log("val --- ") ; 
        // console.log(val) ; 
        if (! _.isNil(val)){
            // console.log("parsing") ; 
            // parsed = MMaterial.is(val) ? val : MMaterial.parse(val) ; 
            parsed = MMaterial.parse(val) ; 
        }         
        // console.log("parsed is " + MMaterial.is(parsed)) ; 
        // console.log(JSON.stringify(val)) ; 
        // console.log(JSON.stringify(parsed)) ; 

        this._m_material01 = parsed; 
        if ( TProjectProductProcessMaterial.is(this) || TProjectProductProcessBoardMaterial.is(this)){
            // console.log("set m_material01 ")  ; 
            // console.log(val)  ; 
            
            this.TProjectProduct?.UpdateMainMaterial() ; 
            
        }
        this.onMaterial01Changed() ; 
    }

    /**
     * m_material01変更時
     * Override用
     */
    protected onMaterial01Changed(){ 
        // console.log("onMaterial01Changed") ; 
    }


    m_material_id_01?:number = undefined; 
    get MMaterialId01(){ return this.m_material_id_01 ; }
    set MMaterialId01(val){ this.m_material_id_01 = val ; }


    /**
     * マスタ引き材料名
     */
    get MaterialName01():string { 
        return MastersUtil.getMaterialName(this.m_material01) ;
    }
    
    /**
     * マスタ引き材料名　正式
     */
    get MaterialLongName01():string{        
        return this.m_material01?.name ?? ""  ; 
    }

    /**
     * 材料コスト
     */
    get MaterialCost01() :number {        
        return MMaterial.getHighestCost(this.m_material01) ; 
    }
    
    /**
     * 単価基準名
     */
    get MaterialPriceKvName01():string { 
        if (! TProjectProductProcess.is(this)) return ""; 

        if ( _.isNil(this.m_material01) ) return "" ;  

        // @ts-ignore 
        const priceCalcMKv = this.Store.masters.getMKvById(this.m_material01.total_price_calc_m_kv_id) ;             
        return priceCalcMKv?.kv_name ; 
        
    }

    /**
     * 材料明細
     */
     get MaterialDetails01():MMaterialDetail[]{        
        return this.m_material01?.m_material_details ?? []  ; 
    }



    // 
    display_01:string =""; 
    display_02:string =""; 
    display_03:string =""; 
    display_04:string =""; 
    display_05:string =""; 
    display_06:string =""; 
    display_07:string =""; 
    display_08:string =""; 
    display_09:string =""; 

    display_prod_01:string ="" ; 
    display_prod_02:string ="" ; 
    display_prod_03:string ="" ; 
    display_prod_04:string ="" ; 
    display_prod_05:string ="" ; 
    display_prod_06:string ="" ; 
    display_prod_07:string ="" ; 
    display_prod_08:string ="" ; 
    display_prod_09:string ="" ; 

    display_order_01:string ="" ;
    display_order_02:string ="" ;
    display_order_03:string ="" ;
    display_order_04:string ="" ;
    display_order_05:string ="" ;
    display_order_06:string ="" ;



    /*****************************************
     * その他
     *****************************************/
    /**
     * 必要作業者数
     */
    num_of_workers:number = 1 ; 

    /*****************************************
     * 仕入れ関係
     *****************************************/

    
    // orders
    is_use_stocked:boolean = false ; 

    /**
     * 要オーダー
     */
    is_order_needed:boolean = false ; 

    /**
     * Is仕入れ、外注
     */
    is_outsource:boolean = false ;     
    get IsOutsource():boolean { return this.is_outsource; } 
    set IsOutsource(v:boolean) { 
        this.is_outsource = v ; 
    
        if ( v ){ 
            this.is_order_needed = true ; 
        }
    } 

    

    /**
     * 仕入れ商品名
     */
    outsource_product_name:string = "" ; 

    /**
     * 仕入れ商品数量
     */
    outsource_qty:number = 0 ; 
    get OutsourceQty ():number { return this.outsource_qty; } 
    set OutsourceQty (v:number ){ this.outsource_qty = v ; }

    /**
     * 仕入れ単価手入力フラグ
     */
    is_outsource_cost_input:boolean = false ; 

     /**
     * 仕入れ手入力単価
     */
    outsource_cost_by_input:number = 0 ; 
    get OutsourceCostByInput ():number { return this.outsource_cost_by_input; } 
    set OutsourceCostByInput (v:number ){ this.outsource_cost_by_input = v ; }

    


    /**
     * 仕入先ID
     */
    supplier_m_customer_id?:number = undefined ; 
    get SupplierMCustomerId ():number|undefined { return this.supplier_m_customer_id; } 
    set SupplierMCustomerId (v:number|undefined ){ this.supplier_m_customer_id = v ; }

    /**
     * 仕入先
     */
    _supplier_m_customer?:MCustomer  = undefined ; 
    get SupplierMCustomer():MCustomer|undefined  { return this._supplier_m_customer ; }
    set SupplierMCustomer(val:MCustomer|undefined) { 
        this._supplier_m_customer = val; 
    }

    /**
     * 仕入先名
     */
    get SupplierName():string{
        return this.SupplierMCustomer?.short_name_or_name ?? "" ; 
    }

    /**
     * 仕入先名 正式名称
     */
    get SupplierLongName():string{
        return this.SupplierMCustomer?.name ?? "" ; 
    }

    
    /**
     * オーダー済み
     */
    is_ordered:boolean = false ;
    get IsOrdered ():boolean { return this.is_ordered; } 
    set IsOrdered (v:boolean ){ this.is_ordered = v ; }
    
    public tmp_target_production_no?:string  ; 


    /**
     * 既に発注済み ( レコードを見る)
     */
     get IsAlreadyOrdered ():boolean{
        if (! TProjectProductProcess.is(this)) return false;  
        return this.t_p_order_details?.length > 0 ;
    } 
    
    /**
     * 先行発注済 ( レコードを見る)
     */
    get IsPrecedingOrdered ():boolean{
        if (! TProjectProductProcess.is(this)) return false;
        if(!this.t_p_order_details?.length ) return false ; 
        //@ts-ignore
        const found = this.t_p_order_details.find(e => e.t_project_product_process_order_detail.is_preceding)
        return found !== undefined ;
    }   

    
    
    /**
     * 支給
     */
     is_customer_provide:boolean = false ;
     get IsCustomerProvide ():boolean { return this.is_customer_provide; } 
     set IsCustomerProvide (v:boolean ){ this.is_customer_provide = v ; }
 
    

    private constructor (
        row:Partial<TProjectProductProcess> ,
        t_project_product:TProjectProduct|undefined  , 
         ) { 

        super(row?.created_m_user_id ?? 0) ; 
        // this._store = store ; 
        this._t_project_product  = t_project_product ;         
            
        //@ts-ignore
        delete row._t_project_product ; 
        Object.assign(this ,row );
    
    }

    get IsTProjectProductProcess():boolean{
        return true ; 
    }

    get TProjectProduct():TProjectProduct|undefined{
        return this._t_project_product ; 
    }

    get Store():object|undefined{
        return this._store ; 
    }
    
    get IsStoreSet():boolean{
        return ! _.isNil(this._store ) ; 
    }

    
    toJSON () {
        // 再計算＆カラムにセット
        this.ProcessMater   ; // メーター数
        

        // コスト再計算
        // console.log("TOJson") 
        // if ( TProjectProductProcessPredicted.is(this)){
        //     console.log("TotalWorkCost")
        //     this.TotalWorkCost ; 
        //     // this.TotalMaterialCost ;
        // }


        // console.log(this._mixins ) 

        let superJson = super.toJSON() ; 
        return superJson ; 
    }

    /**
     * 工程カテゴリ
     */
    get MProcessCatgory():MProcessCategory|undefined { 
        // @ts-ignore
        let data  ; 
        if (! _.isNil(this._store) ){
            // @ts-ignore
            data = this._store.masters.getMProcessCategoryById(this.m_process_category_id) ;  
        }

        if ( _.isNil(data )){
            if ( ! _.isNil(this.m_process_category) ) return this.m_process_category ; 
        }

        return data ; 
    }

    /**
     * 工程カテゴリ名
     */
    get MProcessCategoryName():string { 
        return this.MProcessCatgory?.name ?? ""
    }



    /**
     * tmp_target_production_noに
     * 　指定したmProductionIdを元に使用する生産先Noを設定
     * @param mProductionId 
     */
    public updateTargetProductionNo (mProductionId:number|Array<number>) {
        // console.log("ids") ; 
        // console.log(mProductionId) ; 

        if (! _.isNil(this.tmp_target_production_no)) return ; 

        const ids = Array.isArray(mProductionId) ? mProductionId : [mProductionId] ; 
        // if(this.m_production_id_01) {
        //     const found = ids.find(x => x == this.m_production_id_01)
        //     if(found) this.tmp_target_production_no = "01"
        // }
        // else if(this.m_production_id_02) {
        //     const found = ids.find(x => x == this.m_production_id_02)
        //     if(found) this.tmp_target_production_no = "02"
        // }
        // else if(this.m_production_id_03) {
        //     const found = ids.find(x => x == this.m_production_id_03)
        //     if(found) this.tmp_target_production_no = "03"
        // }
        // else if(this.m_production_id_04) {
        //     const found = ids.find(x => x == this.m_production_id_04)
        //     if(found) this.tmp_target_production_no = "04"
        // }
        // else {
        //     this.tmp_target_production_no = undefined ; 
        // }
        


        for ( const id of ids ) { 
            // @ts-ignore
            if ( this["m_production_id_01"] === id ) { 
                this.tmp_target_production_no = "01" ; 
                return ; 
            }
            // @ts-ignore
            else if ( this["m_production_id_02"] === id ) { 
                this.tmp_target_production_no = "02" ; 
                return ; 
            }
            // @ts-ignore
            else if ( this["m_production_id_03"] === id ) { 
                this.tmp_target_production_no = "03" ; 
                return ; 
            }
            // @ts-ignore
            else if ( this["m_production_id_04"] === id ) { 
                this.tmp_target_production_no = "04" ; 
                return ; 
            }
            else { 
                this.tmp_target_production_no = undefined ; 
            }
        }

        
    } 

    /**
     * Plansの削除
     */
    public deletePlans(){ 
        this.t_production_process_plans.splice(0) ; 
    }

    /**
     * 実績の取得
     * @param plan 
     * @returns 
     */
    public getResults(plan:TProductionProcessPlan):Array<TProductionResult>{
        
        if ( _.isNil(plan?.t_production_day_group_id)) return [] ; 

        // Group側での実績        
        if ( plan.results !== undefined && plan.results.length > 0 ) return plan.results ; 

        // Process側での実績            
        const dGroupId = plan.t_production_day_group_id ; 
        // console.log("group id = " + dGroupId) ; 
        if ( _.isNil( this.t_production_results)) return [] ; 
        
        const notDeleted = this.t_production_results.filter(x => _.isNil(x.deleted_at) ) ; 
        // console.log(notDeleted) ; 
        const filterd = notDeleted.filter(x => x.t_production_day_group_id == dGroupId) ; 
        // console.log(filterd) ; 
        return filterd ; 
    }

    /**
     * コスト系の更新
     */
    public updateCostAndTime(){
        if ( _.isNil(this._store) ){
            console.error("Storeがセットされていません") ; 
            return ; 

        } 

        // @ts-ignore
        let mProcessCategory = this._store.masters.getMProcessCategoryById(this.m_process_category_id )  ; ;                 
        if ( mProcessCategory === undefined ) return ; 

        this.m_process_category = mProcessCategory ; 

        if ( TProjectProductProcessPredicted.is(this)){
            // console.log("TotalWorkCost")
            this.TotalMaterialCost ;
            this.TotalOutsourceCost ;
            this.TotalWorkCost ;               
            this.TotalCost ;

            this.PredictedCostPerJob ; 
            this.PredictedCostPerQty ; 

            this.TotalWorkHour ; 

            // console.log(this) ; 
        }


    }

    

    /**
     * display_xx 系の更新
     */
    public updateProductionDisplays(){
        if ( _.isNil(this._store) ){
            console.error("Storeがセットされていません") ; 
            return ; 

        } 

        
        
        // @ts-ignore
        let mProcessCategory = this._store.masters.getMProcessCategoryById(this.m_process_category_id )  ; ; 
        // let mProcessCategory = this.m_process_category ; 
        
        // console.log(mProcessCategory) ; 
        if ( mProcessCategory === undefined ) return ; 

        // @ts-ignore
        const labels = mProcessCategory.m_process_labels ; 

        // @ts-ignore
        let targetColumns = labels.map( x => x.target_column) ; 
        // @ts-ignore
        targetColumns = targetColumns.filter((x, index, self) => self.indexOf(x) === index);
        
        for ( const targetCol of targetColumns) {
            // @ts-ignore
            this[targetCol] = "" ; 
        } ;

    
        // 内容の設定            
        let targetObj:Object = {} ; 
        
        for ( const label of labels ){
            // console.log(label) ;     
            // 有効判定
            let isValid = true ; 
            const isCompuptedName = ObjectUtil.nu2ec(label.is_computed_name)  ; 
            // console.log("isCompuptedName = " + isCompuptedName) ;
            if (! ObjectUtil.isNUE( isCompuptedName) ){
                const splitedIsParams = isCompuptedName.split(";") ; 

                for ( const isParam of splitedIsParams){
                    const splited = isParam.split("|") ; 
                    const isColName = splited[0] ; 
                    
                    // const isValidValue = true ;                                  
                    const isValidValue = TProjectProductProcessUtil.getStringFromLabelFomula(this , isParam ) ; 
                    let blIsValidValue = Boolean(isValidValue) ; 
                    
                    // console.log(isCompuptedName + ":- " + isValidValue) ; 
                    
                    if ( label.is_not ) blIsValidValue = !blIsValidValue ; 
                    if ( ! blIsValidValue) isValid = false ; 
                }


            }

            // console.log(`isColName : ${isCompuptedName}   isValid : ${isValid} `) ; 
            if ( isValid ){
                const targetCol = label.target_column ; 
                //console.log(`isColName : ${isColName}   isValid : ${isValid} `) ; 
                if (! ObjectUtil.isNUE(targetCol) ){

                    // @ts-ignore
                    if (! targetObj.hasOwnProperty(targetCol)) targetObj[targetCol] = "" ;                        

                    // @ts-ignore
                    //if (! this.dValue[targetCol] ) this.dValue[targetCol] = "" ; 
                    // const formulaStr ="" ; 
                    const formulaStr = TProjectProductProcessUtil.getStringFromLabelFomula(this , label.formula,this._store )
                    // console.log("formulaStr:" + formulaStr + " labelFomula:" +  label.formula) ; 
                    
                    // @ts-ignore                        
                    targetObj[targetCol] += ObjectUtil.nu2(label.prefix , "" ) 
                        + ObjectUtil.nu2(formulaStr , "" ) 
                        + ObjectUtil.nu2(label.postfix , "" ) + " " ; 

                }
            }
        }

        // Obj側にセット
        let val = "" ; 
        // @ts-ignore
        for (const [colName, contents] of Object.entries(targetObj)) {
            // console.log(`${colName} @ ${contents}` ) ;
            
            // @ts-ignore
            if ( this[colName] === undefined) this[colName] = null ; 

            // 最後の空白削除
            let trimmedContents = contents ;                 
            if ( trimmedContents.length > 0 ) trimmedContents = trimmedContents.slice(0 , -1) ; 
            // console.log("trimmedContents : " + trimmedContents) ; 
            
            // @ts-ignore
            this[colName] = trimmedContents ; 
            val += `${colName} : ${trimmedContents}` ; 
        }

        return val ; 

    }
    
    public static getEmptyClass():TProjectProductProcess{
        return new TProjectProductProcess({} , undefined  ) ; 
    }
    
    public static parse(
        obj:Partial<TProjectProductProcess> ,
        t_project_product:TProjectProduct|Partial<TProjectProduct>|undefined,
        ){

        const mixins = [] ; 
        mixins.push(TProjectProductProcessProductions) ;        
        mixins.push(TProjectProductProcessPredicted) ;
        

        let mProcessCat = undefined ; 
        if ( ! _.isNil(obj.m_process_category) ){
            mProcessCat = obj.m_process_category ; 
            if (! _.isNil(obj.Store) ){
                //@ts-ignore
                mProcessCat = obj.Store.masters.getMProcessCategoryById(obj.m_process_category_id) ;  
            }
        } 
        if ( mProcessCat !== undefined){
            switch ( mProcessCat.cd ) {
                case "Material"  : 
                    mixins.push(TProjectProductProcessMaterial) ; 
                    break ; 

                case "Board-material" : 
                    // console.log("Board-material") ; 
                    mixins.push(TProjectProductProcessUseBoardLayout) ;
                    mixins.push(TProjectProductProcessBoardMaterial) ; 
                    break ;                 

                case "Print" : 
                    mixins.push(TProjectProductProcessPrint) ; 
                    break ; 
                
                case "Surface-coating" : 
                    mixins.push(TProjectProductProcessSurfaceCoating) ; 
                    break ; 

                case "Uvcoat" : 
                    mixins.push(TProjectProductProcessUvcoat) ; 
                    break ; 

                case "Lami" : 
                    mixins.push(TProjectProductProcessLami) ; 
                    break ; 

                case "Sheetcut" : 
                    mixins.push(TProjectProductProcessSheetCut) ; 
                    break ; 

                case "Plot-halfcut" :
                    mixins.push(TProjectProductProcessPlotHalfcut) ;                     
                    break ; 

                case "Primar" :
                    mixins.push(TProjectProductProcessPrimar) ;                     
                    break ;
                    
                case "Pate" :
                    mixins.push(TProjectProductProcessPate) ;                     
                    break ;            
                    
                case "Unite-materials" :
                    mixins.push(TProjectProductProcessUseBoardLayout) ;
                    mixins.push(TProjectProductProcessUniteMaterials) ;
                    break ;                                

                case "Unite-roleMaterials" :
                    mixins.push(TProjectProductProcessUniteRoleMaterials) ;
                    break ;                                

                case "Multicut" :
                    mixins.push(TProjectProductProcessMulticut) ;
                    break ;                         

                case "Backside-tape" : 
                    mixins.push(TProjectProductProcessBacksideTape) ;
                    break ; 
                
                case "Post-pvc" : 
                    mixins.push(TProjectProductProcessPostPvc) ;
                    break ; 

                case "JointCartain" : 
                    mixins.push(TProjectProductProcessJointCartain) ;
                    break ; 
                    
                case "Reboard-work" : 
                    mixins.push(TProjectProductProcessReboardWork) ;
                    break ; 
                
                case "Post-cartain" : 
                    mixins.push(TProjectProductProcessPostCartain) ;
                    break ;                 
                    
                case "Packing" :
                    mixins.push(TProjectProductProcessPacking) ;
                    break ; 

                case "Purchase-product" :
                    mixins.push(TProjectProductProcessPurchaseProduct) ; 
                    break ; 

                case "Data-creation" :
                    mixins.push(TProjectProductProcessDataCreation) ;
                    break ;                         
                
                case "Construction" :
                    mixins.push(TProjectProductProcessConstruction) ;
                    break ;                         
                
                case "Expendable" :
                    mixins.push(TProjectProductProcessExpendable) ;
                    break ; 

                case "Discount"  : 
                    mixins.push(TProjectProductProcessDiscount) ; 
                    break ; 
    
                    


            }
        }

        
        let tProjectProduct = t_project_product ;
        

        // @ts-ignore
        let row = new TProjectProductProcess(obj ,tProjectProduct) ; 
        row = applyTsMixins(row, mixins ) ;  
        // @ts-ignore
        

        // Init 
        for ( const c of mixins){

            // console.log(c.name + "-------------------------") ; 
            
            // 未定義のプロパティを設定 ( Reactiveの為 )
            let cls = new c() ; 
            const props = ObjectUtil.getPropertiesWoFunction(cls) ;             
            for ( const prop of props) { 
                // @ts-ignore
                const tp = typeof row[prop] ;                 
                // console.log(`  ${prop} : ${tp}`) ;
                // @ts-ignore
                if (row[prop]  === undefined ) row[prop] = cls[prop] ; 
            }
            
            if ( c.Init !== undefined){
                // @ts-ignore
                c.Init(row) ; 
                // console.log("is_01" + row.is_01) ; 
            }
            
        }

        // Object.assign(row , obj);

        // Material
        if (! _.isNil( row.m_material01) && ! MMaterial.is(row.m_material01)) { 
            // parse ; 
            row.m_material01 = row.m_material01 ; 
        }


        // Plans 
        if ( row.t_production_process_plan !== undefined  ){
            const parsedPlan = TProductionProcessPlan.parse(row.t_production_process_plan) ;
            row.t_production_process_plan = parsedPlan ;    
    
        }


        if ( row.t_production_process_plans !== undefined){
            const parsedPlanList = row.t_production_process_plans.map(x => {
                return TProductionProcessPlan.parse(x) ; 
            })  ; 
    
            row.t_production_process_plans.splice(
                0 , 
                row.t_production_process_plans.length , 
                ... parsedPlanList) ; 
            
        }
        
        return row ; 
    }


    public static is(arg:any):arg is TProjectProductProcess { 
        if ( arg?.IsTProjectProductProcess === undefined) return false ; 
        return arg.IsTProjectProductProcess ; 
    }

    /**
     * 先行発注紐づけ解除
     * @param tProcess 工程行
     * @param poDsId 発注明細id
     */
    public unlinkPrecedingOrder(tProcess:Partial<TProjectProductProcess>,poDsId:number) {

        if(! confirm("この発注との紐づけを解除しますか？\n※発注データは削除されません")) return ;
        
        if(!tProcess.t_p_order_details?.length) return ;
        //@ts-ignore
        const found :object= tProcess.t_p_order_details.find(e => e.id === poDsId) ;
        const foundIdx = tProcess.t_p_order_details.indexOf(found) ;

        if(foundIdx !== -1) tProcess.t_p_order_details.splice(foundIdx,1) ;




    }


}
