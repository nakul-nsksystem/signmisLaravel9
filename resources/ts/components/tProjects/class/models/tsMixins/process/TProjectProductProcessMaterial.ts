import _ from "lodash";
import MastersUtil from "../../../../../../frameworks/MastersUtil";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { MCustomer } from "../../../../../masters/class/models/MCustomer";
import { TypeMaterialSheets4Simulation } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import MKvsConst from "../../../../../../consts/MKvsConst";


export class TProjectProductProcessMaterial {
    // 型判別用
    get IsMaterial():boolean{
        return true ; 
    }

    /**
     * TProductへのメインマテリアル変更通知
     */
    protected _notifyUpdateMainMaterialRollSheets(){
        // console.log("set IsNotRefMaster ") ; 
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){            
            this.TProjectProduct.UpdateMainMaterialRollSheets();
        }
    }


    /**
     * 入力
     */
    is_01:boolean = false  ; 
    get IsNotRefMaster():boolean { 
        return this.is_01;
    }            
    set IsNotRefMaster (v:boolean ){
        // console.log("set IsNotRefMaster ") ; 
        this.is_01 = v ;
        if ( TProjectProductProcess.is(this)){

            if (v){
                // this.SupplierMCustomer = undefined ; 
                // this.SupplierMCustomerId = 0 ; 
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
     * 手入力メディア幅
     */
    n_01:number = 0 ; 
    get CustomSheetWidth():number { return this.n_01 ; }
    set CustomSheetWidth(v:number) { 
        this.n_01 = v ; 
        this._notifyUpdateMainMaterialRollSheets();       
    
    }

    /**
     * メディア 幅マージン
     * @param p 
     */
    n_02:number = 100 ; 
    get SheetWidthMargin():number { return this.n_02 ; }
    set SheetWidthMargin(v:number) { 
        this.n_02 = v ; 
        this._notifyUpdateMainMaterialRollSheets();
    }

    /**
     * 手入力巻m数
     */
    n_03:number = 0 ; 
    get CustomSheetHeight():number { return this.n_03 ; }
    set CustomSheetHeight(v:number) { 
        this.n_03 = v ; 
        this._notifyUpdateMainMaterialRollSheets();
    
    }

    /**
     * 手入力有効 巻m数
     */
    n_04:number = 0 ; 
    get CustomSheetValidHeight():number { return this.n_04 ; }
    set CustomSheetValidHeight(v:number) { 
        this.n_04 = v ; 
        this._notifyUpdateMainMaterialRollSheets();
    }

    /**
     * 手入力メディアロール単価
     */
    n_05:number = 0 ; 
    get CustomSheetPricePerRoll():number { return this.n_05 ; }
    set CustomSheetPricePerRoll(v:number) { this.n_05 = v ; }
  
    /**
     * 手入力メディア単価スポット
     */
    is_02:boolean = false ; 
    get IsCustomSheetPriceAsSpot():boolean { return this.is_02 ; }
    set IsCustomSheetPriceAsSpot(v:boolean) { this.is_02 = v ; }


    /**
     * 重量/sqm
     */
    public get WeightPerSqm():number { 
        if (! TProjectProductProcess.is(this)) return 0 ;         
        return this.m_material01?.weight ?? 0  ; 
    }

    private get Bridge_IsCustomerProvide():boolean { 
        if (! TProjectProductProcess.is(this) ) return false ; 

        return this.IsCustomerProvide  ; 
    }

    /**
     * 計算後㎡単価
     */
    n_10:number = 0 ; 
    get PricePerSqm():number{ 
        let cost = 0 ; 
            
        if ( this.Bridge_IsCustomerProvide ) {                
            // 支給
            cost = 0 ; 
        }
        else if (! this.IsNotRefMaster){
            cost = this.Bridge_MaxWidthRollSheet?.cost ?? 0 ; 
        }
        else {
            

            // 以下手入力時
            // ロール１本の価格
            const costPerRoll = this.CustomSheetPricePerRoll ; 
            
            // スポット使用
            if ( this.IsCustomSheetPriceAsSpot)
            {
                // 本単位

                // 必要ロール数
                //const numOfRollsNeeded = NumberUtil.floor(this.cH / (this.cCustomSheetValidHeight * 1000 ) ) ; 
                const numOfRollsNeeded = NumberUtil.ceil(this.NumOfRollsNeeded) ; 
                //console.log("numOfRollsNeeded:" + numOfRollsNeeded + " this.cNumOfRollsNeeded" + this.cNumOfRollsNeeded) ;  
                //console.log("cH:" + this.cH + "  cCustomSheetValidHeight:" + this.cCustomSheetValidHeight ) ; 
                
                // 必要ロール数分のコスト
                const costOfRollsNeeded = numOfRollsNeeded * costPerRoll ; 
                //console.log("costOfRollsNeeded:" + costOfRollsNeeded) ; 
                //console.log("costOfRollsNeeded:" + costOfRollsNeeded + " cSqm:" + this.cSqm ) ; 
                // ㎡換算
                cost = NumberUtil.invalid2zr(costOfRollsNeeded / this.Sqm) ; 
                //console.log("cost:" + cost) ; 
                
                
            }
            else
            {
                // ㎡                   
                
                // ロール１本の価格から取得した㎡単価
                // const sqm = this.cCustomSheetWidth * this.cSheetValidH * 0.001  * 0.001 ; 
                const sqm = this.CustomSheetWidth * this.SheetValidHeight * 0.001  * 0.001 ; 
                
                
                const costPerSqmByRoll = NumberUtil.ceil((costPerRoll / sqm ) * 0.001) ; 

                cost = costPerSqmByRoll ;                 

            }

        }

        cost = NumberUtil.invalid2zr(NumberUtil.ceil(cost , 3))
        this.n_10 = cost ; 
        return this.n_10 ; 
    }    

    /**
     * トータル使用㎡数
     */
    n_11:number = 0 ; 
    get Sqm():number { 
        let res = 0 ; 

        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            if ( this.TProjectProduct.layout_ok_list.length !== 0 ) {
                res = this.TProjectProduct.layout_ok_list.reduce(function (acc, cur){
                    return acc + cur.result.sheetSqm  ; 
                } , 0 ) ; 
    
            }
        }
        res = NumberUtil.round(res ,4) ;                        
        this.n_11 = res ; 
        return this.n_11 ;     
    }


    /**
     * トータル使用㎡数/枚
     */
    n_12:number = 0 ; 
    get SqmPerQty():number { 
        let sqm = 0 ; 
        
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            if ( this.TProjectProduct.qty > 0 ){
                sqm = NumberUtil.invalid2zr(this.Sqm / this.TProjectProduct.qty ) ; 
            }    
        }
        sqm = NumberUtil.round(sqm ,4) ; 
        this.n_12 = sqm ;                 
        return this.n_12; 
    }

    /**
     * 参考使用本数
     */
    n_13:number = 0 ; 
    get NumOfRollsNeeded():number { 
        let res = 0 ; 
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            if ( this.TProjectProduct.layout_ok_list.length !== 0 ) {
                res = this.TProjectProduct.layout_ok_list.reduce(function (acc, cur){
                    return acc + cur.result.numOfRolls  ; 
                } , 0 ) ; 
            }
        }
        
        res = NumberUtil.invalid2zr(res) ; 
        this.n_13 = res  ;  
        return this.n_13; 
    }



    /**
     * TProjectProduct.MaxWidthRollSheet 最大幅ロールシートサイズ
     */
    public get Bridge_MaxWidthRollSheet():TypeMaterialSheets4Simulation|undefined{
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            return this.TProjectProduct?.MaxWidthRollSheet ;             
        }else {
            console.error("_t_project_product is not set on ProcessMaterial.") ; 
            return undefined ; 
        }    
    }


    /**
     * 最大有効シートサイズ
     */
    public get SheetValidWidth():number {        
        let w:number = 0 ; 
        if ( this.IsNotRefMaster){
            w = this.CustomSheetWidth ; 
        }
        else { 
            w  = this.Bridge_MaxWidthRollSheet?.w ?? 0 ;             
        }

        w -= this.SheetWidthMargin ;           
        return w < 0 ? 0 : w ; 
    }

    
    /**
     * 最大有効シート高さ
     */
    public get SheetValidHeight():number {        
        let v:number = 0 ; 
        if ( this.IsNotRefMaster){
            v = this.CustomSheetValidHeight ; 
        }
        else { 
            v  = this.Bridge_MaxWidthRollSheet?.hIncLoss ?? 0 ; 
        }        
        return v < 0 ? 0 : v ; 
    }

    /**
     * 最大の大きさのシート
     */
    public get MaxSheet(){
        const emptySheet = {
            w:0 ,h:0 ,hIncLoss:0 , cost :0 
        } ; 
        if (! TProjectProductProcess.is(this)) return emptySheet ;         
        if ( this.TProjectProduct?.MaxWidthRollSheet === undefined ) return emptySheet ; 

        return this.TProjectProduct.MaxWidthRollSheet ;         
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
     * 仕入先名
     */
    get SupplierName():string{
        return this.Supplier?.short_name_or_name ?? "" ; 
    }

    /**
     * 仕入先名 正式名称
     */
    get SupplierLongName():string{
        return this.Supplier?.name ?? "" ; 
    }

    /**
     * 手入力時 発注サイズ
     */
    get OrderSize():string {
        if (! TProjectProductProcess.is(this))  return "" ; 
        
        if(this.IsNotRefMaster && ! this.IsCustomerProvide) {            
            const w = this.CustomSheetWidth ;
            const h = this.CustomSheetHeight * 1000 ;
            return `[ ${w.toLocaleString()} x ${h.toLocaleString()} mm ]` ; 
            
        }
        return "" ; 
    } 


    /**
     * 手入力時 発注単価
     */
    get OrderPrice():number {
        if (! TProjectProductProcess.is(this))  return 0 ; 
        if(this.IsNotRefMaster && ! this.IsCustomerProvide) {
            return this.CustomSheetPricePerRoll ; 
        }
        return 0 ; 
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


    /**
     * MCS判定
     */
    get IsMcs():boolean{
        let is = false ;
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            is = this.TProjectProduct.warranty_m_kv_id == MKvsConst.TProjects.Product.Warranty.MCS ;
        }
        return is ;
    }

    get IsNotMcsEmp():boolean {
        return !_.isEmpty(this.s_02) ;
    }

    /**
     * mcs材料lotNo
     */
    s_02:string ="" ; 
    get McsLotNo():string { return this.s_02;}            
    set McsLotNo (v:string ){ this.s_02 = v ; }

    

 

    public static Init(p:TProjectProductProcessMaterial){
        // if ( _.isNil(p.PricePerSqm)) p.PricePerSqm = 0 ; 

    }

    public static is(arg:any):arg is TProjectProductProcessMaterial { 
        if ( arg?.IsMaterial === undefined) return false ; 
        return arg.IsMaterial ; 
    } 



}

