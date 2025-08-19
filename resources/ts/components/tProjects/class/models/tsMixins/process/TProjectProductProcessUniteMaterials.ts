import _, { isNil } from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import ArrayUtil from "../../../../../../frameworks/ArrayUtil";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { MMaterial } from "../../../../../masters/class/models/MMaterial";
import { MMaterialDetail } from "../../../../../masters/class/models/MMaterialDetail";
import { BoardAutoLayoutPriorityModes } from "../../../../../../frameworks/BoardLayout/autoLayout/models/TypeBoardAutoLayout";
import { BoardLayoutTypes } from "../../../boardLayouts/BoardLayout";
import { BoardLayoutContainerManager } from "../../../boardLayouts/BoardLayoutContainerManager";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { TProjectProductProcessProductions } from "../TProjectProductProcessProductions";
import { TProjectProductProcessUseBoardLayout } from "../TProjectProductProcessUseBoardLayout";


export class TProjectProductProcessUniteMaterials {
    

    // 型判別用
    get IsTProjectProductProcessUniteMaterials():boolean{
        return true ; 
    }

    

    // /**
    //  * コンテナマネージャ
    //  */
    // _manager?:BoardLayoutContainerManager = undefined ;
    // get Manager():BoardLayoutContainerManager|undefined{
    //     if ( TProjectProductProcess.is(this) && ! _.isNil(this.Store)){
    //         if ( _.isNil(this._manager)) {
    //             this._manager = new BoardLayoutContainerManager(this.Store) ; 

    //             this._manager.BoardLayouts = this.TProjectProduct?.BoardLayouts ?? []; 
    //             this._manager.TProjectProductProcess = this ; 

    //         }

    //         if (! _.isNil(this._manager ) ){

    //             this._manager.MBranchId = this.m_branch_id ; 
    //             if (JSON.stringify(this._manager.MMaterial) !==  JSON.stringify(this.m_material01) ){
    //                 // console.log("m_material01 is " + MMaterial.is(this.m_material01) ) ; 
    //                 // console.log(JSON.stringify(this.m_material01))  ; 
    //                 this._manager.MMaterial = this.m_material01  ; 
    //             }
                
    //             this._manager.SelectedBoardLayoutType = this.MMaterialBoardLayoutType ; 
    //             this._manager.IsCustomerProvide = this.IsCustomerProvide ; 
    //             // this._manager.MMaterialDetails ; 
    //             // console.log(this.TProjectProduct?.BoardLayouts) ; 
                
                
    //         }
    //         // console.log("get manager") ; 

    //         return this._manager ; 

    //     }
    //     return undefined ; 
    // }
    // get ManagerManual () {
    //     return this.Manager?.ManualContainer ; 
    // }    
    // get ManagerRefManual () {
    //     return this.Manager?.RefMasterManualContainer ; 
    // }
    // get ManagerRefAuto () {
    //     return this.Manager?.RefMasterAutoContainer ; 
    // }
    // get ManagerLayouts() { 
    //     if ( TProjectProductProcess.is(this)){
    //         return this.TProjectProduct?.BoardLayouts ?? [] ; 
    //     }
    //     return [] ; 
    // }
    
    // /**
    //  * レイアウトの更新
    //  */
    // public UpdateLayouts(){
    //     if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
    //         if ( this.is_enabled ){
    //             if (! _.isNil( this._manager)){
    //                 ArrayUtil.resetInsert(this.TProjectProduct.BoardLayouts ,this._manager.SelectedContainerOutputLayouts )
    //             }
    //         }
    //         else { 
    //             this.TProjectProduct.BoardLayouts.splice(0) ; 
    //         }
            
    //     }
    // }



 
    
    /**
     * 貼り対象 MKvId
     */
    m_kv_id_01:number = 0 ; 
    get TargetMKvId():number { return this.m_kv_id_01 ; }
    set TargetMKvId(v:number) { this.m_kv_id_01 = v ; }

    /**
     * 貼り対象が 商品
     */
    get IsTargetProduct():boolean { 
        return this.TargetMKvId == MKvsConst.TProjects.Process.UniteMaterial.TARGET_PRODUCT  ; 
    }

    /**
     * 貼り対象が 板材
     */
    get IsTargetBoard():boolean { 
        return this.TargetMKvId == MKvsConst.TProjects.Process.UniteMaterial.TARGET_BOARD  ; 
    }

    /**
     * 貼り対象商品ID
     */
    target_t_project_product_id:number|null = null ;
    get TargetTProductId():number|null { return this.target_t_project_product_id ; }
    set TargetTProductId(v:number|null) { this.target_t_project_product_id = v ; }

    /**
     * 貼り対象の商品のリスト
     */
    target_products:TProjectProduct[] = [] ; 
    
    get ValidProducts():TProjectProduct[] { 
        if (TProjectProductProcess.is(this)) {
            
        }
        return [] ; 
    }

    /**
     * 貼り対象名
     */
    get TargetName():string{

        let name = "" ; 
        if ( this.IsTargetProduct) {
            const foundProduct = this.target_products.find(x => x.id === this.TargetTProductId)  ; 
            if ( foundProduct !== undefined) {
                name = foundProduct.name ; 
            }
        }
        else if ( this.IsTargetBoard) { 
            if ( TProjectProductProcessUseBoardLayout.is(this)) {
                if ( this.IsNotRefMaster ) {
                    name = this.CustomMaterialName ; 
                }
                else {
                    if (TProjectProductProcess.is(this)) {
                        name = this.MaterialName01 ; 
                    }
                    else { 
                        name = "" ;
                    }
                }
            }
        }

        return name ; 
    }


    /**
     * 貼り対象名 ( 正式名称 )
     */
    get TargetLongName():string{
        let name = "" ; 
        if ( this.IsTargetProduct) {
            const foundProduct = this.target_products.find(x => x.id === this.TargetTProductId)  ; 
            if ( foundProduct !== undefined) {
                name = foundProduct.name ; 
            }

        }
        else if ( this.IsTargetBoard) { 
            if ( TProjectProductProcessUseBoardLayout.is(this)) {
                if ( this.IsNotRefMaster ) {
                    name = this.CustomMaterialName ; 
                }
                else {
                    if (TProjectProductProcess.is(this)) {
                        name = this.MaterialLongName01 ; 
                    }
                    else { 
                        name = "" ;
                    }                
                }
            }
        }

        return name ; 
    }
    /**
     * 貼り材料板割マニュアル結果枚単価
     */
    n_21:number = 0 ; 
    get MMaterialBoardManualCostPerQty ():number { return this.n_21; }
    set MMaterialBoardManualCostPerQty (v:number ){ this.n_21 = v ; }    
 
    /**
     * 貼り材料板割セミ自動結果枚単価
     */
    n_22:number = 0 ; 
    get MMaterialBoardRefMasterManualCostPerQty ():number { return this.n_22; }
    set MMaterialBoardRefMasterManualCostPerQty (v:number ){ this.n_22 = v ; }    
  

    /**
     * 貼り材料板割自動結果枚単価
     */
    n_23:number = 0 ; 
    get MMaterialBoardRefMasterAutoCostPerQty ():number { return this.n_23; }
    set MMaterialBoardRefMasterAutoCostPerQty (v:number ){ this.n_23 = v ; }    
   

    /**
     * 板寸法マニュアルモードの選択可否
     */
     get IsAbleToSelectManualInput():boolean{
        return this.IsTargetBoard ; 
    }

    /**
     * 板寸法セミマニュアルモードの選択可否
     * 規格判は選択する
     */
    get IsAbleToSelectSemiManualInput():boolean{
        if (! TProjectProductProcessUseBoardLayout.is(this)) return false ; 
        if (! this.IsTargetBoard || this.IsNotRefMaster) return false ; 
            
        return this.Bridge_MMaterialDetails01.length > 0 ; 
    }




 
    /**
     * 貼り対象 手入力材料名
     */
    s_01:string ="" ; 
    get CustomMaterialName():string { return this.s_01;}            
    set CustomMaterialName (v:string ){ this.s_01 = v ; }

    /**
     * 支給
     */
     get Bridge_IsCustomerProvide():boolean { 
        if (TProjectProductProcess.is(this)) {
            return this.IsCustomerProvide ; 
        }
        return false ; 
    }

    /**
     * 要発注
     */
    get IsOrderNeeded():boolean{
        if (! TProjectProductProcess.is(this))  return false ;      
        
        const isNeeded = ! this.IsCustomerProvide && ! this.IsTargetProduct ;  
        this.is_order_needed = isNeeded ; 
        return this.is_order_needed  ; 
    }    

    /**
     * 貼り材料計上フラグ
     */
    get IsMaterialCost():boolean {
        let val = ! this.Bridge_IsCustomerProvide && this.IsTargetBoard ; 
        return val ; 
    }

    
    /**
     * 貼り秒数/枚
     */
    n_06:number = 0 ;
    get SecPerQty ():number { return this.n_06; }
    set SecPerQty (v:number ){ this.n_06 = v ; }
         
    /**
     * 参考貼り秒数/枚
     */
    get RefSecPerQty():number { 
        let val = 0 ; 
        if ( TProjectProductProcess.is(this) 
            && TProjectProductProcessProductions.is(this) 
            && ! _.isNil(this.TProjectProduct)) {
            
            const speedPerHour = this.MProductionMode01?.speed_per_hour ?? 0 ; 
            val = NumberUtil.round(NumberUtil.invalid2zr( this.TProjectProduct.Sqm / speedPerHour * 3600 ))  
            
        }
        //初期値をセットする
        if(this.n_06 == 0 ) this.n_06 = val ;
        
        return val ; 
    }

    /**
     * Is組み立て作業有り
     */
    is_02:boolean = false ; 
    get IsAssembly ():boolean { return this.is_02; }
    set IsAssembly (v:boolean){ this.is_02 = v ; }


    
    /**
     * m_material01変更時
     * Override用
     */
     protected onMaterial01Changed(){ 
        if (! TProjectProductProcess.is(this) || ! TProjectProductProcessUseBoardLayout.is(this))  return ; 

        if(this.IsNotRefMaster && ! this.IsCustomerProvide) return ; 
    
        if(! this.m_material01){
            this.supplier_m_customer_id = 0 
            this.SupplierMCustomer = undefined ;
        } 
        else {
            this.supplier_m_customer_id = this.m_material01.supplier_m_customer_id ; 
            this.SupplierMCustomer = this.m_material01.supplier ;    
        }
        if ( TProjectProductProcessUseBoardLayout.is(this)){
            if (! _.isNil(this.Manager)){
                // this.Manager.MMaterial = this.m_material01 ?? null; 
            }
        }
        

        // console.log("onMaterial01Changed - onUnite") ; 
    }
    


    public static Init(p:TProjectProductProcessUniteMaterials){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }        
        }
    }
    
    public static is(arg:any):arg is TProjectProductProcessUniteMaterials { 
        if ( arg?.IsTProjectProductProcessUniteMaterials === undefined) return false ; 
        return arg.IsTProjectProductProcessUniteMaterials ; 
    } 
    

}


