import _ from "lodash";
import MastersUtil from "../../../../../../frameworks/MastersUtil";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { MCustomer } from "../../../../../masters/class/models/MCustomer";
import { BoardAutoLayoutPriorityModes } from "../../../../../../frameworks/BoardLayout/autoLayout/models/TypeBoardAutoLayout";
import { BoardLayoutTypes } from "../../../boardLayouts/BoardLayout";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { BoardLayoutContainerManager } from "../../../boardLayouts/BoardLayoutContainerManager";
import { TProjectProductProcessUseBoardLayout } from "../TProjectProductProcessUseBoardLayout";



export class TProjectProductProcessBoardMaterial {
    // 型判別用
    get IsBoardMaterial():boolean{
        return true ; 
    }


    
    /**
     * 入力
     */
    is_01:boolean = false ; 
    get IsNotRefMaster():boolean { 
        return this.is_01;
    }            
    set IsNotRefMaster (v:boolean ){
        // console.log("set IsNotRefMaster ") ; 
        this.is_01 = v ;
        if ( TProjectProductProcess.is(this) && TProjectProductProcessUseBoardLayout.is(this)){

            if (v){
                // this.SupplierMCustomer = undefined ; 
                // this.SupplierMCustomerId = 0 ; 

                if ( this.MMaterialBoardLayoutType != BoardLayoutTypes.Manual ) {                     
                    this.MMaterialBoardLayoutType = BoardLayoutTypes.Manual ; 
                }
            }    

            if ( ! _.isNil(this.TProjectProduct)){
                this.TProjectProduct.UpdateMainMaterial() ; 
            }
            
        }
        
    }


    /**
     * タイプ
     */
    m_kv_id_01:number = 0 ; 
    get CategoryMKvId():number { return this.m_kv_id_01 ; }
    set CategoryMKvId(v:number) { this.m_kv_id_01 = v ; }
 
    /**
     * 手入力材料名
     */
    s_01:string ="" ; 
    get CustomMaterialName():string { return this.s_01;}            
    set CustomMaterialName (v:string ){ this.s_01 = v ; }

    /**
     * Is在庫品
     */
    get IsStocked():boolean {
        if (! TProjectProductProcess.is(this)) return false ; 

        if ( this.IsCustomerProvide ) return false ; 

        if ( this.IsNotRefMaster ) return false ; 

        if ( this.m_material01 === undefined ) return false ; 

        return this.m_material01.is_stocked   ; 
    }

    /**
     * 単価基準名
     */
    get MaterialPriceKvName():string { 
        if (! TProjectProductProcess.is(this)) return ""; 

        if ( _.isNil(this.m_material01) ) return "" ;  

        // @ts-ignore 
        const priceCalcMKv = this.Store.masters.getMKvById(this.m_material01.total_price_calc_m_kv_id) ;             
        return priceCalcMKv?.kv_name ; 
                
    }

    /**
     * 重量/sqm
     */
     public get WeightPerSqm():number { 
        if (! TProjectProductProcess.is(this)) return 0 ;         
        return this.m_material01?.weight ?? 0  ; 
    }
 

    // /**
    //  * 貼り対象材料　明細タイプ
    //  *  1:手動レイアウトモード
    //  *  2:マスタ参照手動レイアウトモード
    //  *  3:マスタ参照自動レイアウトモード
    //  * @param p 
    //  */
    // n_02:BoardLayoutTypes = BoardLayoutTypes.Manual ; 
    // get MMaterialBoardLayoutType():BoardLayoutTypes { return this.n_02 ; }
    // set MMaterialBoardLayoutType(v:BoardLayoutTypes) { this.n_02 = v ; }

        
    /**
     * 材料板割マニュアル結果枚単価
     */
    n_21:number = 0 ; 
    get MMaterialBoardManualCostPerQty():number { return this.n_21 ; }
    set MMaterialBoardManualCostPerQty(v:number) { this.n_21 = v ; }

    /**
     * 材料板割セミ自動結果枚単価
     */
    n_22:number = 0 ; 
    get MMaterialBoardRefMasterManualCostPerQty():number { return this.n_22 ; }
    set MMaterialBoardRefMasterManualCostPerQty(v:number) { this.n_22 = v ; }
 
    // /**
    //  * 貼り材料板割自動優先モード
    //  */
    // s_02:BoardAutoLayoutPriorityModes = BoardAutoLayoutPriorityModes.JOINED_QTY ; 
    // get MMaterialBoardLayoutPriorityMode():BoardAutoLayoutPriorityModes { return this.s_02 ; }
    // set MMaterialBoardLayoutPriorityMode(v:BoardAutoLayoutPriorityModes) { this.s_02 = v ; }
    
    /**
     * 貼り材料板割自動結果枚単価
     */
    n_23:number = 0 ; 
    get MMaterialBoardRefMasterAutoCostPerQty():number { return this.n_23 ; }
    set MMaterialBoardRefMasterAutoCostPerQty(v:number) { this.n_23 = v ; }
 
 
    /**
     * 板寸法マニュアルモードの選択可否
     */
     get IsAbleToSelectManualInput():boolean{
        return true  ; 
    }

    /**
     * 板寸法セミマニュアルモードの選択可否
     * 規格判は選択する
     */
    get IsAbleToSelectSemiManualInput():boolean{
        if (! TProjectProductProcessUseBoardLayout.is(this)) return false ; 
        if ( this.IsNotRefMaster) return false ; 
            
        return this.Bridge_MMaterialDetails01.length > 0 ; 
    }


    
    /**
     * 仕入先
     */
     public get Supplier():MCustomer|undefined {         
        if (! TProjectProductProcess.is(this))  return undefined ; 

        if(this.IsNotRefMaster && ! this.IsCustomerProvide) {
            return this.SupplierMCustomer ;
        
        } else {
            if(!this.m_material01){
                this.supplier_m_customer_id = 0 
                return undefined ;
            } 
            this.supplier_m_customer_id = this.m_material01.supplier_m_customer_id
            return this.m_material01.supplier ;
        }
    }
    
    /**
     * 要発注
     */
    get IsOrderNeeded():boolean{
        if (! TProjectProductProcess.is(this))  return false ;         
        const isNeeded = ! this.IsStocked && ! this.IsCustomerProvide ;  
        this.is_order_needed = isNeeded ; 
        return this.is_order_needed  ; 
    }

    public static Init(p:TProjectProductProcessBoardMaterial){
        
    }


    public static is(arg:any):arg is TProjectProductProcessBoardMaterial { 
        if ( arg?.IsBoardMaterial === undefined) return false ; 
        return arg.IsBoardMaterial ; 
    } 



}

