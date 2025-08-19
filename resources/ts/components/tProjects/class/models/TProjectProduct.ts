import _, { NumericDictionaryIteratee } from "lodash";
import { filter } from "vue/types/umd";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { MMaterial } from "../../../masters/class/models/MMaterial";
import { TProjectAbstract } from "./TProjectAbstract";
import { TProjectProductBoardLayout } from "./TProjectProductBoardLayout";
import { TProjectProductSeparate } from "./TProjectProductSeparate";
import { TProjectProductProcess } from "./TProjectProductProcess";
import { TProjectProductProcessBoardMaterial } from "./tsMixins/process/TProjectProductProcessBoardMaterial";
import { TProjectProductProcessMaterial } from "./tsMixins/process/TProjectProductProcessMaterial";
import { TypeLayout } from "./TypeLayoutResult";
import { TProject } from "./TProject";
import { TProjectDelivery } from "./TProjectDelivery";
import { MProductCategory } from "../../../masters/class/models/MProductCategory";
import { TProjectProductProcessUniteMaterials } from "./tsMixins/process/TProjectProductProcessUniteMaterials";
import { TProjectProductProcessUseBoardLayout } from "./tsMixins/TProjectProductProcessUseBoardLayout";
import { TypeSize } from "../../../../types/TypeSize";
import { ProductSepareteSides, ProductSepareteWays } from "../../tProducts/tProductProcesses/consts/ProductSepareteDefs";
import { TProjectProductProcessPredicted } from "./tsMixins/TProjectProductProcessPredicted";


export class TProjectProduct extends TProjectAbstract  { 

    // protected _store?:object ; 

    t_project?:TProject ; 

    calced_delivery_date?:any = undefined ;

    public t_project_product_boardlayouts:Array<TProjectProductBoardLayout> = [] ; 
    public t_project_product_estimate_details:Array<object> = [] ;     
    public t_project_product_processes:Array<TProjectProductProcess> = []; 
    public t_project_product_separates:Array<TProjectProductSeparate> = [] ; 
    // public t_project_product_framelayouts:Array<object> = [] ; 
    public t_project_deliveries:Array<TProjectDelivery>|undefined = [] ; 
    public t_project_file:object|undefined = {} ; 
    //public t_production_day_plans:Array<TProductionProcessPlan>

    constructor (createdMUserId:number ) { 
        super(createdMUserId) ; 
        // this._store = store ; 

        this.UnitMKvId = 1530003 ; 
        // this.t_project_product_processes = [] ; 
        //this.t_production_process_plan = []
    }

    get IsTProjectProduct():boolean{
        return true ; 
    }

    set Store(v:any){
        this._store = v ; 
    }

    get Store():any{
        return this._store ; 
    }
    
    
    toJSON () {
        this.UpdateInfo() ; 

        let superJson = super.toJSON() ; 
        return superJson ; 
    }

    /**
     * コピーのために不必要なID類を削除
     */
    public clearRelations4Copy(){
        this.uid = this.id ; 
        this.id = undefined ; 
        this.t_project_id = undefined ;  

        this.delivery_date = undefined ; 
        this.sales_completed_at= undefined ; 

        this.t_project_file_id = undefined ; 
        this.t_project_file_uid = undefined ; 

        // @ts-ignore
        this.created_m_user_id = this.Store?.loginMUser.id  ; 

        for ( const process of this.t_project_product_processes){
            process.id = undefined ; 
            // @ts-ignore
            process.created_m_user_id = this.Store?.loginMUser.id  ; 
        }
        for ( const layout of this.t_project_product_boardlayouts){
            layout.id = undefined ; 
            // @ts-ignore
            layout.created_m_user_id = this.Store?.loginMUser.id ; 
        }
        for ( const separate of this.t_project_product_separates){
            separate.id = undefined ; 
            // @ts-ignore
            separate.created_m_user_id = this.Store?.loginMUser.id ; 
        }

    }

    public UpdateInfo(){

        // 再計算＆カラムにセット
        this.ProfitPer          ; // 利益率（原価,売価,利益が含まれる）
        // // this.MarginProfitPer    ; // 限界利益率（変動費,限界利益が含まれる）
        this.TotalWeight        ;
        // // console.log("Display_01 " + this.Display01) ; 
        this.updateDisplay01() ;
        this.Display02 ;
        this.Display03 ;

        // 貼りの板レイアウト更新
        for ( const p of this.t_project_product_processes){
            if (TProjectProductProcessUseBoardLayout.is(p)){
                p.UpdateLayouts() ; 
                delete p._manager ; 
            }
        }
        
    }


    //#region カラム系

    uid?:number|null = null ;
      
    t_project_id?:number|null = null ;  

    total_hour_for_production:number = 0 ; 
    total_margin_profit:number = 0 ; 
    total_variable_cost:number = 0 ; 
    variable_cost:number = 0 ; 
    margin_profit:number = 0 ; 
    margin_profit_per:number = 0 ; 


    m_product_category:object|undefined = undefined ;
    t_project_file_id?:number|null = null   ;
    t_project_file_uid?:number|null = null   ;
    sales_completed_at?:Date|null = null ; 


    /**
     * オペレータ担当
     */
    operator_m_user_id?:number|null = null ; 
    public get OperatorMUserName():string{                
        // @ts-ignore        
        if ( this._store?.masters === undefined ) return "" ;         

        // @ts-ignore
        const user = this._store.masters.getMUserById(this.operator_m_user_id) ; 
        return user?.full_name ?? "" ; 
    }

    /**
     * 拠点ID
     */
    m_branch_id:number|undefined = undefined ; 
    public static MBranchId_PName = "MBranchId" ; 
    get MBranchId ():number { return this.m_branch_id ?? 0 ; }
    set MBranchId (v:number ){ this.m_branch_id = v ; } 

    /**
     * 商品名
     */
    name:string = "" ; 
    public static Name_PName = "Name" ; 
    get Name ():string { return this.name ?? "" ; }
    set Name (v:string ){ this.name = v ; }    
     
    
    /**
     * 納期
     */
    delivery_date:any = "" ; 
    public static DeliveryDate_PName = "DeliveryDate" ; 
    get DeliveryDate ():any { return this.delivery_date ?? "" ; }
    set DeliveryDate (v:any ){ this.delivery_date = v ; }    
    
    /**
     * 商品分類ID
     */
    m_product_category_id:number|undefined = undefined  ; 
    public static MProductCategoryId_PName = "MProductCategoryId" ; 
    get MProductCategoryId ():number|undefined { return this.m_product_category_id  ; }
    set MProductCategoryId (v:number|undefined ){ this.m_product_category_id = v ; }    
        

    get MProductCategory():MProductCategory|undefined{        
        // @ts-ignore
        if ( this._store?.masters?.MProductCategories === undefined ) return undefined ;         
        if ( _.isNil(this.MProductCategoryId)) return undefined ; 

        // @ts-ignore
        const found = this._store.masters.MProductCategories.find(e => e.id ===  this.MProductCategoryId) ; 
        return found ; 
        
    }

    /**
     * Media分割が両方向可能か
     */
    get IsAbleMediaSeparateBothSide():boolean{
        return this.MProductCategory?.is_able_media_separate_both_side ?? false ; 
    }

    /**
     * 数量
     */
    qty:number = 0 ; 
    public static Qty_PName = "Qty" ; 
    get Qty ():number { return this.qty ?? 0 ; }
    set Qty (v:number ){ this.qty = v ; }    
 
    /**
     * 単位区分
     */
    unit_m_kv_id:number = 0 ; 
    public static UnitMKvId_PName = "UnitMKvId" ; 
    get UnitMKvId ():number { return this.unit_m_kv_id ?? 0 ; }
    set UnitMKvId (v:number ){ this.unit_m_kv_id = v ; }    

    //#region サイズ系

    /**
     * サイズW
     */
    size_w:number = 0 ; 
    public static SizeW_PName = "SizeW" ; 
    get SizeW ():number { 
        return this.size_w ?? 0 ; 
    }
    set SizeW (v:number ){ 
        this.size_w = v ; 
        // 更新
        this.Display01 ; 
    }
         
    /**
     * サイズH
     */
    size_h:number = 0 ; 
    public static SizeH_PName = "SizeH" ; 
    get SizeH ():number { return this.size_h ?? 0 ; }
    set SizeH (v:number ){ 
        this.size_h = v ; 
        // 更新
        this.Display01 ; 
    }

    /**
     * 伸ばしL
     */
    size_extend_l:number = 0 ; 
    public static SizeExtendL_PName = "SizeExtendL" ; 
    get SizeExtendL ():number { return this.size_extend_l ?? 0 ; }
    set SizeExtendL (v:number ){ this.size_extend_l = v ; }
 
    
    /**
     * 伸ばしR
     */
    size_extend_r:number = 0 ; 
    public static SizeExtendR_PName = "SizeExtendR" ; 
    get SizeExtendR ():number { return this.size_extend_r ?? 0 ; }
    set SizeExtendR (v:number ){ this.size_extend_r = v ; }

    /**
     * 伸ばしT
     */
    size_extend_t:number = 0 ; 
    public static SizeExtendT_PName = "SizeExtendT" ; 
    get SizeExtendT ():number { return this.size_extend_t ?? 0 ; }
    set SizeExtendT (v:number ){ this.size_extend_t = v ; }

    /**
     * 伸ばしB
     */
    size_extend_b:number = 0 ; 
    public static SizeExtendB_PName = "SizeExtendB" ; 
    get SizeExtendB ():number { return this.size_extend_b ?? 0 ; }
    set SizeExtendB (v:number ){ this.size_extend_b = v ; }
    
    /**
     * 面積
     */
    sqm:number = 0 ; 
    public static Sqm_PName = "sqm" ; 
    get Sqm ():number { return this.sqm ?? 0 ; }
    set Sqm (v:number ){ this.sqm = v ; }    

    /**
     * 総面積 ( 面積 * 数量)
     */
    total_sqm:number = 0 ; 
    public static TotalSqm_PName = "total_sqm" ; 
    get TotalSqm ():number { return this.total_sqm ?? 0 ; }
    set TotalSqm (v:number ){ this.total_sqm = v ; }    



    /**
     * 幅(伸ばし込)
     */
     public get SizeIncExtW():number{
        return this.size_w + this.size_extend_l + this.size_extend_r; 
    }

    /**
     * 高さ(伸ばし込)
     */
    public get SizeIncExtH():number{
        return this.size_h + this.size_extend_t + this.size_extend_b; 
    }

    
    /**
     * 長手方向の長さ
     */
    public get LongerLength():number{
        return Math.max( this.size_w , this.size_h ) ; 
    }
    
    /**
     * 長手方向の長さ(伸ばし込)
     */
    public get LongerLengthIncExt():number{
        return Math.max( this.SizeIncExtW , this.SizeIncExtH ) ; 
    }

    /**
     * 短手方向の長さ
     */
     public get ShorterLength():number{
        return Math.min( this.size_w , this.size_h ) ; 
    }

    /**
     * 短手方向の長さ(伸ばし込)
     */
     public get ShorterLengthIncExt():number{
        return Math.min( this.SizeIncExtW , this.SizeIncExtH ) ; 
    }

    /**
     * 外周
     */
     public get Perimeter():number{
        return ((this.size_w + this.size_h) * 2 ); 
    }

    /**
     * 外周(伸ばし込)
     */
     public get PerimeterIncExt():number{
        return ((this.SizeIncExtW + this.SizeIncExtH) * 2 ); 
    }

    /**
     * 面積(伸ばし込)
     */    
    get SqmIncExt():number { 
        let sqm = this.SizeIncExtW * this.SizeIncExtH * 0.001 * 0.001 ; 
        sqm = NumberUtil.invalid2zr(sqm) ; 
        this.Sqm = sqm ; 
        this.TotalSqm = sqm * this.qty ; 
        return NumberUtil.round(sqm , 3) ;         
        
    }



    /**
     * 重量
     */
    weight:number = 0 ; 
    get Weight ():number { return this.weight  ; }
 
 
    /**
     * 総重量
     */
    total_weight:number = 0 ; 
    get TotalWeight ():number { 
        let val = 0 ;

        // 総重量
        // if (! _.isNil(this.MainMaterial)) {
        if (! _.isNil(this.main_material)) {
            //@ts-ignore
            val =  NumberUtil.ceil(this.main_material.weight * this.SqmIncExt * this.Qty * 0.001 ,3) ; 
            
        }
        this.total_weight = val ; 

        // 重量
        let weightVal = 0 ; 
        if ( this.total_weight !== 0 ) {
            weightVal = NumberUtil.ceil(this.total_weight / this.Qty , 3) ; 
        }
        this.weight = weightVal ; 

        return val ; 
    
    }

    /**
     * Is板状態
     */
    get IsBoard():boolean { 
        if ( this.MProductCategory === undefined) return false ; 
        if ( this.MProductCategory.is_board  ) return true ; 

        return false ; 
        // if ( this.t_project_product_processes === undefined) return false; 

        // const res = this.t_project_product_processes.filter(
        //     x => x.m_process_category?.is_roll_to_board  &&
        //          x.is_enabled ) ; 

        // return res.length !== 0  ; 

    }

    /**
     * 
     */
    main_material_process?:TProjectProductProcessMaterial|TProjectProductProcessBoardMaterial= undefined
    
    /**
     * メイン材料
     */
    main_material:MMaterial|undefined = undefined ; 
 
    /**
     * メイン材料名
     */
    main_material_name:string = ""; 
 
    /**
     * 板材料　使用寸法リスト
     */
    get BoardMaterialSheets():Array<TProjectProductBoardLayout>{
        // if (! this.IsBoard) return []    ; 
        let val = this.t_project_product_boardlayouts ?? [] ; 
        // console.log("val") ; 
        // console.log(val) ; 
        // まだレイアウトがロードされていない？
        if ( val.length === 0 ){
            const row = new TProjectProductBoardLayout(0) ; 
            row.w =  NumberUtil.invalid2zr( this.SizeW)  ; 
            row.h =  NumberUtil.invalid2zr( this.SizeH)  ; 
            row.qty = 1 ; 
            val = [row] ; 
        }
        return val ; 
        
    }

    /**
     * Boardレイアウト
     */
    get BoardLayouts():TProjectProductBoardLayout[] {          
        return this.t_project_product_boardlayouts ?? [] ; 
    }
    set BoardLayouts(v:TProjectProductBoardLayout[]){
        this.t_project_product_boardlayouts.splice( 0 ,this.t_project_product_boardlayouts.length ,...v ) ; 
    }




    /**
     * メイン材料ロールシート
     */
    main_material_roll_sheets:Array<TypeMaterialSheets4Simulation> = [] ; 
    public UpdateMainMaterialRollSheets() {
        // console.log("UpdateMainMaterialRollSheets " ) ;  
        let list:Array<TypeMaterialSheets4Simulation> = [] ; 

        this.main_material_roll_sheets.splice(0);
        if ( this.main_material_process === undefined ) return;

        if ( this.main_material_process.IsNotRefMaster ) {
            // Sheets - Rollのみ
            if ( TProjectProductProcessMaterial.is(this.main_material_process)){
                let sw = NumberUtil.invalid2zr(this.main_material_process.CustomSheetWidth )   ;                                
                let sh = NumberUtil.invalid2zr(this.main_material_process.CustomSheetHeight) ; 
                sh *= 1000 ;

                let swIncLoss = NumberUtil.invalid2zr(sw - this.main_material_process.SheetWidthMargin) ; 
                let shIncLoss = NumberUtil.invalid2zr(this.main_material_process.CustomSheetValidHeight) ; 
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
        }
        else { 
            if ( this.main_material !== undefined  ){
                if ( TProjectProductProcessMaterial.is(this.main_material_process)){
                    const sheetWMargin = NumberUtil.invalid2zr(this.main_material_process.SheetWidthMargin) ; 
                    list = this.main_material.m_material_details.map(function(x){
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
            
        }
        
        this.main_material_roll_sheets.push(...list) ; 

        // this.main_material_roll_sheets.splice( 0 ,this.main_material_roll_sheets.length , ...list )  ; 
        
    }
    

    /**
     * 子から呼び出し 
     *  メインマテリアル更新時に実行
     */
    public UpdateMainMaterial(){
        // console.log("updateMainMaterial " ) ;  
        const filterdProcesses = this.t_project_product_processes.filter(x => _.isNil(x.deleted_at) && x.is_enabled )

        let rtn = undefined 
        for ( const p of filterdProcesses) {             
            if (! _.isNil(p.MProcessCatgory) && p.MProcessCatgory.is_main_material ){                
                // @ts-ignore
                if ( TProjectProductProcessMaterial.is(p) || TProjectProductProcessBoardMaterial.is(p)){
                    rtn = p  ;                                         
                    break ; 
                }                
            }            
        }
        this.main_material_process = rtn ;        
        // this.main_material_roll_sheets.splice(0) ;  

        if ( rtn == undefined ){
            this.main_material = undefined ; 
            this.main_material_name = "" ; 
        }
        else {
            if ( rtn.IsNotRefMaster ) {
                this.main_material = undefined ; 
                this.main_material_name = rtn.CustomMaterialName ?? "" ;

            }
            else { 
                this.main_material = rtn?.m_material01 ; 
                this.main_material_name = this.main_material?.display_name ?? "" ; 

            }
            
        }

        // 
        this.UpdateMainMaterialRollSheets();

        this.Display01 ; 
        return this.main_material_process ; 
    }

    /**
     * 最大幅のロールシート
     */
    public get MaxWidthRollSheet():TypeMaterialSheets4Simulation|undefined { 
        if ( this.main_material_roll_sheets.length === 0 ) return undefined ; 

        // const res = this.dSheets.reduce(function (accumulator, currentValue) {                    
        const res = this.main_material_roll_sheets.reduce(function (accumulator, currentValue) {                    
            return accumulator.w > currentValue.w ? accumulator : currentValue ; 
        } ) ; 
        
        return res ; 
    }

    


    //#endregion



    //#region  分割系

    /**
     * 選択されている方向
     */
    tmp_selected_side:ProductSepareteSides = ProductSepareteSides.W ;     
    get SelectedSide ():ProductSepareteSides { 
        return this.tmp_selected_side ; 
    }
    set SelectedSide (v:ProductSepareteSides ){ 
        if ( ! this.IsAbleMediaSeparateBothSide) {
            if (v == ProductSepareteSides.W){
                this.NumOfSepH = 1 ; 
            }
            else { 
                this.NumOfSepW = 1 ; 
                

            }

        }
        this.tmp_selected_side = v ; 
    }    

    /**
     * 選択中の辺の製品寸法
     */
    get SelectedSideLength():number {           
        if ( this.tmp_selected_side === ProductSepareteSides.H){
            return this.size_h ; 
        }
        else { 
            return this.size_w ; 
        }
    }

    
    /**
     * 選択中の辺の開始マージン寸法
     */
     get SelectedSideFirstMargin():number {           
        if ( this.tmp_selected_side === ProductSepareteSides.H){
            return this.size_extend_t ; 
        }
        else { 
            return this.size_extend_l ; 
        }
    }


    /**
     * 選択されている辺の分割数
     */
    get SelectedNumOfSep():number {         
        if ( this.tmp_selected_side === ProductSepareteSides.H){
            return this.NumOfSepH ; 
        }
        else { 
            return this.NumOfSepW ; 
        }
    }
    set SelectedNumOfSep(v:number) {         
        // console.log(`SelectedNumOfSep : ${this.tmp_selected_side} - ${v}` ); 
        if ( this.tmp_selected_side === ProductSepareteSides.H){
            this.NumOfSepH = v ; 
        }
        else { 
            this.NumOfSepW = v ; 
        }
    }

    /**
     * 選択されている辺の分割方法
     */
    get SelectedSepWay():ProductSepareteWays {         
        if ( this.tmp_selected_side === ProductSepareteSides.H){
            return this.sep_way_h ; 
        }
        else { 
            return this.sep_way_w ; 
        }
    }
    set SelectedSepWay(v:ProductSepareteWays) {         
        if ( this.tmp_selected_side === ProductSepareteSides.H){
            this.sep_way_h = v ; 
        }
        else { 
            this.sep_way_w = v ; 
        }
    }

    /**
     * W 分割数
     */
    num_of_sep_w:number = 1 ; 
    get NumOfSepW ():number { 
        if ( NumberUtil.invalid2zr(this.num_of_sep_w) === 0 ) this.num_of_sep_w = 1 ; 
        return this.num_of_sep_w ; 
    }
    set NumOfSepW (v:number ){ 
        this.num_of_sep_w = v ;        
        this.PositionsW ;   
        
    }    

    

    /**
     * H 分割数
     */
    num_of_sep_h:number = 1 ; 
    get NumOfSepH ():number { 
        if ( NumberUtil.invalid2zr(this.num_of_sep_h) === 0 ) this.num_of_sep_h = 1 ; 
        return this.num_of_sep_h ; 
    }
    set NumOfSepH (v:number ){ 
        this.num_of_sep_h = v ; 
        this.PositionsH ;  
        // this.SeparatedSheets ; 

    }    

    /**
     * W 分割方法
     */
    sep_way_w:ProductSepareteWays = ProductSepareteWays.PerCapitaRate ; 

    /**
     * H 分割方法
     */
    sep_way_h:ProductSepareteWays = ProductSepareteWays.PerCapitaRate ; 

    /**
     * 分割された四角
     */
    separatedRects:TypeSeparatedRect[] = []  ;

    /**
     * 選択されている位置
     */
    get SelectedPositions():TProjectProductSeparate[] { 
        // 選択されていなくても再計算させる為
        this.PositionsH ; 
        this.PositionsW ; 
        if ( this.tmp_selected_side === ProductSepareteSides.H){            
            return this.PositionsH ; 
        }
        else { 
            return this.PositionsW ; 
        }
    }

    _positionsW:TProjectProductSeparate[] = [] ; 
    get PositionsW():TProjectProductSeparate[]{
        this._positionsW = this.getPositions(true ) ; 
        return this._positionsW ; 
    }

    _positionsH:TProjectProductSeparate[] = [] ; 
    get PositionsH():TProjectProductSeparate[]{
        this._positionsH = this.getPositions(false ) ;  
        return this._positionsH; 
    }

    /**
     * 重ね代込のW
     */
    get SizeIncOverlapW():number { 
        return this.SizeIncExtW + (this.sep_overlap_length ?? 0) * (this.num_of_sep_w - 1) ; 
    }

    /**
     * 重ね代込のH
     */
    get SizeIncOverlapH():number { 
        return this.SizeIncExtH + (this.sep_overlap_length ?? 0) * (this.num_of_sep_h - 1) ; 
    }


    /**
     * ポジション取得
     * @param isW 
     * @returns 
     */
    protected getPositions(isW:boolean):TProjectProductSeparate[]{
        const sepWay   = isW ? this.sep_way_w : this.sep_way_h ; 
        const numOfSep = isW ? this.NumOfSepW : this.NumOfSepH ; 
        // 辺の長さ
        const edgeLen  = isW ? this.size_w : this.size_h ; 
        // 伸ばし込　辺の長さ
        const edgeLenIncExtends  = isW ? this.SizeIncExtW : this.SizeIncExtH ; 
        // 重ね代
        const sepOverlapLen = this.sep_overlap_length ?? 0 ; 
        // 合計重ね代寸法
        const totalOverLapLength = isW ? this.SizeIncOverlapW : this.SizeIncOverlapH ; 

        // 伸ばし開始
        const firstMargin = isW ? this.size_extend_l : this.size_extend_t ; 
        // 伸ばし終了
        const lastMargin  = isW ? this.size_extend_r : this.size_extend_b ; 

        // 必要シート寸法
        // const len      = edgeLen + totalOverLapLength + firstMargin + lastMargin ; 
        const len      = totalOverLapLength  ; 

        // console.log(`sepWay:${sepWay} isW:${isW}`) ;  
        let currentPos = 0 ;  
        const posArray:TProjectProductSeparate[] = [] ; 

        if ( sepWay === ProductSepareteWays.Input){
            // console.log("ProductSepareteWays.Input") ; 
            const filterd = this.t_project_product_separates.filter(x => x.is_w === isW ) ; 
            const removeTargets = filterd.filter(x => filterd.indexOf(x) + 1 > numOfSep) ; 
            _.remove(this.t_project_product_separates , (x => removeTargets.indexOf(x) !== -1 )); 

            // 指定
            for (let j = 0 ; j < numOfSep ; j++ ){
                
                let productSep = filterd[j] ;  
                if ( productSep === undefined){
                    // @ts-ignore
                    productSep = new TProjectProductSeparate(this._store.loginMUser.id ) ; 
                    productSep.is_w = isW ;
                    this.t_project_product_separates.push(productSep) ;                         
                }
                
                
                if ( j === 0 ){
                    // 最初  最初の伸ばし分を引く
                    if ( numOfSep === 1 ){
                        productSep.pos = edgeLen ; 
                    } 
                    productSep.abs_pos = productSep.pos + firstMargin ;         
                    currentPos += productSep.abs_pos ;
                }
                else if ( j === (numOfSep - 1)){
                    // 最後　
                    // console.log(`currentPos : ${currentPos}`) ; 
                    productSep.pos = edgeLen - currentPos + firstMargin ; 
                    productSep.abs_pos = edgeLenIncExtends - lastMargin; 
                }
                else { 
                    // 重ね代分を引く（バックする）
                    // const backedLen = productSep.pos - sepOverlapLen
                    productSep.abs_pos = currentPos + productSep.pos ; 
                    currentPos += productSep.pos ;
                }
                
            }


            // Delete Insert
            
            

        }    
        else { 
            const lenStep = Math.trunc(len / numOfSep) ; 
            // console.log(`isW:${isW} len:${len} / numOfSep:${numOfSep} = lenStep:${lenStep}  `) ; 

            // 均等割り
            for (let j = 0 ; j < numOfSep ; j++ ){
                // @ts-ignore
                const productSep = new TProjectProductSeparate(this._store.loginMUser.id ) ; 
                productSep.is_w = isW ;

                if ( j === 0 ){
                    // 最初  最初の伸ばし分を引く
                    productSep.pos = lenStep - firstMargin ;                     
                    productSep.abs_pos = lenStep  ; 
                    if ( numOfSep === 1 ){
                        productSep.pos -= lastMargin ; 
                        productSep.abs_pos -= lastMargin ; 
                    } 
                    currentPos += firstMargin ; 
                }
                else if ( j === (numOfSep - 1)){
                    // 最後　
                    // console.log(`currentPos : ${currentPos}`) ; 
                    productSep.pos = edgeLen - currentPos + firstMargin ; 
                    productSep.abs_pos = edgeLenIncExtends - lastMargin; 
                }
                else { 
                    // 重ね代分を引く（バックする）
                    productSep.pos = lenStep - sepOverlapLen ; 
                    productSep.abs_pos = currentPos + productSep.pos ; 
                }
                posArray.push(productSep) ; 
                currentPos += productSep.pos ;
            }

            // Delete Insert
            _.remove(this.t_project_product_separates , (x => x.is_w === isW));  
            this.t_project_product_separates.push(...posArray) ; 
            
        }

        return this.t_project_product_separates.filter(x => x.is_w === isW) ; 
    }


    /**
     * 分割後のシートの配列
     */
    get SeparatedSheets():TypeSeparatedRect[]{
        
        const rtn:TypeSeparatedRect[] = [] ; 


        const posW = [...this._positionsW] ;         
        const posH = [...this._positionsH] ; 

        
        if ( posW.length !== this.num_of_sep_w)  return [] ; 
        if ( posH.length !== this.num_of_sep_h)  return [] ; 
        
        // console.log(posH) ; 

        // W
        let currentW:number = 0 ; 
        for ( let iW = 0 ; iW < this.num_of_sep_w ; iW++ ){
            let szW:number = 0 ; 
            let tPosX:number = 0 ;
            // console.log(`iw:${iW}`) ; 
            if (iW === (this.num_of_sep_w - 1)){
                // 最後                    
                szW = this.SizeIncOverlapW - currentW ; 
                const beforeAbsPos = iW === 0 ? 0 : posW[iW - 1].abs_pos; 
                const diffPos = posW[iW].abs_pos + this.size_extend_r - beforeAbsPos ; 
                tPosX = beforeAbsPos + (diffPos / 2 ) ; 
            } 
            else if ( iW === 0 ){
                // 最初
                szW = posW[iW].pos + this.size_extend_l ; 
                tPosX = szW / 2 ; 
                 
            }
            else { 
                // 途中
                szW = posW[iW].pos + this.sep_overlap_length ; 

                const beforeAbsPos = posW[iW - 1].abs_pos ; 
                const diffPos = posW[iW].abs_pos - beforeAbsPos ; 
                tPosX = beforeAbsPos + (diffPos / 2)  ; 

            }

            currentW += szW ; 



            // H
            let currentH:number = 0 ; 
            for ( let iH = 0 ; iH < this.num_of_sep_h ; iH++ ){

                const newSize:TypeSeparatedRect = {
                    w:szW ,
                    h:0 ,
                    tPosX:tPosX ,
                    tPosY:0 ,
                }

                if (iH === (this.num_of_sep_h - 1)){
                    // 最後                    
                    newSize.h = this.SizeIncOverlapH - currentH ; 
                    const beforeAbsPosH = iH === 0 ? 0 : posH[iH - 1].abs_pos; 
                    const diffPosH = posH[iH].abs_pos + this.size_extend_b - beforeAbsPosH ; 
                    newSize.tPosY = beforeAbsPosH + (diffPosH / 2 ) ; 

                }
                else if ( iH === 0 ){
                    // 最初
                    newSize.h = posH[iH].pos + this.size_extend_t ; 
                    newSize.tPosY = newSize.h / 2 ;
    
                    
                }
                else { 
                    // 途中
                    newSize.h = posH[iH].pos + this.sep_overlap_length ; 

                    const beforeAbsPos = posH[iH - 1].abs_pos ; 
                    const diffPos = posH[iH].abs_pos - beforeAbsPos ; 
                    newSize.tPosY = beforeAbsPos + (diffPos / 2)  ; 
    
                    // newSize.tPosY = currentH + (newSize.h / 2) ;

                }
                // console.log(newSize) ; 
                rtn.push(newSize) ; 

                currentH += newSize.h ; 
            }
        }

        // console.log(rtn) ; 

        return rtn ; 
    }


    /**
     * 商品分割の重ね代（寸法）
     */
    sep_overlap_length:number = 0 ; 
    public static SepOverlapLength_PName = "SepOverlapLength" ; 
    get SepOverlapLength ():number { return this.sep_overlap_length ?? 0 ; }
    set SepOverlapLength (v:number ){ this.sep_overlap_length = v ; }    

    /**
     * base64された板レイアウトのSVGイメージ
     */
    board_layout_base64_svg:string|null = null ; 
    public static BoardLayoutBase64Svg_PName = "BoardLayoutBase64Svg" ; 
    get BoardLayoutBase64Svg ():string|null { return this.board_layout_base64_svg ; }
    set BoardLayoutBase64Svg (v:string|null ){ this.board_layout_base64_svg = v ; }    

    /**
     * base64された分割レイアウトのSVGイメージ
     */
    separate_base64_svg:string|null = null ; 
    public static SeparateBase64Svg_PName = "SeparateBase64Svg" ; 
    get SeparateBase64Svg ():string|null { return this.separate_base64_svg ; }
    set SeparateBase64Svg (v:string|null ){ this.separate_base64_svg = v ; }    
     

    //#endregion

    //#region レイアウト系 

    layout_ok_list:Array<TypeLayout> = [] ; 

    /**
     * トータル使用流れm数
     */
    public get MaterialUseHLength():number { 
        // console.log("MaterialUseHLength")  ;
        if ( this.layout_ok_list.length === 0 ) return 0 ; 

        let res = this.layout_ok_list.reduce(function (acc, cur){
            return acc + cur.result.sheetFeedLen  ; 
        } , 0 ) ; 

        res = NumberUtil.invalid2zr(res) ; 
        // console.log("MaterialUseHLength" + res)  ;

        return res; 


    }


    //#endregion

    //#region 金額系

    
    /**
     * 売価
     */
    sell_price:number = 0 ; 
    public static SellPrice_PName = "SellPrice" ; 
    get SellPrice ():number { return this.sell_price ?? 0 ; }
    set SellPrice (v:number ){ this.sell_price = v ; }    

    /**
     * 総売価
     */
    total_sell_price:number = 0 ; 
    get SellTotalPrice ():number { 
        const val = NumberUtil.round(this.SellPrice * this.Qty , 0)  ; 
        this.total_sell_price = val  ;
        return this.total_sell_price ?? 0 ; 
    
    }

    
    /**
     * 原価
     */
    cost:number = 0 ; 
    get Cost ():number { 
        const val = NumberUtil.round(this.TotalCost / this.Qty , 0)  ; 
        this.cost = val  ;
        return this.cost ?? 0 ; 
        
    }

    /**
     * 総原価
     */    
    total_cost:number = 0 ; 
    get TotalCost ():number {         
        const val = _.ceil(_.sumBy( this.EnabledProcesses , "total_cost") ,3)  ;         
        this.total_cost = val ; 
        return val ;
    }


    /**
     * 利益
     */    
    profit:number = 0 ; 
    get Profit ():number {         
        const val = NumberUtil.round(this.TotalProfit / this.Qty , 0)  ; 
        this.profit = val ; 
        return val ;
    }
     

    /**
     * 総利益
     */    
    total_profit:number = 0 ; 
    get TotalProfit ():number {         
        let val = NumberUtil.invalid2zr( this.SellTotalPrice - this.TotalCost) ; 
        this.total_profit = val ; 
        return val ;
    }

    

    /**
     * 利益率
     */    
    profit_per:number = 0 ; 
    get ProfitPer ():number {  
        let val =  (1 - (this.TotalCost / this.SellTotalPrice)) * 100  ; 
        //console.log("profitPer:" + profitPer) ; 

        if ( isNaN(val) || ! isFinite(val)) val = 0 ; 
        val = NumberUtil.round(val , 2) ; 

        this.profit_per = val ; 
        return val ;
    }
 

    
    /**
     * 有効な工程
     */
    get EnabledProcesses():Array<TProjectProductProcess>{
        const filterd = this.t_project_product_processes.filter(x => x.is_enabled) ; 
        return filterd ; 
    }
    
    
    //#endregion


    
    /**
     * 表示1
     */
    display_01:string = "" ; 
    get Display01 ():string { 
        // console.log(`w:${this.size_w} h:${this.size_h} ${this.main_material_name ?? ""}`) ; 
        // console.log(`w:${this.size_w} h:${this.size_h} main_material_name:${this.main_material_name}`) ; 
        // let disp01 = `W${this.size_w.toLocaleString()} x H${this.size_h.toLocaleString()} ${this.main_material_name ?? ""} `
        // let disp01 = `W${this.size_w.toLocaleString()} x H${this.size_h.toLocaleString()} ${this.main_material_name ?? ""}` ; 
    
        // if ( disp01 != this.display_01){
        //     this.display_01 = disp01 ;     
        // }
        
        return this.display_01  ; 
    
    }
    public updateDisplay01(){
        let disp01 = `W${this.size_w.toLocaleString()} x H${this.size_h.toLocaleString()} ${this.main_material_name ?? ""}` ; 
    
        if ( disp01 != this.display_01){
            this.display_01 = disp01 ;     
        }
        
    }

    /**
     * 表示2
     */
    display_02:string = "" ; 
    get Display02 ():string { 
    
        let disp02 = "" ; 
        if (this.m_product_category !== undefined) {
            // @ts-ignore
            disp02 += this.m_product_category.name ; 
        }            
        this.display_02 = disp02 ; 
        return this.display_02  ; 
    }
    
    /**
     * 表示3
     */
    display_03:string = "" ; 
    get Display03 ():string { 
        let disp03 = ""  ;
        for ( const p of this.t_project_product_processes){
            if ( !p.is_enabled ) continue ; 
            // @ts-ignore
            disp03 += p.m_process_category.name + ","; 
        }
        disp03 = disp03.slice( 0, -1 ); 
        this.display_03 = disp03 ; 

        return this.display_03  ; 
    }
    

    /**
     * 表示4
     */
    display_04:string = "" ; 
    get Display04 ():string { return this.display_04 ; }

    /**
     * 表示5
     */
    display_05:string = "" ; 
    get Display05 ():string { return this.display_05 ; }

    /**
     * 保証
     */
    warranty_m_kv_id:number|null = null ; 
    public static WarrantyMKvId_PName = "WarrantyMKvId" ; 
    get WarrantyMKvId ():number|null { return this.warranty_m_kv_id ; }
    set WarrantyMKvId (v:number|null ){ this.warranty_m_kv_id = v ; }

    /**
     * 指定
     */
    specified_m_kv_id:number|null = null ; 
    public static SpecifiedMKvId_PName = "SpecifiedMKvId" ; 
    get SpecifiedMKvId ():number|null { return this.specified_m_kv_id ; }
    set SpecifiedMKvId (v:number|null ){ this.specified_m_kv_id = v ; }

    /**
     * 防炎シールの要不要
     */    
    is_needed_labels_for_fire_prevention:boolean = false ; 
    public static IsNeededLabelsForFirePrevention_PName = "IsNeededLabelsForFirePrevention" ; 
    get IsNeededLabelsForFirePrevention ():boolean { return this.is_needed_labels_for_fire_prevention ; }
    set IsNeededLabelsForFirePrevention (v:boolean ){ this.is_needed_labels_for_fire_prevention = v ; }



    //#endregion


    /**
     * 工程の追加
     */
    public addProcess(src:TProjectProductProcess){

        let loginUserId:number|null = null ;
        // @ts-ignore
        if ( !_.isNil(this._store )) loginUserId = this._store.loginMUser.id ; 


        const to:Partial<TProjectProductProcess> = {
            is_enabled              : false                     ,
            order_no                : src.order_no  + 1         ,
            m_branch_id             : src.m_branch_id ?? 0      ,
            m_process_category_id   : src.m_process_category_id ,
            m_process_category      : src.m_process_category    , 
            is_removable            : true   ,
            // predicted_work_hour     : 0 , 
            created_m_user_id       : loginUserId ?? 0,
        } ; 

        let isNotFinished = true ; 
        let cnt = 1 ; 
        while ( isNotFinished){
            const found = this.t_project_product_processes.find(x => x.order_no == to.order_no) ; 
            if ( found !== undefined){
                if ( _.isNil(to.order_no) ) to.order_no = 0 ; 
                 to.order_no ++ ; 
                 cnt ++ ; 
            }
            else {
                isNotFinished = false ; 
            }
        }
        
        const parsed = TProjectProductProcess.parse(to ,this ) ;
        // if ( TProjectProductProcessPredicted.is(parsed)){
            // parsed.predicted_work_hour = 0 ; 
        // }
        
        const idx = this.t_project_product_processes.indexOf(src) ; 
        this.t_project_product_processes.splice(idx + cnt , 0 , parsed )  ; 
        //console.log(this.dValue.t_project_product_processes)  ; 


    }

    /**
     * 工程の削除
     * @param process 
     */
    public deleteProcess(process:TProjectProductProcess){
        const idx = this.t_project_product_processes.indexOf(process) ;
        if ( _.isNil( process.id) ){            
            this.t_project_product_processes.splice(idx , 1) ; 
        }
        else { 
            this.t_project_product_processes[idx].deleted_at = new Date() ; 
        }
    }

    public static parse(obj:Partial<TProjectProduct>){
        const row = new TProjectProduct(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);

        if ( row.t_project !== undefined ) { 
            row.t_project = TProject.parse(row.t_project) ; 
        }

        const parsedProcesses = row.t_project_product_processes.map(x => TProjectProductProcess.parse(x ,row)) ; 
        ArrayUtil.resetInsert(row.t_project_product_processes , parsedProcesses) ; 
        
        row.UpdateMainMaterial() ; 

        // Separetes
        const parsedSeparates = row.t_project_product_separates.map(x => TProjectProductSeparate.parse(x)) ; 
        ArrayUtil.resetInsert(row.t_project_product_separates , parsedSeparates) ; 
        
        // BoardLayouts
        const parsedBoardLayouts = row.t_project_product_boardlayouts.map(x => TProjectProductBoardLayout.parse(x)) ; 
        ArrayUtil.resetInsert(row.t_project_product_boardlayouts , parsedBoardLayouts) ; 
        

        return row ; 
    }

    public static is(arg:any):arg is TProjectProduct { 
        if ( arg?.IsTProjectProduct === undefined) return false ; 
        return arg.IsTProjectProduct ; 
    } 


    

}


/**
 * レイアウトシミュレーション用　材料
 */
 export type TypeMaterialSheets4Simulation = { 
    // W
    w   :number , 
    // Loss込 幅 W
    wIncLoss   :number , 
    // H
    h   :number , 
    // Loss込の高さ
    hIncLoss    :number  ,
    // コスト
    cost        : number  ,

}


/**
 * レイアウトシミュレーション用　材料
 */
 export type TypeSeparatedRect = { 
    // W
    w   :number , 
    // H
    h   :number , 

    tPosX : number ,
    tPosY : number ,
    // fontSize : number , 
}


