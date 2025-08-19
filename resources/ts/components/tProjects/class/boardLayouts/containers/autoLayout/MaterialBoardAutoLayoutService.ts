import _ from "lodash";
import ArrayUtil from "../../../../../../frameworks/ArrayUtil";
import { MMaterialDetail } from "../../../../../masters/class/models/MMaterialDetail";
import { BoardLayoutContainerRefMasterAuto } from "../BoardLayoutContainerRefMasterAuto";
import { BoardAutoLayoutService } from "../../../../../../frameworks/BoardLayout/autoLayout/BoardAutoLayoutService";
import { BoardAutoLayoutResult } from "../../../../../../frameworks/BoardLayout/autoLayout/models/BoardAutoLayoutResult";
import { BoardSheetWithResult } from "../../../../../../frameworks/BoardLayout/autoLayout/models/BoardSheetWithResult";

import { BoardAutoLayoutPriorityModes, TypeBoardSheet, TypeBoardSheetResult } from "../../../../../../frameworks/BoardLayout/autoLayout/models/TypeBoardAutoLayout";
import { MaterialBoardLayoutAutoResult } from "./models/MaterialBoardLayoutAutoResult";
import { filter } from "vue/types/umd";
import { TProjectProductProcessUniteMaterials } from "../../../models/tsMixins/process/TProjectProductProcessUniteMaterials";

/**
 * BoardLayoutAutoLayouterを管理する
 */
export class MaterialBoardAutoLayoutService   {         


    protected _layoutService:BoardAutoLayoutService = new BoardAutoLayoutService() ; 

    protected _container:BoardLayoutContainerRefMasterAuto ; 
    

    constructor (container:BoardLayoutContainerRefMasterAuto) { 
        this._container = container ;  
        
    }

    
    /**
     * 商品長手
     */
    _productLonger:number = 0 ; 
    get ProductLonger():number { return this._productLonger ; }
    set ProductLonger(v:number) { 
        this._productLonger = v ; 
        this._layoutService.ProductLonger = v ; 
    }
       
    /**
     * 商品短手
     */
    _productShorter:number = 0 ; 
    get ProductShorter():number { return this._productShorter ; }
    set ProductShorter(v:number) { 
        this._productShorter = v ; 
        this._layoutService.ProductShorter = v ; 
    }

    /**
     * 数量
     */
    _qty:number = 0 ;  
    get Qty():number { return this._qty  ; } 
    set Qty(v:number )  {
        this._qty = v ; 
        this._layoutService.Qty = v ;  
    }

        

    /**
     * 材料明細
     */
    _mMaterialDetails:MMaterialDetail[] = [] ; 
    get MMaterialDetails():MMaterialDetail[]{ return this._mMaterialDetails ; }
    set MMaterialDetails(v:MMaterialDetail[]|undefined){
        if ( _.isNil(v) ){
            this._mMaterialDetails.splice(0) ;    
        }
        else { 
            ArrayUtil.resetInsert(this._mMaterialDetails , v ) ; 
        }
        
        const parsed = this._mMaterialDetails.map(x => {
            const row:TypeBoardSheet = {
                w:x.width ,
                h:x.height ,
                id:x.id ,
            }
            return row ; 
        })  ; 

        if ( JSON.stringify(parsed) !== JSON.stringify(this._layoutService.MaterialSheets)){                
            this._layoutService.MaterialSheets = parsed ; 
        }

        
    }
    


    /**
     * 優先モード
     */
    PriorityMode:BoardAutoLayoutPriorityModes = BoardAutoLayoutPriorityModes.JOINED_QTY ;


    /**
     * カットコスト
     */
    get CostPerCut():number  { return this._container._manager.CostPerCut ; }

    /**
     * 板材 端材扱い境界 %　( 指定 %以下の場合は1枚分)
     */    
    get WasteCostPer():number  { return this._container._manager.WasteCostPer ; }

    /**
     * 結果
     */
    public getResults():MaterialBoardLayoutAutoResult[]{

    //     const pW = this._container._manager?.TProjectProductProcess?.TProjectProduct?.SizeW ?? 0 ; 
    //     const pH = this._container._manager?.TProjectProductProcess?.TProjectProduct?.SizeW ?? 0 ; 
    //     const qty = this._container._manager?.TProjectProductProcess?.TProjectProduct?.Qty ?? 0 ; 
    //     const pLonger = Math.max(pW , pH) ; 
    //     const pShorter = Math.min(pW , pH) ; 

    //     this._layoutService.ProductLonger = pLonger ; 
    //     this._layoutService.ProductShorter = pShorter ; 
    //     this._layoutService.Qty = qty ; 

    //     if ( TProjectProductProcessUniteMaterials.is( this._container._manager.TProjectProductProcess)){
    //         const priorityMode = this._container._manager.TProjectProductProcess.MMaterialBoardLayoutPriorityMode ;
    //         this.PriorityMode = priorityMode ; 
    //    }


        // 四角としてのシミュレーション結果を取得
        const results:BoardSheetWithResult[] = this._layoutService.getResults() ;
        // console.log("getResults 1") ; 
        // if ( this._lastResult == JSON.stringify(results)) return this._results ; 
        // console.log("getResults 2 ") ; 
        // this._lastResult = JSON.stringify(results) ; 
        const rtn:MaterialBoardLayoutAutoResult[] = [] ; 

        // 物件で使用できるよう付加情報を足す
        for ( const sheetRes of results) { 
            const mMaterialDetailId = sheetRes.id ?? 0  ; 

            for ( const key in sheetRes.layout_result){

                if ( key !== "failReason"){
                    // @ts-ignore
                    const lResult = sheetRes.layout_result[key] ;
                    
                    if ( BoardAutoLayoutResult.is(lResult)){
                        const aRes = MaterialBoardLayoutAutoResult.createFromBoardAutoLayoutResult(this._container , mMaterialDetailId ,lResult)                        
                        rtn.push(aRes) ; 
                    }
                    
                }
                else { 
                    break ; 
                }
            }
        }
        this._results = rtn ;
        // ArrayUtil.resetInsert(this._results , rtn ) ; 
        return rtn ; 
    }
    _results:MaterialBoardLayoutAutoResult[] = [] ; 

    // _lastResult:string = "" ; 


    /**
     * 比較して良い結果を取得
     */    
     public getBetterResult( A:MaterialBoardLayoutAutoResult|undefined , B:MaterialBoardLayoutAutoResult|undefined ):MaterialBoardLayoutAutoResult|undefined {
        
        if ( _.isNil(A)) return B ; 
        if ( _.isNil(B)) return A ; 

        // console.log("getBetterResult 2 " + this.PriorityMode) ; 
        
        switch (this.PriorityMode){
            //継ぎ枚数重視
            case BoardAutoLayoutPriorityModes.JOINED_QTY :
                // console.log("case modeQty "  +  A.TotalCostPerQty) ; 
                 
                if ( A.TotalSheetQty == B.TotalSheetQty){
                    return A.TotalCostPerQty < B.TotalCostPerQty ? A : B ; 
                }
                else {
                    //console.log("A.totalQty " + A.totalQty + " B.totalQty " + B.totalQty) ; 
                    return A.TotalSheetQty < B.TotalSheetQty ? A : B ; 
                }

            //コスト重視
            case BoardAutoLayoutPriorityModes.COST :   
                if ( A.TotalCostPerQty == B.TotalCostPerQty){
                    return A.TotalSheetQty < B.TotalSheetQty ? A : B ; 
                }
                else {
                    return A.TotalCostPerQty < B.TotalCostPerQty ? A : B ; 
                }

            default : 

        }
        return A ; 
            
        
    }  


    /**
     * ベストレイアウト
     */
    get BestResult():MaterialBoardLayoutAutoResult|undefined {
        const _this = this ; 
        const results = this.getResults() ; 

        if ( results === undefined) return undefined ; 

        const filterd = results.filter(x => x.IsSuccess) ; 
        // if ( filterd.length === 0 )  return undefined ; 


        const val:MaterialBoardLayoutAutoResult|undefined = filterd.reduce(function (
            accu:MaterialBoardLayoutAutoResult|undefined, 
            curr:MaterialBoardLayoutAutoResult)  {
            return _this.getBetterResult( accu ,curr) == accu ? accu : curr ;

        } ,undefined) ;     

        this._bestResult = val ; 
        return val ; 

    }

    _bestResult?:MaterialBoardLayoutAutoResult ; 
    

}



