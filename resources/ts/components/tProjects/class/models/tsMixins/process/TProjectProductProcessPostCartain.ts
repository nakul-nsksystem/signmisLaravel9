import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import MMatrixConst from "../../../../../../consts/MMatrixConst";
import MastersUtil from "../../../../../../frameworks/MastersUtil";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../../../frameworks/ObjectUtil";
import StringUtil from "../../../../../../frameworks/StringUtil";
import { TypeSize, TypeSizeQty } from "../../../../../../types/TypeSize";
import { MKv } from "../../../../../masters/class/models/MKv";
import { MMaterial } from "../../../../../masters/class/models/MMaterial";
import { MMaterialDetail } from "../../../../../masters/class/models/MMaterialDetail";
import {  PostCartainColumnNames, PostCartainColumnTemplates, PostCartainEdgeColumnDefs, PostCartainEdges, PostCartainGetterNames, PostCartainNumOfSides } from "../../../../tProducts/tProductProcesses/consts/PostCartainDefs";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessPostCartain {
    

    // 型判別用
    get IsTProjectProductProcessPostCartain():boolean{
        return true ; 
    }


    /**
     * 両面テープのカテゴリMkvId
     */
    get SubCatDoubleSideTapeMKvId():number {
        return MKvsConst.MMaterials.SubCategory.DOUBLE_SIDE_TAPE  ; 
    } 




    //#region  辺

    /*****************************************
     * 辺
     *****************************************/

    /**
     * 四方
     */
    is_all:boolean = false ; 
    get IsAll ():boolean { return this.is_all; }
    set IsAll (v:boolean ){ 
        this.is_all = v ; 
    
        if ( v ){
            this.IsLr = false ; 
            this.IsTb = false ;
            this.is_t = false ; 
            this.is_b = false ; 
            this.is_l = false ; 
            this.is_r = false ; 
        }
            

    }

    /**
     * 上下
     */
    is_tb:boolean = false ; 
    get IsTb ():boolean { return this.is_tb; }
    set IsTb (v:boolean ){ 
        this.is_tb = v ;         
        if ( v ){
            this.is_t = false ; 
            this.is_b = false ; 
        }
        
    }
 
    /**
     * 左右
     */
    is_lr:boolean = false ; 
    get IsLr ():boolean { return this.is_lr; }
    set IsLr (v:boolean ){ 
        this.is_lr = v ; 
        if ( v ){
            this.is_l = false ; 
            this.is_r = false ; 
        }
    }
    
    /**
     * 上
     */
    is_t:boolean = false ; 
    get IsT ():boolean { return this.is_t ; }
    set IsT (v:boolean ){ this.is_t = v ; }

    /**
     * 下
     */
    is_b:boolean = false ; 
    get IsB ():boolean { return this.is_b ; }
    set IsB (v:boolean ){ this.is_b = v ; }
 
    /**
     * 左
     */
    is_l:boolean = false ; 
    get IsL ():boolean { return this.is_l ; }
    set IsL (v:boolean ){ this.is_l = v ; }
    
    /**
     * 右
     */
    is_r:boolean = false ; 
    get IsR ():boolean { return this.is_r ; }
    set IsR (v:boolean ){ this.is_r = v ; }
     
    //#endregion


    /**
     * 各辺の長さ取得
     */
    get Lengths():TypeKeyValuePostCartainEdgeValue|undefined { 
        
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct) ){
            return {                
                [PostCartainEdges.All]    : (this.TProjectProduct.size_w + this.TProjectProduct.size_h ) * 2 , 
                [PostCartainEdges.Tb]     : this.TProjectProduct.size_w * 2 , 
                [PostCartainEdges.Lr]     : this.TProjectProduct.size_h * 2 , 
                [PostCartainEdges.T]      : this.TProjectProduct.size_w     , 
                [PostCartainEdges.B]      : this.TProjectProduct.size_w     , 
                [PostCartainEdges.L]      : this.TProjectProduct.size_h     , 
                [PostCartainEdges.R]      : this.TProjectProduct.size_h     , 
                
            }            
        }

        return undefined ; 
            
    }

    /**
     * 各辺の選択状態
     */
    get IsSelecteds():TypeKeyValuePostCartainEdgeIsSelected {
        return { 
            [PostCartainEdges.All]      : this.is_all , 
            [PostCartainEdges.Tb]     : this.is_tb  , 
            [PostCartainEdges.Lr]     : this.is_lr  , 
            [PostCartainEdges.T]      : this.is_t   , 
            [PostCartainEdges.B]      : this.is_b   , 
            [PostCartainEdges.L]      : this.is_l   , 
            [PostCartainEdges.R]      : this.is_r   , 
        }

    }

    //#region ハトメ補強
    /*****************************************
     * ハトメ補強
     *****************************************/

    /**
     * ハトメ補強 有無
     */
    get IsStrongGrommets():boolean {
        return NumberUtil.invalid2zr(this.NumOfStrongGrommets) > 0 ; 
    } 

    /**
     * ハトメ補強箇所数
     */
    n_79:number = 0 ; 
    get NumOfStrongGrommets ():number { return this.n_79; }
    set NumOfStrongGrommets (v:number ){ this.n_79 = v ; }
    
    //#endregion

    //#region 綿テープ
    /*****************************************
     * 綿テープ
     *****************************************/

    /**
     * 綿テープの長さ
     */
    get TotalCottonTapeLength():number { 
        if ( this.Lengths === undefined) return 0 ; 

        let length = NumberUtil.invalid2zr(this.getSumValue(this.Lengths  , PostCartainColumnNames.IsCottonTape )) ;         
        length = NumberUtil.ceil(length * 0.001 ,3 )  ;
        //this.m$setValue(this.cTotalCottonTapeLengthCName , length ) ;                  
        return length ; 

    }

    //#endregion

    //#region ロープ関係
    /*****************************************
     * ロープ関係
     *****************************************/ 

    /**
     * 取り付け用 ロープだしロープのサブカテゴリMkvId
     */
    get SubCatRope4RopeOutMKvId():number {
        return MKvsConst.MMaterials.SubCategory.ROPE4ROPE_OUT  ; 
    } 

    /**
     * 取り付け用ロープ 有無
     */
    get IsRope4ropeOut():boolean {
        return NumberUtil.invalid2zr(this.Rope4ropeOutMMaterialId) !== 0 ; 
        // return NumberUtil.invalid2zr(this.NumOfStrongGrommets) > 0 ; 
    } 

    /**
     * 取り付け用ロープ　資材ID
     */
    m_material_id_22:number = 0 ; 
    get Rope4ropeOutMMaterialId ():number { return this.m_material_id_22; }
    set Rope4ropeOutMMaterialId (v:number ){ this.m_material_id_22 = v ; }

    /**
     * 取り付け用ロープ　資材
     */
    tmp_Rope4ropeOutMaterial?:MMaterial = undefined ; 
    get Rope4ropeOutMaterial ():MMaterial|undefined { return this.tmp_Rope4ropeOutMaterial; }
    set Rope4ropeOutMaterial (v:MMaterial|undefined ){ this.tmp_Rope4ropeOutMaterial = v ; }
    
    /**
     * 取り付け用ロープ　資材名
     */
    get Rope4ropeOutMaterialName():string {
        return MastersUtil.getMaterialName(this.tmp_Rope4ropeOutMaterial) ; 
    }

    /**
     * 取り付け用ロープ　単価
     */
    get Rope4ropeOutCost():number{         
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){   
            const detail = MMaterial.getHighestCostMaterial(this.tmp_Rope4ropeOutMaterial) ; 
            if ( detail !== undefined ) {
                val = detail.cost_price ;     
            }
        }
        return val ;
    }

    
    /**
     * 取り付け用ロープ　本数/枚
     */
    n_70:number = 0 ; 
    get NumOfRopes4rope ():number { return this.n_70; }
    set NumOfRopes4rope (v:number ){ this.n_70 = v ; }
    
    /**
     * 取り付け用ロープ　長さ
     */
    n_71:number = 0 ; 
    get Rope4ropeOutLength ():number { return this.n_71; }
    set Rope4ropeOutLength (v:number ){ this.n_71 = v ; }
     
    /**
     * 取り付け用ロープ　長さ メートル
     */
    get Rope4ropeOutMaterLength ():number { 
        const val = NumberUtil.ceil(NumberUtil.invalid2zr(this.Rope4ropeOutLength * 0.001) ,3) ; 
        return val ; 
    }

    /**
     * 取り付け用ロープ　長さ　メモ
     */
    s_08:string = ""; 
    get Rope4ropeMemo ():string { return this.s_08; }
    set Rope4ropeMemo (v:string ){ this.s_08 = v ; }

    /**
     * ロープカット作業の回数
     */
    get NumOfRopeCut():number {            
        let numOfSides = NumberUtil.invalid2zr(
            this.getSumValue(PostCartainNumOfSides  ,PostCartainGetterNames.IsRope )) ; 
        
        // const ropeOutLength = NumberUtil.invalid2zr(this.cRope4ropeOutLength ) ;             
        const val = NumberUtil.invalid2zr(this.NumOfRopes4rope) + numOfSides ; 
        return val ;  
        
    } 
    
    /**
     * ロープカット作業の有無
     */
    get IsRopeCut ():boolean { 
        
        const ropeOutLength = NumberUtil.invalid2zr(this.Rope4ropeOutLength ) ;             
        const val = ropeOutLength > 0 || this.NumOfRopeCut > 0 ; 

        return val ;  
    }
    
    /**
     * ロープだし用ロープ長さ
     */
    get TotalRopeLength():number { 
        const ropeLengthCName = PostCartainColumnNames.RopeLength ; 

        const vals:TypeKeyValuePostCartainEdgeValue = {
            [PostCartainEdges.All]    : this.getColNumValue(PostCartainEdges.All   ,ropeLengthCName) , 
            [PostCartainEdges.Tb]     : this.getColNumValue(PostCartainEdges.Tb    ,ropeLengthCName) , 
            [PostCartainEdges.Lr]     : this.getColNumValue(PostCartainEdges.Lr    ,ropeLengthCName) , 
            [PostCartainEdges.T]      : this.getColNumValue(PostCartainEdges.T     ,ropeLengthCName) , 
            [PostCartainEdges.B]      : this.getColNumValue(PostCartainEdges.B     ,ropeLengthCName) , 
            [PostCartainEdges.L]      : this.getColNumValue(PostCartainEdges.L     ,ropeLengthCName) , 
            [PostCartainEdges.R]      : this.getColNumValue(PostCartainEdges.R     ,ropeLengthCName) , 
            
        }

        let length = NumberUtil.invalid2zr(this.getSumValue(vals )) ; 
        length = NumberUtil.ceil(length * 0.001 ,3 )  ;
            
        return length ; 
    }

    //#endregion
 

    //#region ころしウェルダー加工

    /**
     * 総ころしウェルダー加工 mm数 ( 長さ関係なく　袋の端に1回あてる)
     */
    get TotalLengthOfWelderForSide():number { 
        const lengthOfWelderForSideCName = PostCartainGetterNames.LengthOfWelderForSide ; 
            // console.log("lengthOfWelderForSideCName:" + lengthOfWelderForSideCName) ; 
            const vals = {
                [PostCartainEdges.All]    : this.getColNumValue(PostCartainEdges.All   ,lengthOfWelderForSideCName) , 
                [PostCartainEdges.Tb]     : this.getColNumValue(PostCartainEdges.Tb    ,lengthOfWelderForSideCName) , 
                [PostCartainEdges.Lr]     : this.getColNumValue(PostCartainEdges.Lr    ,lengthOfWelderForSideCName) , 
                [PostCartainEdges.T]      : this.getColNumValue(PostCartainEdges.T     ,lengthOfWelderForSideCName) , 
                [PostCartainEdges.B]      : this.getColNumValue(PostCartainEdges.B     ,lengthOfWelderForSideCName) , 
                [PostCartainEdges.L]      : this.getColNumValue(PostCartainEdges.L     ,lengthOfWelderForSideCName) , 
                [PostCartainEdges.R]      : this.getColNumValue(PostCartainEdges.R     ,lengthOfWelderForSideCName) , 
            }
            // console.log(vals) ; 
            let length = NumberUtil.invalid2zr(this.getSumValue(vals )) ; 
            
            return length ; 
    }


    //#endregion

    //#region 風抜き

    /*****************************************
     * 風抜き
     *****************************************/

    /**
     * 風抜き有無
     */
    get IsWindAvoid():boolean { 
        let val = NumberUtil.invalid2zr(this.WindAvoidTotalMaterLength) > 0 ; 
        return val ; 
    }

    /**
     * 風抜き箇所数
     */
    n_72:number = 0 ; 
    get NumOfWindAvoid ():number { return this.n_72; }
    set NumOfWindAvoid (v:number ){ this.n_72 = v ; }
    
    /**
     * 風抜きmm数/箇所
     */
    n_73:number = 0 ; 
    get WindAvoidLength ():number { return this.n_73; }
    set WindAvoidLength (v:number ){ this.n_73 = v ; }

    /**
     * 風抜き端延長mm
     */
    get WindAvoidExtendLength():number { 
        let val = 0 ; 
        if (! TProjectProductProcess.is(this)) return val ; 

        if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
            // Mtx 風抜きの延長長さ
            // @ts-ignore 
            const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_POST_CARTAIN_WIND_AVOID_EXNTEND ,"") ; 
            val = Number(mtxRes.val1) ; 
            
        }
        return val ;  
    }

    /**
     * 風抜きm数/枚
     */
    get WindAvoidTotalMaterLength():number { 
       
        const numOfWindAvoid = NumberUtil.invalid2zr(this.NumOfWindAvoid) ;         
        let val = NumberUtil.invalid2zr(this.WindAvoidLength) 
                * numOfWindAvoid ; 
        
        if ( val > 0 ) val += this.WindAvoidExtendLength * numOfWindAvoid; 
        val = NumberUtil.ceil(val * 0.001 , 3) ; 
        

        return val ;  
    }

    //#endregion


    //#region あおり止め

    /*****************************************
     * あおり止め
     *****************************************/

    
    /**
     * あおり止め有無
     */
     get IsStopTilting():boolean { 
        let val = NumberUtil.invalid2zr(this.StopTiltingWayMKvId) > 0 ; 
        return val ; 
    }

    /**
     * あおり止め方法
     */
    m_kv_id_41:number = 0 ; 
    get StopTiltingWayMKvId ():number { return this.m_kv_id_41; }
    set StopTiltingWayMKvId (v:number ){ this.m_kv_id_41 = v ; }

    /**
     * あおり止め長さ/箇所
     */
    n_74:number = 0 ; 
    get StopTiltingLength ():number { return this.n_74; }
    set StopTiltingLength (v:number ){ this.n_74 = v ; }

    /**
     * あおり止め箇所数
     */
    n_75:number = 0 ; 
    get NumOfStopTilting ():number { return this.n_75; }
    set NumOfStopTilting (v:number ){ this.n_75 = v ; }
 
    /**
     * あおり止め総長さ(メートル)
     */
    get StopTiltingTotalMaterLength():number {         
        const len = NumberUtil.invalid2zr(this.StopTiltingLength) ; 
        const num = NumberUtil.invalid2zr(this.NumOfStopTilting) ; 

        let val = NumberUtil.round(len * num * 0.001 , 3 ) ;
        return val ;  
    }


    /**
     * あおり止め計算箇所数
     * 基準長さ単位で何箇所あるか
     */    
    get CalcedNumOfStopTilting():number {         
        let val = 0 ; 
        if (! TProjectProductProcess.is(this)) return val ; 

        if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
            // Mtx あおり止め基準長さ（基準長さ単位で最低とする)
            // @ts-ignore 
            const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_POST_CARTAIN_STOP_TILTING_BASE_LENGTH ,"") ; 
                
            if ( mtxRes.val1 !== undefined ) {                
                const baseLength = Number(mtxRes.val1) ; 
                const len = NumberUtil.invalid2zr(this.StopTiltingLength) ;                 
                const numOfStopByLen = NumberUtil.ceil(len / baseLength )  ; 

                const num = NumberUtil.invalid2zr(this.NumOfStopTilting) ;                 
                val = NumberUtil.ceil(numOfStopByLen * num) ; 
            }            
        }

        return val ;  
    }

    //#endregion


    //#region パイプ
    
    /*****************************************
     * パイプ
     *****************************************/

    /**
     * パイプのサブカテゴリMkvId
     */
     get SubCatPipeMKvId():number {
        return MKvsConst.MMaterials.SubCategory.PIPE  ; 
    } 

    /**
     * パイプ　有無
     */
    get IsPipe():boolean { 
        const val = NumberUtil.invalid2zr(this.PipeMMatarialId) !== 0  ; 
        return val ; 
    }

    /**
     * パイプ　資材ID 
     */
    m_material_id_23:number = 0 ;     
    get PipeMMatarialId ():number { return this.m_material_id_23; }
    set PipeMMatarialId (v:number ){ this.m_material_id_23 = v ; }
 
    /**
     * パイプ 資材
     */
    tmp_PipeMMatarial?:MMaterial = undefined ; 
    get PipeMMatarial ():MMaterial|undefined { return this.tmp_PipeMMatarial; }
    set PipeMMatarial (v:MMaterial|undefined ){ 
        let isUpdateCrashLength = false ; 
        if ( NumberUtil.invalid2zr( this.PipeCrashLength) == 0){
            isUpdateCrashLength = true ; 
        }
        else { 
            if ( this.tmp_PipeMMatarial !== undefined && v === undefined  ) { 
                isUpdateCrashLength = true ; 
            }

            if ( this.tmp_PipeMMatarial !== undefined && v !== undefined  ) { 
                isUpdateCrashLength = true ; 
            }
        }
        
        this.tmp_PipeMMatarial = v ; 

        if ( isUpdateCrashLength){
            this.PipeCrashLength = this.CalcedPipeCrashLength ; 
        }


    }
    
    /***
     *  パイプ 資材 詳細
     */
    get PipeHighestCostMaterialDetail():MMaterialDetail|undefined{
        if (! TProjectProductProcess.is(this)) return undefined ; 

        const detail = MMaterial.getHighestCostMaterial(this.tmp_PipeMMatarial) ; 
        return detail ; 

    }


    /**
     * パイプ名
     */
    get PipeMaterialName():string {
        return MastersUtil.getMaterialName(this.tmp_PipeMMatarial) ; 
    }

    /**
     * パイプ　長さ
     */
    n_76:number = 0 ;     
    get PipeLength ():number { return this.n_76; }
    set PipeLength (v:number ){ this.n_76 = v ; }
    

    /**
     * パイプ　本数
     */
    n_77:number = 0 ;     
    get NumOfPipe ():number { return this.n_77; }
    set NumOfPipe (v:number ){ this.n_77 = v ; }
        
    
    /**
     * パイプ　潰し寸法
     */
    n_78:number = 0 ;     
    get PipeCrashLength ():number { return this.n_78; }
    set PipeCrashLength (v:number ){ this.n_78 = v ; }
         
    /**
     * パイプ　潰し寸法（計算値)
     */
    get CalcedPipeCrashLength():number { 
        let val = 0 ; 
        if ( this.PipeHighestCostMaterialDetail !== undefined){
            val = this.getCrashLength(this.PipeHighestCostMaterialDetail) ;
        }
        return val ;

    }
    
    /**
     * パイプ　潰し寸法の余白
     */
    get PipeCrashSpace():number { 
        let val = 0 ; 
        
        if (! TProjectProductProcess.is(this)) return val ; 

        if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
            // Mtx パイプ つぶし寸法あそび代
            // @ts-ignore 
            const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_POST_CARTAIN_PIPE_CRASH_SPACE ,"") ; 
            val = Number(mtxRes.val1) ; 
        }

        return val ; 
 
    }


    /**
     * パイプ　選択パイプの長さ
     */
     get PipeMaterialLength():number { 
        let val = 0 ; 
        if ( this.PipeHighestCostMaterialDetail !== undefined){
            val = this.PipeHighestCostMaterialDetail.height ?? 0 ;
        }
        return val ; 
    }

    /**
     * パイプ　選択パイプの直径
     */ 
    get PipeMaterialDiameter():number { 
        let val = 0 ; 
        if ( this.PipeHighestCostMaterialDetail !== undefined){
            val = this.PipeHighestCostMaterialDetail.width ?? 0 ; 
        }
        return val ; 
    }

    
    /**
     * パイプ　選択パイプの単価
     */ 
    get PipeCost():number { 
        let val = 0 ; 
        if ( this.PipeHighestCostMaterialDetail !== undefined){
            val = this.PipeHighestCostMaterialDetail.cost_price ?? 0 ; 
        }
        return val ; 
    }

    /**
     * パイプ　選択パイプのメートル単価
     */ 
    get PipeCostPerMater():number { 
        let val = 0 ;            
        if ( this.PipeMaterialLength > 0 && this.PipeCost > 0 ){                
            const costPerMater = this.PipeCost / ( this.PipeMaterialLength * 0.001 ) ; 
            val = NumberUtil.round(costPerMater ,3 ) ; 
        }        
        return val ; 
    }


    /**
     * パイプ　選択パイプの端材単価
     */ 
    get PipeWasteCostPerMater():number { 

        let val = 0 ; 
        if ( this.PipeMaterialLength > 0 && this.PipeCost > 0 ){
                
            if (! TProjectProductProcess.is(this)) return val ; 

            if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
                // Mtx パイプ 端材コスト％
                // @ts-ignore 
                const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_POST_CARTAIN_PIPE_WASTE_COST_PER ,"") ; 
                val = NumberUtil.ceil (this.PipeCostPerMater * mtxRes.val1 ,3 )  ;
            }

        }        
        return val ; 
    }

    /**
     * パイプ　端材長さ
     */
    get PipeWasteLength():number{
        let val = 0 ;  
        val = NumberUtil.invalid2zr(
            this.PipeMaterialLength - 
            (this.PipeLength % this.PipeMaterialLength ))  ; 
        return val ; 
    }

    /**
     * パイプ　端材長さ割合
     */
    get PipeWasteLengthPer():number{
        let val = NumberUtil.invalid2zr(
            this.PipeWasteLength /  this.PipeMaterialLength )  ; 
        return val ; 
    }

    /**
     * パイプ　端材価格扱い判定ボーダー割合( xx % 以上余ってれば端材扱い )
     */
    get PipeWasteTargetPer():number{
        let val = 0 ; 

        if (! TProjectProductProcess.is(this)) return val ; 

        if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
            // Mtx - パイプ 端材扱い％
            // @ts-ignore 
            const mtxRes = this.Store.masters.getMtx(
                this.m_branch_id ,MMatrixConst.C_POST_CARTAIN_PIPE_WASTE_CONDITION_PER ,"") ; 
            val = Number(mtxRes.val1) ;
        }
        return val ; 
    }

    /**
     * パイプ　端材価格扱い判定結果
     */
    get IsPipeWasteTarget():boolean {         
        let val = this.PipeWasteLengthPer >= this.PipeWasteTargetPer ; 
        return val ; 
    }

    /**
     * パイプ　必要本数/長さあたり
     */
    get NumOfPipeNeededPerLength():number{
        const len = NumberUtil.invalid2zr(this.PipeLength ) ; 
        if ( len == 0  || this.PipeMaterialLength == 0 ) return 0 ; 

        const num = NumberUtil.ceil( len / this.PipeMaterialLength  ) ; 
        return num ; 
    }

    /**
     * パイプ　総必要本数
     */
    get TotalNumOfPipe():number { 
        let val = NumberUtil.invalid2zr(this.NumOfPipeNeededPerLength * this.NumOfPipe) ;         
        return val ; 
    }

    /**
     * パイプ　総使用扱いm数
     */
    get PipeTotalMaterLength():number{
        let val = 0 ; 
        if ( this.IsPipeWasteTarget ){
            // 端材対象
            val = NumberUtil.round(this.PipeLength * this.NumOfPipe * 0.001 , 3 ) ; 
        }
        else
        {
            // 端材扱いせず１本分コストとしてみる
            val = NumberUtil.round(this.TotalNumOfPipe * this.PipeMaterialLength * 0.001 ,3 ) ; 
        }
        return val ; 
    }

    /**
     * パイプ　総端材扱いm数
     */
    get PipeTotalWasteMaterLength():number { 
        let val = 0 ; 
        if ( this.IsPipeWasteTarget ){
            // 端材対象
            val = NumberUtil.round(this.NumOfPipe * this.PipeWasteLength * 0.001 ,3) ; 
        }
        return val ; 
    }

    /**
     * パイプ　ジョイント回数
     */
    get NumOfPipeJoint():number { 
        if ( this.NumOfPipeNeededPerLength < 2 ) return 0 ;
        return this.NumOfPipeNeededPerLength - 1 ; 
    }

    /**
     * パイプ　ジョイント総回数
     */
    get PipeTotalNumOfJoint():number { 
        let val = NumberUtil.invalid2zr(this.NumOfPipeJoint * this.NumOfPipe) ;         
        return val ; 
    }

    /**
     * パイプ　カット回数
     */
    get PipeNumOfCut():number{
        const len = NumberUtil.invalid2zr(this.PipeLength ) ; 
        if ( len == 0  || this.PipeMaterialLength == 0 ) return 0 ; 

        const mod = NumberUtil.round( len % this.PipeMaterialLength  ) ; 
        return mod > 0 ? 1 : 0 ; 
    }

    /**
     * パイプ　カット総回数
     */
    get PipeTotalNumOfCut():number {
        let val = NumberUtil.invalid2zr(this.PipeNumOfCut * this.NumOfPipe) ; 
        return val ; 
    }








    

    //#endregion
    
    //#region  各辺のプロパティ




    //#region ハトメ

    
    /**
     * ハトメ　資材端からの標準マージン
     */ 
     get GrommetMargin():number { 
        let val = 0 ; 
               
        if (! TProjectProductProcess.is(this)) return val ; 

        if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
            // Mtx ハトメ　資材端からの標準マージン
            // @ts-ignore 
            const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_POST_CARTAIN_GROMMET_MARGIN ,"") ;             
            val = Number(mtxRes.val1)  ;
        }        
        return val ; 
    }


    //#endregion

    //#endregion

    /**
     * カラム名を取得
     * @param pt 
     * @param col 
     * @returns 
     */
    public getColName(pt:PostCartainEdges , col:string):string|undefined { 
        // @ts-ignore
        if ( PostCartainEdgeColumnDefs[pt] === undefined || PostCartainEdgeColumnDefs[pt][col] === undefined ){
            // @ts-ignore
            const getterName = PostCartainGetterNames[col] ; 
            if ( getterName !== undefined){
                const ptGetterName = `${getterName}_${pt}`
                // console.log(ptGetterName) ; 
                return ptGetterName ; 
            }
            else { 
                return undefined ; 
            }

            // if ( col == "LengthOfWelderForSide"){
            //     LengthOfWelderForSide
            // }
    
        }
        
        // @ts-ignore
        const cName:string = PostCartainEdgeColumnDefs[pt][col] ; 

        return cName ; 

    }

    /**
     * カラムから値取得
     * @param pt 辺
     * @param col ベースカラム名
     * @returns 
     */
    public getColValue(pt:PostCartainEdges , col:string){
        
        const cName = this.getColName(pt ,col) ; 
        if ( cName === undefined ) return undefined ; 

        // @ts-ignore
        const val = this[cName] ; 
        // console.log(`  CName:${cName} val:${val}`) ; 
        return val ; 
    }

    /**
     * カラムから数値取得
     * @param pt 辺
     * @param col ベースカラム名
     * @returns 
     */
    public getColNumValue(pt:PostCartainEdges , col:PostCartainColumnNames|PostCartainGetterNames):number {

        const val = this.getColValue(pt ,col)  ; 
        if ( val === undefined )  return 0 ; 

        return val ; 
    }

    /***
     * 各辺の合計値取得
     * 
     * vals : 各辺の加算値
     * isCName : 有効かどうかの判定フラグ
     */
    public getSumValue(vals:TypeKeyValuePostCartainEdgeValue ,isCName:string = "" ) {

        
        let val = 0 ; 
        // 四方
        if ( this.IsAll ){
            // @ts-ignore
            //console.log(`cName:${isCName}  colVal:${this.getColValue(PostCartainEdges.ALL ,isCName)}`) ; 
            if ( isCName == "" || 
                (this.getColValue(PostCartainEdges.All ,isCName))){
                    //console.log(`val:${vals[PostCartainEdges.ALL]}`) ; 
                    val += vals[PostCartainEdges.All]  ;
                }
        }
        else {
            
            // 上下
            if ( this.IsTb ){

                if ( isCName == "" || this.getColValue(PostCartainEdges.Tb ,isCName)){
                    val += vals[PostCartainEdges.Tb]  ;
                }
            }
            else {
                // 上
                if ( this.IsT ){
                    if ( isCName == "" || this.getColValue(PostCartainEdges.T ,isCName) ){
                        val += vals[PostCartainEdges.T]  ;
                    }
                }
                // 下
                if ( this.IsB ){
                    if ( isCName == "" || this.getColValue(PostCartainEdges.B ,isCName) ){
                        val += vals[PostCartainEdges.B]  ; 
                    }
                }
            }

            // 左右
            if ( this.IsLr ){
                if ( isCName == "" || this.getColValue(PostCartainEdges.Lr ,isCName) ){
                    val += vals[PostCartainEdges.Lr]  ;  
                }                   
            }
            else {
                // 左
                if ( this.IsL ){                    
                    if ( isCName == "" || this.getColValue(PostCartainEdges.L ,isCName)){
                        val += vals[PostCartainEdges.L]  ;  
                    }  
                }
                // 右
                if ( this.IsR ){
                    if ( isCName == "" || this.getColValue(PostCartainEdges.R ,isCName)){
                        val += vals[PostCartainEdges.R]  ;  
                    }  
                    
                }                    
            }
        }            
        return val ; 
    } 

    
    /**
     * パイプの潰し計算値取得
     * @param detail 
     * @returns 
     */
    public getCrashLength(detail:MMaterialDetail ):number {
        let val = 0 ; 
        if ( detail !== undefined){
            const pipeDiameter = NumberUtil.invalid2zr(detail.width ) ;                 
            const half = NumberUtil.invalid2zr((pipeDiameter * Math.PI ) / 2) ; 

            if ( half != 0 ){
                val =  NumberUtil.ceil( this.PipeCrashSpace + half , 2) ; 
            }
        }

        return val ; 
    } 

    /**
     * 辺のタイプのMKv
     * @param edgeKey 辺
     * @returns 
     */
    protected getTypeMKv(edgeKey:string):MKv|undefined {
        let val = undefined ; 
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.Store)){
            // @ts-ignore
            val = this.Store.masters.getMKvById(this[`${PostCartainColumnNames.TypeMKvId}_${edgeKey}`]) ;             
        }

        return val ; 
    }


    /**
     * 辺の仕上げのMKv
     * @param edgeKey 辺
     * @returns 
     */
     protected getFinishWayMKv(edgeKey:string):MKv|undefined {
        let val = undefined ; 
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.Store)){
            // @ts-ignore
            val = this.Store.masters.getMKvById(this[`${PostCartainColumnNames.FinishWayMKvId}_${edgeKey}`]) ;             
        }

        //let isGrommet = false ; 
        let isMagicTape = false ; 
        let isSilliconRubber = false ; 

        if (MKv.is(val)){
            //isGrommet        = val.g_01 == "1" ; 
            isMagicTape      = val.g_02 == "1" ; 
            isSilliconRubber = val.g_03 == "1" ;
        }
        // console.log("isGrommet : " + isGrommet) ; 
        // ハトメ
        // @ts-ignore
        //this[`${PostCartainColumnNames.IsGrommet}_${edgeKey}`] = isGrommet ; 
        // マジックテープ
        // @ts-ignore
        this[`${PostCartainColumnNames.IsMagicTape}_${edgeKey}`] = isMagicTape ; 

        // シリコンゴム
        // @ts-ignore
        this[`${PostCartainColumnNames.IsSilliconRubber}_${edgeKey}`] = isSilliconRubber ; 

        return val ; 
    }

    /**
     * 各辺ごとのプロパティ生成 
     */
    public generateEdgeProperties(){
        // 各辺のプロパティを動的生成
        for ( const edge in PostCartainEdges){
            const edgeKey:PostCartainEdges = edge as PostCartainEdges ;             
            // console.log(`${edgeKey}`) ; 

            // @ts-ignore
            // this[`_tmp_grommetMMaterial_03`]  = null ; 

            for ( const columnDef in PostCartainEdgeColumnDefs[edgeKey]){
                const columnDefKey:PostCartainColumnNames = columnDef as PostCartainColumnNames ;                 

                
                const colName:string = PostCartainEdgeColumnDefs[edgeKey][columnDefKey] ; 

                const tmpl = PostCartainColumnTemplates[columnDefKey] ;                     
                const defaultValue:any = tmpl.default ; 
                const isGetSet:boolean = tmpl.isGetSet ; 

                
                // 値プロパティ
                if ( isGetSet) { 

                    // console.log(` ${columnDef} - col:${colName} default:${defaultValue} `) ;  
                    if (colName in this){
                        // console.log("already have")
                    }
                    else { 
                        // Object.defineProperties(this, {
                        //     [colName]: {
                        //         value: defaultValue,
                        //         writable: true
                        //     },                    
                        // });    

                        // @ts-ignore
                        this[colName] = defaultValue ; 
                        // console.log(` ${columnDef} - col:${colName} default:${defaultValue} `) ;  
                    }

                     const getSetPropName = `${columnDef}_${edgeKey}` ; 
                    //console.log(` ${columnDef} - col:${colName} default:${defaultValue} getset:${getSetPropName}`) ;  

                    // Get/Set                
                    Object.defineProperties(this, {
                        [getSetPropName]: {
                            get() {
                                // console.log(`get define   colName:${colName} val:${this[colName]}`) ; 
                                return this[colName];
                            } ,
                            set(v) {
                                // console.log(`set define   colName:${colName} val:${this[colName]}`) ; 
                                this[colName] = v ;
                            } ,
                        },                    
                    });
                }
            }

            // Getter

            // タイプMKv
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.TypeMKv}_${edgeKey}`]: {
                    get():MKv|undefined {
                        return this.getTypeMKv(edgeKey) ; 
                    } ,
                },                    
            });

            
            // 仕上げMKv
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.FinishWayMKv}_${edgeKey}`]: {
                    get():MKv|undefined {
                        return this.getFinishWayMKv(edgeKey) ; 
                    } ,
                },                    
            });



            // 対象の辺の長さ
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.SideLength}_${edgeKey}`]: {
                    get():number {
                        return this.Lengths[edgeKey] ; 
                    } ,
                },                    
            });

            
            // 対象の辺の長さメートル
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.SideMaterLength}_${edgeKey}`]: {
                    get():number {
                        let val = NumberUtil.invalid2zr(this.Lengths[edgeKey]) * 0.001  ; 
                        val = NumberUtil.round(val , 3) ;            
                        return val  ; 
                    } ,
                },                    
            });

            
            // 対象の辺の長さメートル
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.TypeMKvTargetMKvCategoryId}_${edgeKey}`]: {
                    get():number {
                        const typeMKv = this[`${PostCartainGetterNames.TypeMKv}_${edgeKey}`]
                        if ( typeMKv === undefined ) return 0 ; 
                        return typeMKv.target_m_kv_category_id ;
                        
                    } ,
                },                    
            });


            // Isロープ
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.IsRope}_${edgeKey}`]: {
                    get():boolean {
                        let rtn = false ;
                        if (  this.IsSelecteds[edgeKey]) {
                            const typeMKv = this[`${PostCartainGetterNames.TypeMKv}_${edgeKey}`] ; 
                            if ( typeMKv !== undefined ) {
                                rtn = typeMKv.g_02 == "1" ;
                            }
                        }

                        if ( !rtn ){
                            const ropeLengthName = this.getColName(edgeKey , PostCartainColumnNames.RopeLength ) ;
                            this[ropeLengthName] = 0 ; 
                        }                        
                        
                        return rtn; 
                    } ,
                },                    
            });

            // Is綿テープ
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.IsCottonTapeShow}_${edgeKey}`]: {
                    get():boolean {
                        let rtn = false ;
                        if (  this.IsSelecteds[edgeKey]) {
                            const typeMKv = this[`${PostCartainGetterNames.TypeMKv}_${edgeKey}`] ; 
                            if ( typeMKv !== undefined ) {
                                rtn = typeMKv.g_01 == "1" ;
                            }
                        }

                        if ( !rtn ){
                            this[`${PostCartainColumnNames.IsCottonTape}_${edgeKey}`] = rtn ; 
                        }
                        
                        return rtn; 
                    } ,
                },                    
            });
            
            

            //#region ハトメ
                        
            // Isハトメ 表示
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.IsGrommetShow}_${edgeKey}`]: {
                    get():boolean {
                        if ( ! this.IsSelecteds[edgeKey]) return false ; 

                        const finishWayMKv = this[`${PostCartainGetterNames.FinishWayMKv}_${edgeKey}`] ; 
                        if ( finishWayMKv === undefined ) return false ; 

                        return finishWayMKv.g_01 == "1" ; 
                    } ,
                },                    
            });

            
            // ハトメ 材料名
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.GrommetName}_${edgeKey}`]: {
                    get():string {
                        const cName = this.getColName(edgeKey , PostCartainColumnNames.GrommetMMaterial ) ;

                        const grommet = this[cName] ; 
                        return MastersUtil.getMaterialName(grommet) ;             
            
                    } ,
                },                    
            });

            
            // ハトメ 単価
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.GrommetPrice}_${edgeKey}`]: {
                    get():number {
                        const cName = this.getColName(edgeKey , PostCartainColumnNames.GrommetMMaterial ) ;

                        const found = this[cName] ; 
                        if ( found === undefined ) return 0 ; 

                        return MMaterial.getHighestCost(found)  ; 

                        
            
                    } ,
                },                    
            });

            // 指定がピッチである
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.IsGrommetSpecifyPitch}_${edgeKey}`]: {
                    get():boolean {
                        const isGrommet = this.getColValue(edgeKey , PostCartainColumnNames.IsGrommet ) ;
                        if (! isGrommet) return false ; 
                        
                        const mkvId = this.getColValue(edgeKey , PostCartainColumnNames.GrommetSpecifyMKvId ) ;
                        return mkvId ===  MKvsConst.TProjects.Process.PostCartain.GROMMET_SPECIFY_PITCH ;                         
            
                    } ,
                },                    
            });
            


            // 指定がピッチである
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.IsGrommetSpecifyQty}_${edgeKey}`]: {
                    get():boolean {
                        const isGrommet = this.getColValue(edgeKey , PostCartainColumnNames.IsGrommet ) ;
                        if (! isGrommet) return false ; 
                        
                        const mkvId = this.getColValue(edgeKey , PostCartainColumnNames.GrommetSpecifyMKvId ) ;
                        return mkvId ===  MKvsConst.TProjects.Process.PostCartain.GROMMET_SPECIFY_QTY ;                         
            
                    } ,
                },                    
            });

            
            // ハトメ角を除いたサイズ
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.GrommetValidSize}_${edgeKey}`]: {
                    get():TypeSize {

                        const rtn:TypeSize = { w :0 ,h:0 } 
                        const mgn = this.GrommetMargin ; 
                        const pitch = this.getColValue(edgeKey , PostCartainColumnNames.GrommetPitch ) ;

                        if (! TProjectProductProcess.is(this) || _.isNil(this.TProjectProduct) ) return rtn ;                         
                        if ( NumberUtil.invalid2zr(pitch) == 0 ) return rtn ; 
    
                        rtn.w = this.TProjectProduct.size_w  - (mgn * 2 ) ; 
                        rtn.h = this.TProjectProduct.size_h  - (mgn * 2 ) ; 
                        if ( rtn.w < 0 ) rtn.w = 0 ; 
                        if ( rtn.h < 0 ) rtn.h = 0 ; 
            
                        return rtn ; 
                    } ,
                },                    
            });


            // 計算後ハトメピッチ
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.CalcedGrommetPitch}_${edgeKey}`]: {
                    get():TypeSize {

                        const rtn = { w :0 ,h:0 } 
                        const qtyObj = this[`${PostCartainGetterNames.CalcedGrommetUsageQty}_${edgeKey}`] ; 
                        // const qtyObj = this.cCalcedGrommetUsageQty ; 
                        const validSize = this[`${PostCartainGetterNames.GrommetValidSize}_${edgeKey}`] ; 

                        if ( qtyObj.w != 0 ) {
                            rtn.w = NumberUtil.trunc(validSize.w / (qtyObj.w + 1) ,1 ) ;
                        }
                        if ( qtyObj.h != 0 ) {
                            rtn.h = NumberUtil.trunc(validSize.h / (qtyObj.h + 1) ,1 ) ;
                        }
                        
                        return rtn ;
                    } ,
                },                    
            });            
            
            // 角を除いたハトメ使用数( w , h あたり)
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.CalcedGrommetUsageQty}_${edgeKey}`]: {
                    get():TypeSizeQty {
                        const rtn:TypeSizeQty = { w :0 ,h:0 } 

                        const pitch = this.getColValue(edgeKey , PostCartainColumnNames.GrommetPitch ) ;
                        if ( NumberUtil.invalid2zr(pitch) == 0 ) return rtn ; 

                        const validSize = this[`${PostCartainGetterNames.GrommetValidSize}_${edgeKey}`] ; 

                        // 横方向
                        switch ( edgeKey ) {
                            case PostCartainEdges.All :
                            case PostCartainEdges.Tb  : 
                            case PostCartainEdges.T   : 
                            case PostCartainEdges.B   : 
                                rtn.w = NumberUtil.invalid2zr(NumberUtil.trunc(validSize.w / pitch)) ; 
                                break ; 

                        }

                        // 縦方向
                        switch ( edgeKey ) {
                            case PostCartainEdges.All :
                            case PostCartainEdges.Lr  : 
                            case PostCartainEdges.L   : 
                            case PostCartainEdges.R   : 
                                rtn.h = NumberUtil.invalid2zr(NumberUtil.trunc(validSize.h / pitch)) ; 
                                break ; 

                        }

                        return rtn ; 
                    } ,
                },                    
            });

            
            // ハトメ角使用個数
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.CornerGrommetUsageQty}_${edgeKey}`]: {
                    get():number {
                        

                        switch (edgeKey) {
                            case PostCartainEdges.All : 
                            // 上下優先
                            case PostCartainEdges.Tb  :
                                return 4 ; 
                            
                            case PostCartainEdges.T  :                    
                            case PostCartainEdges.B  :
                                return 2 ; 
            
                            // 左右
                            case PostCartainEdges.Lr  :
                            case PostCartainEdges.L   :
                            case PostCartainEdges.R   :
                                let num = 0 ; 
                                if ( this.IsSelecteds[PostCartainEdges.Tb] ||
                                     (this.IsSelecteds[PostCartainEdges.T] && this.IsSelecteds[PostCartainEdges.B]))
                                {
                                    // 上下選択されている
                                    num = 0 ;                         
                                } else {
                                    if(this.IsSelecteds[PostCartainEdges.T || this.IsSelecteds[PostCartainEdges.B]]){
                                        // 片方だけ選択
                                        num = 1 ; 
                                    }
                                    else
                                    {
                                        // 左右のみ
                                        num = 2 ; 
                                    }
                                    
                                }
                                return num * (this.pt == PostCartainEdges.Lr ? 2 : 1) ; 
                                
                        }


                    } ,
                },                    
            });

            
            
            // ハトメ使用個数
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.GrommetUsageQty}_${edgeKey}`]: {
                    get():number {
                        
                        const isGrommet = this.getColValue(edgeKey , PostCartainColumnNames.IsGrommet ) ;
                        if (! isGrommet) return 0 ; 

                        const isGrommetPitch = this[`${PostCartainGetterNames.IsGrommetSpecifyPitch}_${edgeKey}`]

                        let val = 0 ; 
                        if ( isGrommetPitch) {
                            // 指定ピッチ
            
                            // 角の使用数
                            val = this[`${PostCartainGetterNames.CornerGrommetUsageQty}_${edgeKey}`] ; 
            
                            // 角以外の使用数
                            const calcedGrommetUsageQty = this[`${PostCartainGetterNames.CalcedGrommetUsageQty}_${edgeKey}`]
                            let qtyWoCorner = calcedGrommetUsageQty.w + calcedGrommetUsageQty.h ; 
                            switch ( edgeKey ) {
                                case PostCartainEdges.All :
                                    qtyWoCorner *= 4 ; 
                                    break ; 
                                
                                case PostCartainEdges.Tb :
                                case PostCartainEdges.Lr :    
                                    qtyWoCorner *= 2 ; 
                                    break ; 
                                
                            }
                            val += qtyWoCorner ;
                        }
                        else
                        {
                            // 指定個数                            
                            val = NumberUtil.invalid2zr(this.getColValue(edgeKey , PostCartainColumnNames.GrommetUsageByInputQty )) ;
                        }
            
                        return val ;  

                    } ,
                },                    
            });

            //#endregion

            //#region マジックテープ


            // マジックテープ 材料名
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.MagicTapeName}_${edgeKey}`]: {
                    get():string {
                        const cName = this.getColName(edgeKey , PostCartainColumnNames.MagicTapeMMaterial ) ;

                        const material = this[cName] ; 
                        return MastersUtil.getMaterialName(material) ;             
            
                    } ,
                },                    
            });

            
            // マジックテープ 単価
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.MagicTapePrice}_${edgeKey}`]: {
                    get():number {
                        const cName = this.getColName(edgeKey , PostCartainColumnNames.MagicTapeMMaterial ) ;

                        const found = this[cName] ; 
                        if ( found === undefined ) return 0 ; 

                        return MMaterial.getHighestCost(found)  ; 

                        
            
                    } ,
                },                    
            });

            // マジックテープ 雄雌合計長さ
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.MagicTapeTotalLength}_${edgeKey}`]: {
                    get():number {
                        let val = NumberUtil.invalid2zr(this.getColValue(edgeKey , PostCartainColumnNames.MagicTapeLength ))  ; 

                        const magicTapeNeededMKvId = this.getColValue(edgeKey , PostCartainColumnNames.MagicTapeNeededMKvId ) ; 
                        if ( magicTapeNeededMKvId == MKvsConst.TProjects.Process.PostCartain.MAGIC_TAPE_BOTH_SIDE) {
                            val *= 2 ; 
                        }
            
                        // mに変更
                        val = NumberUtil.ceil(val * 0.001 ,3 ) ;             
            
                        return val ;  
            
                    } ,
                },                    
            });

            
            //#endregion

            //#region シリコンゴム

            // シリコンゴム 材料名
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.SilliconRubberName}_${edgeKey}`]: {
                    get():string {
                        const cName = this.getColName(edgeKey , PostCartainColumnNames.SilliconRubberMMaterial ) ;

                        const material = this[cName] ; 
                        return MastersUtil.getMaterialName(material) ;             
            
                    } ,
                },                    
            });

            
            // シリコンゴム 単価
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.SilliconRubberPrice}_${edgeKey}`]: {
                    get():number {
                        const cName = this.getColName(edgeKey , PostCartainColumnNames.SilliconRubberMMaterial ) ;

                        const found = this[cName] ; 
                        if ( found === undefined ) return 0 ; 

                        return MMaterial.getHighestCost(found)  ; 

                        
            
                    } ,
                },                    
            });

            //#endregion
            

            //#region その他

            // ミシン加工 有無
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.IsSewing}_${edgeKey}`]: {
                    get():boolean {

                        if ( ! this.IsSelecteds[edgeKey]) return false ; 

                        const finishWayMKv = this[`${PostCartainGetterNames.FinishWayMKv}_${edgeKey}`] ; 
                        if ( finishWayMKv === undefined ) return false ; 

                        return finishWayMKv.g_04 == "1" ; 
            
                    } ,
                },                    
            });


            // ウェルダー加工 有無
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.IsWelder}_${edgeKey}`]: {
                    get():boolean {

                        if ( ! this.IsSelecteds[edgeKey]) return false ; 

                        const finishWayMKv = this[`${PostCartainGetterNames.FinishWayMKv}_${edgeKey}`] ; 
                        if ( finishWayMKv === undefined ) return false ; 

                        return finishWayMKv.g_05 == "1" ; 
            
                    } ,
                },                    
            });            

            // ころしウェルダー加工 加工mm数
            Object.defineProperties(this, {
                [`${PostCartainGetterNames.LengthOfWelderForSide}_${edgeKey}`]: {
                    get():number {

                        let val = 0 ; 
                        const typeMKv = this[`${PostCartainGetterNames.TypeMKv}_${edgeKey}`] ; 
                        
                        if (this.IsSelecteds[edgeKey] && typeMKv !== undefined ) {
                            val = NumberUtil.invalid2zr(typeMKv.g_03 ); 
                            // console.log("val : " + val ) ; 
                            switch ( edgeKey ) {
                                case PostCartainEdges.All :
                                    val *= 4 ; 
                                    break ; 
                                case PostCartainEdges.Tb  : 
                                case PostCartainEdges.Lr  : 
                                    val *= 2 ; 
                                    break ; 
                                case PostCartainEdges.T   : 
                                case PostCartainEdges.B   : 
                                case PostCartainEdges.L   : 
                                case PostCartainEdges.R   : 
                                    val *= 1 ; 
                                    break ; 
            
                            }
                        }
                        // console.log("last val : " + val ) ; 
            
                        return val ; 
            
                    } ,
                },                    
            });            
            

            //#endregion


            
        }

    }

        
    public static Init(p:TProjectProductProcessPostCartain){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
            }        
        }

        p.generateEdgeProperties() ; 



    }
    
    public static is(arg:any):arg is TProjectProductProcessPostCartain { 
        if ( arg?.IsTProjectProductProcessPostCartain === undefined) return false ; 
        return arg.IsTProjectProductProcessPostCartain ; 
    } 
    

}


/**
 * Sum用
 */
type TypeKeyValuePostCartainEdgeValue = {
    [key in PostCartainEdges]: number;
};


/**
 * IsSelected用
 */
type TypeKeyValuePostCartainEdgeIsSelected = {
    [key in PostCartainEdges]: boolean;
};

