import _ from "lodash";
import ArrayUtil from "../../../../../frameworks/ArrayUtil";
import { BoardLayoutTypes } from "../BoardLayout";
import { TProjectProductBoardLayout } from "../../models/TProjectProductBoardLayout";
import { BoardLayoutContainerManager } from "../BoardLayoutContainerManager";
import { BoardLayoutContainerAbstract } from "./BoardLayoutContainerAbstract";
import { MaterialBoardAutoLayoutService } from "./autoLayout/MaterialBoardAutoLayoutService";
import { MaterialBoardLayoutAutoResult } from "./autoLayout/models/MaterialBoardLayoutAutoResult";
import { TProjectProductProcessUseBoardLayout } from "../../models/tsMixins/TProjectProductProcessUseBoardLayout";

/**
 * 規格から自動
 */
export class BoardLayoutContainerRefMasterAuto extends BoardLayoutContainerAbstract {         
    

    constructor (manager:BoardLayoutContainerManager) { 
        super(manager) ; 
    }

    // 型判別用
    get IsBoardLayoutContainerRefMasterAuto():boolean { return true ; }

    /**
     * 自動板わりシミュレーションサービス
     */
    _layoutService?:MaterialBoardAutoLayoutService = undefined ; 
    get LayoutService():MaterialBoardAutoLayoutService { 
        if ( _.isNil( this._layoutService) ){
            this._layoutService = new MaterialBoardAutoLayoutService(this) ; 
        }

        if (! _.isNil( this._manager.TProjectProductProcess )  
            && ! _.isNil( this._manager.TProjectProductProcess.TProjectProduct )) {
            const pW = this._manager.TProjectProductProcess.TProjectProduct.SizeW ; 
            const pH = this._manager.TProjectProductProcess.TProjectProduct.SizeH  ; 
            const pLonger = Math.max(pW , pH) ; 
            const pShorter = Math.min(pW , pH) ; 
            if (this._layoutService.ProductLonger !== pLonger ){
                // console.log( this._layoutService.ProductLonger + " : " + pLonger ) ; 
                this._layoutService.ProductLonger = pLonger ; 
            }
            if ( this._layoutService.ProductShorter !== pShorter ){
                // console.log( this._layoutService._productLonger + " : " + pLonger ) ; 
                this._layoutService.ProductShorter = pShorter ; 
            }

            const qty = this._manager.TProjectProductProcess.TProjectProduct.Qty  ; 
            if ( this._layoutService.Qty !== qty ){
                // console.log( this._layoutService.Qty + " : " + qty ) ; 
                this._layoutService.Qty = qty ; 
            }

            if ( TProjectProductProcessUseBoardLayout.is( this._manager.TProjectProductProcess)){
                 const priorityMode = this._manager.TProjectProductProcess.MMaterialBoardLayoutPriorityMode ;
                 this._layoutService.PriorityMode = priorityMode ; 
            }

        }

        if ( this._layoutService.MMaterialDetails.length === 0  ){
            if ( this._manager.MMaterialDetails !== undefined){
                if ( JSON.stringify(this._layoutService.MMaterialDetails) !== JSON.stringify(this._manager.MMaterialDetails)){                
                    this._layoutService.MMaterialDetails = this._manager.MMaterialDetails   ;            
                }
            }
        }
        else { 
            if ( this._manager.MMaterialDetails === undefined ) { 
                this._layoutService.MMaterialDetails = []  ;
            }
            else { 
                if ( JSON.stringify(this._layoutService.MMaterialDetails) !== JSON.stringify(this._manager.MMaterialDetails)){                
                    this._layoutService.MMaterialDetails = this._manager.MMaterialDetails   ;            
                }
            }
            // console.log(JSON.stringify(undefined)) ; 
            // console.log(JSON.stringify(this._layoutService.MMaterialDetails)) ; 
            
        }
        
        
        return this._layoutService ; 

    }

    /**
     * 
     */
    set BoardLayouts(v:TProjectProductBoardLayout[]){
        // const filterd = v.filter(x => x.m_material_detail_id !== undefined && x.is_auto  ) ?? [] ;   ; 
        // const parsed = filterd.map(x => TProjectProductBoardLayoutEx4Container.create( this ,x )) ; 
        // ArrayUtil.resetInsert(this.Layouts , parsed) ; 
        
    }

    /**
     * Is自動かどうか
     */
    get IsAuto():boolean { return true ; } 

    /**
     * 合計コスト
     */
     get TotalCostPerQty():number { 
        
        if ( this._bestResult === undefined) return 0 ; 
        if ( this._bestResult.Layouter.IsSingle ) {
            return this.TotalCost  / this._manager.ProductQty ; 
        }
        else {
            return this.TotalCost * this._bestResult.TotalNumOfSet / this._manager.ProductQty  ; 
        }

    }

    /**
     * 全シミュレーション結果
     */
    get AutoResults():MaterialBoardLayoutAutoResult[]{
        return this.LayoutService.getResults() ; 
    }

    /**
     * ベストなシミュレーション結果
     */
    get BestResult():MaterialBoardLayoutAutoResult|undefined{
        this._bestResult = this.LayoutService.BestResult ; 
        
        // console.log(this._layouts) ; 
        ArrayUtil.resetInsert(this._layouts , this._bestResult?.Sheets ?? []) ; 
        return this._bestResult ; 
    }
    _bestResult:MaterialBoardLayoutAutoResult|undefined = undefined ; 


    /**
     * レイアウトタイプ
     */
    get LayoutType():BoardLayoutTypes { return BoardLayoutTypes.RefMasterAuto ; } 

    public static is(arg:any):arg is BoardLayoutContainerRefMasterAuto { 
        if ( arg?.IsBoardLayoutContainerRefMasterAuto === undefined) return false ; 

        return arg.IsBoardLayoutContainerRefMasterAuto ; 
    } 
     
}



