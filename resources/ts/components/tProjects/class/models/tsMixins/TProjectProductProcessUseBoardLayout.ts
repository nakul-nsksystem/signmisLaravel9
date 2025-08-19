import _ from "lodash";
import ArrayUtil from "../../../../../frameworks/ArrayUtil";
import { BoardAutoLayoutPriorityModes } from "../../../../../frameworks/BoardLayout/autoLayout/models/TypeBoardAutoLayout";
import { MMaterialDetail } from "../../../../masters/class/models/MMaterialDetail";
import { BoardLayoutTypes } from "../../boardLayouts/BoardLayout";
import { BoardLayoutContainerManager } from "../../boardLayouts/BoardLayoutContainerManager";
import { TProjectProductProcess } from "../TProjectProductProcess";
import { TProjectProductProcessUniteMaterials } from "./process/TProjectProductProcessUniteMaterials";

export class TProjectProductProcessUseBoardLayout {

    public get IsTProjectProductProcessUseBoardLayout():boolean{
        return true ; 
    }


    
    /**
     * コンテナマネージャ
     */
    _manager?:BoardLayoutContainerManager = undefined ;
    get Manager():BoardLayoutContainerManager|undefined{
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.Store)){
            if ( _.isNil(this._manager)) {
                this._manager = new BoardLayoutContainerManager() ; 

                this._manager.BoardLayouts = this.TProjectProduct?.BoardLayouts ?? []; 
                this._manager.TProjectProductProcess = this ; 

            }

            if (! _.isNil(this._manager ) ){

                this._manager.MBranchId = this.m_branch_id ; 
                if (JSON.stringify(this._manager.MMaterial) !==  JSON.stringify(this.m_material01) ){
                    // console.log("m_material01 is " + MMaterial.is(this.m_material01) ) ; 
                    // console.log(JSON.stringify(this.m_material01))  ; 
                    this._manager.MMaterial = this.m_material01  ; 
                }
                
                this._manager.SelectedBoardLayoutType = this.MMaterialBoardLayoutType ; 
                this._manager.IsCustomerProvide = this.IsCustomerProvide ; 
                // this._manager.MMaterialDetails ; 
                // console.log(this.TProjectProduct?.BoardLayouts) ; 
                
                
            }
            // console.log("get manager") ; 

            return this._manager ; 

        }
        return undefined ; 
    }
    get ManagerManual () {
        return this.Manager?.ManualContainer ; 
    }    
    get ManagerRefManual () {
        return this.Manager?.RefMasterManualContainer ; 
    }
    get ManagerRefAuto () {
        return this.Manager?.RefMasterAutoContainer ; 
    }
    get ManagerLayouts() { 
        if ( TProjectProductProcess.is(this)){
            return this.TProjectProduct?.BoardLayouts ?? [] ; 
        }
        return [] ; 
    }
    
    /**
     * 材料取得
     */
     get Bridge_MMaterialDetails01():MMaterialDetail[] { 
        if (TProjectProductProcess.is(this)) {
            return this.MaterialDetails01 ; 
        }
        return [] ; 
    }


    /**
     * 入力
     */
    is_01:boolean = false  ; 
    get IsNotRefMaster ():boolean {
        return this.is_01;
    }        
    set IsNotRefMaster (v:boolean ){
        this.is_01 = v ;     
        
        if ( ! TProjectProductProcessUseBoardLayout.is(this)) return ; 
        
        if ( v ){
            //console.log(this.cMMaterialBoardLayoutType) ; 
            if ( this.MMaterialBoardLayoutType != BoardLayoutTypes.Manual) { 
                this.MMaterialBoardLayoutType = BoardLayoutTypes.Manual ; 
            }
        }
        if ( TProjectProductProcess.is(this)){
            if ( ! _.isNil(this.TProjectProduct)){
            }
            
        }
    }
 
    /**
     * Base64Svg
     */
    get Base64Svg():string { 
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)) {
            return this.TProjectProduct.BoardLayoutBase64Svg ?? "" ; 
        }
        return "" ; 
    }
    set Base64Svg(v:string) { 
        // console.log("base64" + v) ; 
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)) {     
            if ( ! TProjectProductProcessUseBoardLayout.is(this)) return ;    
            
            if ( this.MMaterialBoardLayoutType !== BoardLayoutTypes.RefMasterAuto){
                this.TProjectProduct.BoardLayoutBase64Svg = "" ; 
            }
            else { 
                if ( TProjectProductProcessUniteMaterials.is(this) && ! this.IsTargetBoard){
                    this.TProjectProduct.BoardLayoutBase64Svg = "" ; 
                }
                else { 
                    this.TProjectProduct.BoardLayoutBase64Svg = v ; 
                }
            }            
        }
    }


    /**
     * 板寸法オートモードの選択可否        
     */
     get IsAbleToSelectAuto():boolean{
        let res = true ; 
        if ( this.IsNotRefMaster) res = false ; 
        
        if (TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct) && 
            TProjectProductProcessUseBoardLayout.is(this)) {            
            if ( _.isNil( this.m_material01 ) && this.MMaterialId01 == 0 ) res = false ;  
            if ( this.Bridge_MMaterialDetails01.length === 0 &&  this.MMaterialId01 != 0 ) res = false ; 
            if ( res ) {
                const boardMaxLen = this.Bridge_MMaterialDetails01.reduce(function (accumulator, currentValue) {                    
                    const curW = currentValue.width ; 
                    const curH = currentValue.height ; 
                    let curMax = Math.max(curW , curH) ; 
                    return accumulator > curMax ? accumulator : curMax ; 
                    //return accumulator > currentValue.cost_price ? accumulator : currentValue ; 
                },0) ; 
                const productMinLen = Math.min( this.TProjectProduct.SizeW , this.TProjectProduct.SizeH ) ; 
                //console.log(`productMinLen : ${productMinLen}  boardMaxLen : ${boardMaxLen}`) ; 
                res = productMinLen <= boardMaxLen ; 
            }
    
            // Autoが選択不可状態で
            if (! res  &&  this.MMaterialBoardLayoutType === BoardLayoutTypes.RefMasterAuto) {
                // if ( this.MMaterialId01 != 0 && 
                //     _.isNil(this.m_material01)) return res ; 
                //console.log("res " + res ) ; 

                // ロード時対策
                if ( _.isNil(this.m_material01?.m_material_details) ) return res ; 
                
                this.MMaterialBoardLayoutType = BoardLayoutTypes.Manual; 
            }
        }
            
        return res ; 
    }     
    
    /**
     * 板割自動優先モード
     */
    s_02:BoardAutoLayoutPriorityModes = BoardAutoLayoutPriorityModes.JOINED_QTY ; 
    get MMaterialBoardLayoutPriorityMode():BoardAutoLayoutPriorityModes { return this.s_02 ; }
    set MMaterialBoardLayoutPriorityMode(v:BoardAutoLayoutPriorityModes) { this.s_02 = v ; }
    

    /**
     * 貼り対象材料　明細タイプ
     *  1:手動レイアウトモード
     *  2:マスタ参照手動レイアウトモード
     *  3:マスタ参照自動レイアウトモード
     * @param p 
     */
    n_02:BoardLayoutTypes = BoardLayoutTypes.Manual ; 
    get MMaterialBoardLayoutType():BoardLayoutTypes { return this.n_02 ; }
    set MMaterialBoardLayoutType(v:BoardLayoutTypes) { 
        this.n_02 = v ; 
        
        if (! _.isNil(this.Manager)){
            // this.Manager.SelectedBoardLayoutType = v ; 
        }
    
    }


    /**
     * 貼り対象材料　自動　Is外注カット
     * @param p 
     */
    is_11:boolean = false;
    get MMaterialBoardLayoutIsAutoOutsourceCut():boolean { return this.is_11 ?? false ; }
    set MMaterialBoardLayoutIsAutoOutsourceCut(v:boolean) { 
        this.is_11 = v ; 
        if (! _.isNil(this.Manager)){
            this.Manager.is_auto_outsource_cut = v ; 
        }
            
    }
 

    
    /**
     * 貼り対象 材料単価/枚
     */
    n_10:number = 0 ;     
    get MaterialPricePerQty():number{ 
        let val = 0 ; 
        val = this.Manager?.SelectedContainer?.TotalCostPerQty ?? 0 ; 
        
        this.n_10 = val ; 
        return this.n_10 ; 
    
    } 

    /**
     * レイアウトの更新
     */
    public UpdateLayouts(){
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            if ( this.is_enabled ){
                if (! _.isNil( this._manager)){
                    ArrayUtil.resetInsert(this.TProjectProduct.BoardLayouts ,this._manager.SelectedContainerOutputLayouts )
                }
            }
            else { 
                this.TProjectProduct.BoardLayouts.splice(0) ; 
            }
            
        }
    }





    public static Init(p:TProjectProductProcessUseBoardLayout){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }        
        }
    }
    


    public static is(arg:any):arg is TProjectProductProcessUseBoardLayout { 
        if ( arg?.IsTProjectProductProcessUseBoardLayout === undefined) return false ; 
        return arg.IsTProjectProductProcessUseBoardLayout ; 
    } 
    
}


