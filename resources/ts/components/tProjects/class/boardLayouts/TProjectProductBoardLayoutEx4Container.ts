import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { TypeSize } from "../../../../types/TypeSize";
import { MMaterialDetail } from "../../../masters/class/models/MMaterialDetail";
import { TProjectProductBoardLayout } from "../models/TProjectProductBoardLayout";
import { BoardAutoLayoutResult } from "../../../../frameworks/BoardLayout/autoLayout/models/BoardAutoLayoutResult";
import { BoardAutoLayoutResultSheet } from "../../../../frameworks/BoardLayout/autoLayout/models/BoardAutoLayoutResultSheet";
import { BoardLayoutContainerAbstract } from "./containers/BoardLayoutContainerAbstract"
import { BoardLayoutContainerManual } from "./containers/BoardLayoutContainerManual";

export class TProjectProductBoardLayoutEx4Container extends TProjectProductBoardLayout  { 


    protected _container:BoardLayoutContainerAbstract ; 

    constructor (container:BoardLayoutContainerAbstract ) { 
        super(container._manager.LoginUserId) ; 
        this._container = container ; 

    }

    toJSON () {
        const row = {} ; 
        
        // プロパティ値を取り直し( getter の中に値をセットしているものがあるため)
        const _this = this ; 
        ObjectUtil.getGetters(this).forEach(x => {
            // @ts-ignore
            _this[x] ; 
        }); 
        Object.assign(row , this) ; 
        // @ts-ignore
        delete row._container ; 
        return row ; 
    }
    


    get IsTProjectProductBoardLayoutEx4Container():boolean{
        return true ; 
    }

    /**
     * カット数指定 Autoで使用
     */
    num_of_cut:number = 0 ; 

    public static createFromBoardAutoLayoutResult(container:BoardLayoutContainerAbstract ,  v:BoardAutoLayoutResultSheet){
        const rtn = new TProjectProductBoardLayoutEx4Container(container) ; 
        
        rtn.num_of_cut = v.NumOfCut ; 
        rtn.is_auto = true ; 
        rtn.is_outsource_cut = container._manager.is_auto_outsource_cut ; 
        rtn.w = v.W ; 
        rtn.h = v.H ; 
        rtn.qty = v.Qty ;

        
        return rtn ; 

    }

    /**
     * 選択中のMMaterialDetail 
     */
    get MMaterialDetail():MMaterialDetail|undefined { 
        // return this.m_material_detail ?? undefined ; 
        if ( this._container._manager.MMaterialDetails === undefined ) return undefined ; 
        const found = this._container._manager.MMaterialDetails.find(x => x.id === this.m_material_detail_id) ; 
        return found ; 
    }

    /**
     * 有効サイズ内に収まるか
     */
    get IsValidSize():boolean{

        if ( BoardLayoutContainerManual.is(this._container)) return true ; 

        if ( NumberUtil.invalid2zr( this.w) === 0 || 
        NumberUtil.invalid2zr( this.h) === 0 ) return false  ; 
        
        if ( this.MMaterialDetail === undefined ) return false  ; 

        const orgMinLen = Math.min(this.MMaterialDetail.width , this.MMaterialDetail.height ) ; 
        const orgMaxLen = Math.max(this.MMaterialDetail.width , this.MMaterialDetail.height ) ; 

        const useMinLen = Math.min(this.w , this.h ) ; 
        const useMaxLen = Math.max(this.w , this.h ) ; 

        if (orgMinLen < useMinLen ) return false ; 
        if (orgMaxLen < useMaxLen ) return false ; 

        return true ;         
    }

    /**
     * 金額を取る寸法
     */
    get ValidSize():TypeSize{
        const val:TypeSize = {w:0 ,h:0 } ; 
        if ( this.MMaterialDetail === undefined ) return val ; 

        // 入らない
        if (! this.IsValidSize) return val ; 

        const orgMinLen = Math.min(this.MMaterialDetail.width , this.MMaterialDetail.height ) ; 
        const orgMaxLen = Math.max(this.MMaterialDetail.width , this.MMaterialDetail.height ) ; 

        
        const useMinLen = Math.min(this.w , this.h ) ; 
        const useMaxLen = Math.max(this.w , this.h ) ; 

        //console.log(`orgLen ${orgMinLen} x ${orgMaxLen}  use ${useMinLen} x ${useMaxLen}`) ; 
        if (orgMinLen >= useMaxLen ){
            // 指定寸法の長辺が指定規格の短辺に入る                
            val.w = orgMinLen ; 
            val.h = useMinLen ; 
        } 
        else {      
            // シート短辺側を全部取る場合
            const sqmForShorter = orgMinLen * useMaxLen ; 
            const sqmForLonger  = useMinLen * orgMaxLen ; 

            //  console.log(`1 ${orgMinLen} * ${useMaxLen} = ${sqmForShorter}`) ; 
            //  console.log(`2 ${useMinLen} * ${orgMaxLen} = ${sqmForLonger}`) ; 

            if ( sqmForShorter < sqmForLonger){
                val.w = orgMinLen ;           
                val.h = useMaxLen ; 

            }
            else {
                val.w = useMinLen ;           
                val.h = orgMaxLen ; 
                
            }

        }
        
        return val ;   
    }

    get ValidSqm():number { 
        const sqm = NumberUtil.invalid2zr(this.ValidSize.w * this.ValidSize.h * 0.001 * 0.001 ) ; 
        return NumberUtil.ceil(sqm  ,4 ) ;
    }

    /**
     * 規格サイズに対しての使用率
     */
    get UsePer():number { 
        const sqm = this.MMaterialDetail?.Sqm ?? 0 ;         
        if ( sqm === 0 ) return 0 ; 
        const val = NumberUtil.invalid2zr(this.ValidSqm / sqm) ; 
        return val ; 
    }

    /**
     * 選択中の材料規格 寸法文字列
     */
    get MMaterialDetailSize():string { 
        return `${this.MMaterialDetail?.width ?? 0} x ${this.MMaterialDetail?.height ?? 0}` ; 
    }
    

    /**
     * 選択中の材料規格SQM
     */
     get MMaterialDetailSqm():number { 
         const v = NumberUtil.ceil((this.MMaterialDetail?.width ?? 0) * (this.MMaterialDetail?.height ?? 0) * 0.001 * 0.001  ,3 ) ; 
        return v ; 
    }

    /**
     * 選択中の材料コスト
     */
    get MMaterialDetailPrice():number { 
        return this.MMaterialDetail?.cost_price ?? 0   ; 
    }



    /**
     * 材料コスト/枚
     */
    get MaterialCost():number{
        if ( this._container._manager.is_customer_provide ) return 0 ; 

        if ( BoardLayoutContainerManual.is(this._container)) return this.price ; 
        // console.log("MaterialConst " + this.IsValidSize) ; 
        if (! this.IsValidSize || NumberUtil.invalid2zr(this.qty) === 0 ) return 0 ;         
    
        // 一定以下の余りであれば1枚分
        let lossPer = 1 - this.UsePer  ; 
        let per = this._container._manager.WasteCostPer >= lossPer ? 1 : this.UsePer ; 
        
        return NumberUtil.ceil((this.MMaterialDetailPrice * per ) , 0 ) ; 
    }

    /**
     * 枚数を考慮した材料コスト
     */
    get TotalMaterialCost():number { 
        return this.MaterialCost * this.qty ; 
    }

    /**
     * カット回数
     */
    get NumOfCut():number { 
        if ( ! this.is_outsource_cut ) return 0 ; 

        if ( this.qty === 0 ) return 0 ; 
        // 自動
        if ( this.num_of_cut !== 0 ) return this.num_of_cut ; 

        if ( this.m_material_detail_id === undefined) return 0 ; 
        
        if ( this.MMaterialDetail === undefined ) return 0 ; 

        const matMinLen = Math.min(this.MMaterialDetail.width , this.MMaterialDetail.height ) ; 
        const matMaxLen = Math.max(this.MMaterialDetail.width , this.MMaterialDetail.height ) ; 

        const specMinLen = Math.min(this.w , this.h ) ; 
        const specMaxLen = Math.max(this.w , this.h ) ; 

        if ( matMinLen == specMinLen && matMaxLen == specMaxLen ) return 0 ; 

        if ( matMinLen == specMinLen || matMinLen == specMaxLen ||
            matMaxLen == specMinLen || matMaxLen == specMaxLen  ) return 1 ; 

        return 2 ;   
    }

    
    /**
     * 総カット数
     */
    get TotalNumOfCut():number {         
        const v = NumberUtil.invalid2zr( this.NumOfCut * this.qty ) ;
        //console.log("NumOfCut " + this.NumOfCut +" qty " + this.qty + " costPerCut " + _this.costPerCut ) ; 
        return v ; 
    }

    /**
     * 総カットコスト
     */
    get TotalCutCost():number { 
        if (! this.is_outsource_cut) return 0 ; 
        if ( this._container._manager.is_customer_provide ) return 0 ; 
        return NumberUtil.invalid2zr( this.TotalNumOfCut * this._container._manager.CostPerCut) ; 
    }

    /**
     * 総コスト
     */
    get TotalCost():number { 
        return this.TotalMaterialCost + this.TotalCutCost ; 
    }



    public static create(container:BoardLayoutContainerAbstract ,  obj:Partial<TProjectProductBoardLayoutEx4Container> ){
        const row = new TProjectProductBoardLayoutEx4Container(container ) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is TProjectProductBoardLayoutEx4Container { 
        if ( arg?.IsTProjectProductBoardLayoutEx4Container === undefined) return false ; 
        return arg.IsTProjectProductBoardLayoutEx4Container ; 
    } 


    

}



