import _ from "lodash";
import MKvCategoriesConst from "../../../../../../consts/MKvCategoriesConst";
import MKvsConst from "../../../../../../consts/MKvsConst";
import MastersUtil from "../../../../../../frameworks/MastersUtil";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { MCustomer } from "../../../../../masters/class/models/MCustomer";
import { TProjectProductProcessProductions } from "../TProjectProductProcessProductions";

import { TProjectProductProcess } from "../../TProjectProductProcess";

import { TypeMaterialSheets4Simulation,TypeSeparatedRect } from "../../TProjectProduct";
import { TypeLayout } from "../../TypeLayoutResult";

export class TProjectProductProcessUniteRoleMaterials {
     
    // 型判別用
    get IsUniteRoleMaterials():boolean{
        return true ; 
    }

    /**
     * タイプ
     */
    m_kv_id_01:number = 0 ; 
    get CategoryMKvId():number { return this.m_kv_id_01 ; }
    set CategoryMKvId(v:number) { this.m_kv_id_01 = v ; }

    /**
     * マスタ引き材料
     */
    get UnitRollMaterial() {
        if(TProjectProductProcess.is(this)) {
            return this.m_material01
        }
        return 
    }
    set UnitRollMaterial(v) {
        if(TProjectProductProcess.is(this)) {
            this.m_material01 = v
            this.UpdateMainMaterialRollSheets()
        }
        return 
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
        this.UpdateMainMaterialRollSheets();       
    }

    
    /**
     * 両面印刷
     */
    is_03:boolean = false  ; 
    public static IsDoubleFace_PName = "IsDoubleFace" ; 
    get IsDoubleFace ():boolean { return Boolean(this.is_03) ; }        
    set IsDoubleFace (v:boolean ){ this.is_03 = v ; }

    
    /**
     * 両面印刷掛け率
     */
     get DoubleFaceRate():number { 
        return ( this.IsDoubleFace ? 2 : 1 ) ; 
    }
    

    /**
     * 両面込の合計Sqm
     */
    get SqmIncDoubleFace ():number { 
        const doubleTimesRate = ( this.IsDoubleFace ? 2 : 1 ) ; 
        let sqmIncDf = 0 ; 
        if ( TProjectProductProcess.is(this) ){
            sqmIncDf = (this.TProjectProduct?.SqmIncExt ?? 0) * doubleTimesRate   ; 
            this.custom_sqm = sqmIncDf  ; 
            return this.custom_sqm ; 
        }
        return sqmIncDf ; 
    }

    
    /**
     * メディア名
     */
     get MaterialName():string{        
        let name = "" ; 
        if ( this.IsNotRefMaster){
            name = this.CustomMaterialName ?? "";         
        }
        else{
            if ( TProjectProductProcess.is(this)){
                name = MastersUtil.getMaterialName(this.m_material01) ; 
            }
            
        }        
        return name; 
    }

    /**
     * 正式メディア名
     */
     get MaterialLongName():string{        
        let name = "" ; 
        if ( this.IsNotRefMaster){
            name = this.CustomMaterialName ?? "";         
        }
        else{
            if ( TProjectProductProcess.is(this)){
                name = MastersUtil.getMaterialName(this.m_material01) ; 
                if (! _.isNil(this.m_material01)){
                    name = this.m_material01.name ?? "" ;  
                }
            }
        }
        return name; 
    }


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


        return this.m_material01?.is_stocked ?? false ; 
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
     * 手入力メディア幅
     */
     n_01:number = 0 ; 
     get CustomSheetWidth():number { return this.n_01 ; }
     set CustomSheetWidth(v:number) { 
         this.n_01 = v ; 
         this.UpdateMainMaterialRollSheets();       
     
     }
 
     /**
      * メディア 幅マージン
      * @param p 
      */
    n_02:number = 0 ; 
    get SheetWidthMargin():number { return this.n_02 ; }
    set SheetWidthMargin(v:number) { 
        this.n_02 = v ; 
        this.UpdateMainMaterialRollSheets();
    }
 
     /**
      * 手入力巻m数
      */
    n_03:number = 0 ; 
    get CustomSheetHeight():number { return this.n_03 ; }
    set CustomSheetHeight(v:number) { 
        this.n_03 = v ; 
        this.UpdateMainMaterialRollSheets();    
    }
 
     /**
      * 手入力有効 巻m数
      */
    n_04:number = 0 ; 
    get CustomSheetValidHeight():number { return this.n_04 ; }
    set CustomSheetValidHeight(v:number) { 
        this.n_04 = v ; 
        this.UpdateMainMaterialRollSheets();
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
 

    private get Bridge_IsCustomerProvide():boolean { 
        if (! TProjectProductProcess.is(this) ) return false ; 

        return this.IsCustomerProvide  ; 
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


    n_07:number = 0
    get UnitTargetW ():number { return this.n_07; }
    set UnitTargetW (v:number ){ this.n_07 = v ; }
    n_08:number = 0
    get UnitTargetH ():number { return this.n_08; }
    set UnitTargetH (v:number ){ this.n_08 = v ; }
    n_09:number = 0
    get UnitTargetQty ():number { return this.n_09; }
    set UnitTargetQty (v:number ){ this.n_09 = v ; }

    /**
     * メイン材料ロールシート
     */
    main_material_roll_sheets:Array<TypeMaterialSheets4Simulation> = [] ; 
    public UpdateMainMaterialRollSheets() {
        // console.log("UpdateMainMaterialRollSheets " ) ;  
        let list:Array<TypeMaterialSheets4Simulation> = [] ; 

        this.main_material_roll_sheets.splice(0);
        if ( this === undefined ) return;

        if ( this.IsNotRefMaster ) {
            // Sheets - Rollのみ
            let sw = NumberUtil.invalid2zr(this.CustomSheetWidth )   ;                                
            let sh = NumberUtil.invalid2zr(this.CustomSheetHeight) ; 
            sh *= 1000 ;

            let swIncLoss = NumberUtil.invalid2zr(sw - this.SheetWidthMargin) ; 
            let shIncLoss = NumberUtil.invalid2zr(this.CustomSheetValidHeight) ; 
            shIncLoss *= 1000 ;

            list.push(
                { 
                    w   :sw , 
                    wIncLoss    : swIncLoss , 
                    h   :sh, 
                    hIncLoss    : shIncLoss ,
                    //cost        : this.cPricePerSqm ,  
                    cost        : 0 ,
                } 
            ) ; 


        }
        else { 
            if (! TProjectProductProcess.is(this)) return  ;         

            if ( this.m_material01 !== undefined  ){
                const sheetWMargin = NumberUtil.invalid2zr(this.SheetWidthMargin) ; 
                list = this.m_material01.m_material_details.map(function(x){
                    return {
                        w : x.width ,
                        wIncLoss    :  x.width - sheetWMargin , 
                        h : x.height ,
                        hIncLoss : Number(x.height_including_loss) ,
                        cost:Number(x.cost_price) ,
                    }
                })  ;

            }
            
        }
        
        // console.log(list)
        this.main_material_roll_sheets.push(...list) ; 

        // this.main_material_roll_sheets.splice( 0 ,this.main_material_roll_sheets.length , ...list )  ; 
        
    }

    //分割不可
    get SheetRects():TypeSeparatedRect[]{

        return [{
            w : this.UnitTargetW,
            h : this.UnitTargetH,
            tPosX : this.UnitTargetW / 2,
            tPosY : this.UnitTargetW / 2,
        }]
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
            cost = this.MaxSheet?.cost ?? 0 ; 
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
                const numOfRollsNeeded = NumberUtil.ceil(this.NumOfRollsNeeded) ; 
                
                // 必要ロール数分のコスト
                const costOfRollsNeeded = numOfRollsNeeded * costPerRoll ; 

                // ㎡換算
                cost = NumberUtil.invalid2zr(costOfRollsNeeded / this.Sqm) ; 
                
                
            }
            else
            {
                // ㎡                   
                
                // ロール１本の価格から取得した㎡単価
                // const sqm = this.cCustomSheetWidth * this.cSheetValidH * 0.001  * 0.001 ; 
                const sqm = this.CustomSheetWidth * this.SheetValidHeight * 0.001  * 0.001 ;                 
                
                const costPerSqmByRoll = NumberUtil.ceil((costPerRoll / sqm )) ; 
                cost = costPerSqmByRoll ;                 

            }

        }

        cost = NumberUtil.invalid2zr(NumberUtil.ceil(cost , 3))
        this.n_10 = cost ; 
        return this.n_10 ; 
    }    

    /**
     * 使用m数
     */
    get TotalUseHLength():number { 
        let val = 0 ; 
        const doubleTimesRate = ( this.IsDoubleFace ? 2 : 1 ) ; 
        if ( TProjectProductProcess.is(this) && this.TProjectProduct !== undefined ){
            if ( this.TProjectProduct.IsBoard ) { 
                // 板系
                let lenPerQty = 0 ; 
                for ( const board of this.TProjectProduct.BoardMaterialSheets) {                  
                    
                    const longerLen = NumberUtil.invalid2zr( Math.max(board.w , board.h ) );   
                    const shorterLen = NumberUtil.invalid2zr( Math.min(board.w , board.h ) );   

                    // 長辺がラミのWに入る場合はそうする
                    let len = this.SheetValidWidth >= longerLen ? shorterLen : longerLen ; 
                    // console.log(`${board.w} x ${board.h} :len ${len}  qty: ${board.qty}枚`) ; 
                    
                    lenPerQty += len * NumberUtil.invalid2zr(board.qty) ; 
                }
                //console.log(`lenPerQty : ${lenPerQty}`) ; 
                val += lenPerQty * this.TProjectProduct.qty ; 

            }
            else { 
                val = NumberUtil.invalid2zr( this.TProjectProduct.MaterialUseHLength ); 
            }
        }
        else {
            console.error("is not set TProjectProduct of TProjectProductProcessLami") ; 
            
        }
        val *= doubleTimesRate ; 

        return val ; 


    }


    layout_ok_list:Array<TypeLayout> = [] ; 

    get LayoutOkList(){
        return this.layout_ok_list
    }
    set LayoutOkList(v){
        this.layout_ok_list = v
    }


    /**
     * トータル使用㎡数
     */
    n_11:number = 0 ; 
    get Sqm():number { 
        let res = 0 ; 

        if ( this.LayoutOkList.length !== 0 ) {
            res = this.LayoutOkList.reduce(function (acc, cur){
                return acc + cur.result.sheetSqm  ; 
            } , 0 ) ; 

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
        if ( this.LayoutOkList.length !== 0 ) {
            res = this.LayoutOkList.reduce(function (acc, cur){
                return acc + cur.result.numOfRolls  ; 
            } , 0 ) ; 
        }
        res = NumberUtil.invalid2zr(res) ; 
        this.n_13 = res  ;
        return this.n_13; 
    }

 

    /**
     * 最大の大きさのシート
     */
     public get MaxSheet(){
        const emptySheet = {
            w:0 ,h:0 ,hIncLoss:0 , cost :0 
        } ; 
        
        const _this = this ; 
        if ( this.IsNotRefMaster ){
            // 手入力            
            const customH = NumberUtil.invalid2zr(this.CustomSheetHeight * 1000) ; 
            const customHIncLoss = NumberUtil.invalid2zr(this.CustomSheetValidHeight * 1000) ; 
            const obj = {    
                w       : this.CustomSheetWidth, 
                wIncLoss: this.CustomSheetWidth - _this.SheetWidthMargin  ,
                h       : customH ,
                hIncLoss: customHIncLoss, 
                cost    : 0 ,
            } ; 
            return obj ; 
        }  
        else {
            if (! TProjectProductProcess.is(this)) return emptySheet ;         

            if ( _.isNil(this.m_material01)) return emptySheet ;

            const list = this.m_material01.m_material_details.map(function(x){
                return {
                    w : x.width ,
                    wIncLoss    :  x.width - _this.SheetWidthMargin , 
                    h : x.height ,
                    hIncLoss : Number(x.height_including_loss) ,
                    cost:Number(x.cost_price) ,
                }
            })  ;

            const res = list.reduce(function (accumulator, currentValue) {                    
                return accumulator.w > currentValue.w ? accumulator : currentValue ; 
            }) ; 

            return res ; 
        }

    }

    /**
     * 最大有効シートサイズ
     */
    public get SheetValidWidth():number {        
        let w:number = 0 ; 
        if ( this.IsNotRefMaster){
            w = this.CustomSheetWidth ?? 0 ; 
        }
        else { 
            w  = this.MaxSheet?.w ?? 0 ;             
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
            v = this.CustomSheetValidHeight * 1000; 
        }
        else { 
            v  = this.MaxSheet?.hIncLoss ?? 0 ; 
        }        
        return v < 0 ? 0 : v ; 
    }

    /**
     * 最大有効シートsqm
     */
     public get SheetValidSqm():number {        
        let v:number = 0 ; 
        const sqm = Math.floor(this.SheetValidWidth * this.SheetValidHeight * 0.001 ) * 0.001 ; 
        return sqm ; 
    }

    /**
     * 幅方向入るかの判定
     */
    get IsWIn():boolean { 
        let w = 0 ; 

        if (! TProjectProductProcess.is(this)) return false  ; 
        if ( _.isNil(this.TProjectProduct)) return false ; 

        if ( _.isNil( this.TProjectProduct.MProductCategory )) return false ; 


        if ( this.TProjectProduct.layout_ok_list.length === 0 ) return false ; 

        //指定寸法の短手が幅方向より短い場合しか対応しないようにする
        //分割有は商品貼へ
        w = Math.min(this.UnitTargetW,this.UnitTargetH)

        return this.SheetValidWidth >= w ; 


    }
    

    /**
     * 総加工m数
     */
    get TotalProcessMater():number{
        
        if (! TProjectProductProcess.is(this)) return 0 ; 

        let val = 0 ; 
        if (! _.isNil(this.TProjectProduct)){
            val =  NumberUtil.invalid2zr(this.TProjectProduct.MaterialUseHLength) * 0.001 * this.DoubleFaceRate;    
            this.process_mater = NumberUtil.ceil(val / this.TProjectProduct.Qty , 3) ; 
        }
        else {
            this.process_mater = 0 ; 
        }
        

        this.total_process_mater = val ; 
        return this.total_process_mater; 
        
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

    

    public static Init(p:TProjectProductProcessUniteRoleMaterials){
        
    }

    
    public static is(arg:any):arg is TProjectProductProcessUniteRoleMaterials { 
        if ( arg?.IsUniteRoleMaterials === undefined) return false ; 
        return arg.IsUniteRoleMaterials ; 
    } 
    

}

