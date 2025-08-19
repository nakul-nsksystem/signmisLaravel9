import _ from "lodash";
import { BoardLayoutContainerRefMasterAuto } from "../../BoardLayoutContainerRefMasterAuto";
import { TProjectProductBoardLayoutEx4Container } from "../../../TProjectProductBoardLayoutEx4Container";
import { BoardLayouterAbstract } from "../../../../../../../frameworks/BoardLayout/autoLayout/layouter/BoardLayouterAbstract";
import { BoardAutoLayoutResult } from "../../../../../../../frameworks/BoardLayout/autoLayout/models/BoardAutoLayoutResult";
import NumberUtil from "../../../../../../../frameworks/NumberUtil";
import { MMaterial } from "../../../../../../masters/class/models/MMaterial";
import { MMaterialDetail } from "../../../../../../masters/class/models/MMaterialDetail";

/**
 * 材料のシートサイズ＆結果
 */
export class MaterialBoardLayoutAutoResult  {


    _container:BoardLayoutContainerRefMasterAuto ; 

    /**
     * レイアウター
     */
    get Layouter():BoardLayouterAbstract { return this._layouter ; }
    _layouter:BoardLayouterAbstract ; 

    /**
     * 配置可能な製品の列数    
     *  */ 
    get NumOfProductCols():number { return this._num_of_product_cols  ; }
    _num_of_product_cols:number ; 

    /**
     * 配置可能な製品の行数
     */
    get NumOfProductRows():number { return this._num_of_product_rows  ; }
    _num_of_product_rows:number ; 

    /**
     * シート
     */
    _sheets:TProjectProductBoardLayoutEx4Container[] ;
    get Sheets():TProjectProductBoardLayoutEx4Container[] { return this._sheets ; }

    /**
     * 成功かどうか
     */
    _is_success:boolean ; 
    get IsSuccess():boolean { return this._is_success ; }

    /**
     * Constructor
     * @param container コンテナ
     * @param layouter 使用したレイアウター
     * @param numOfProductCols 配置可能な商品の列数
     * @param numOfProductRows 配置可能な商品の行数 
     * @param isSuccess Is成功かどうか
     * @param sheets   シートリスト
     */
    constructor(
        container:BoardLayoutContainerRefMasterAuto , 
        layouter:BoardLayouterAbstract , 
        numOfProductCols:number ,
        numOfProductRows:number , 
        isSuccess:boolean , 
        sheets:TProjectProductBoardLayoutEx4Container[] ){

        this._container = container ; 
        this._layouter = layouter ; 
        this._num_of_product_cols = numOfProductCols ; 
        this._num_of_product_rows = numOfProductRows ; 
        this._is_success = isSuccess ; 
        this._sheets = sheets;  
    }

    get IsBoardAutoLayoutResult():boolean { return true ; }


    /**
     * 配置可能な最大数
     */
    get NumOfProducts():number{
        return this._num_of_product_cols * this._num_of_product_rows ; 
    }

    /**
     * トータルシート枚数
     */
    get TotalSheetQty():number { 
        this._totalSheetQty = _.sumBy(this._sheets ,  "qty")  ;         
        return this._totalSheetQty; 
    }
    _totalSheetQty:number = 0 ; 

    /**
     * トータルカット数totalQty
     */
    get TotalNumOfCut():number { 
        this._totalNumOfCut = _.sumBy(this._sheets , (x => x.TotalNumOfCut ) ) ;         
        return this._totalNumOfCut;  
    }
    _totalNumOfCut:number = 0 ; 

    /**
     * トータルカットコスト
     */
    get TotalCutCost():number { 
        this._totalCutCost = _.sumBy(this._sheets , (x => x.TotalCutCost ) ) ;         
        return this._totalCutCost; 
    }
    _totalCutCost:number = 0 ; 

    /**
     * トータル材料コスト
     */
    get TotalMaterialCost():number {         
        this._totalMaterialCost = _.sumBy(this._sheets , (x => x.TotalMaterialCost) ) ;         
        return this._totalMaterialCost ; 
    }
    _totalMaterialCost:number = 0 ; 

    /**
     * トータルコスト
     */
    get TotalCost():number { 
        this._totalCost = _.sumBy(this._sheets , (x => x.TotalCost ) )  ;         
        return this._totalCost ; 
    }
    _totalCost:number = 0 ; 

    /**
     * 合計コスト/製品(数量関係なし)
     */
    get TotalCostPerProduct():number { 
        
        this._totalCostPerProduct = NumberUtil.ceil(this.TotalCost / this.NumOfProducts) ;         
        return this._totalCostPerProduct ; 
    }
    _totalCostPerProduct:number = 0 ; 
    
    get ProductQty():number { 
        this._productQty = this._container._manager.TProjectProductProcess?.TProjectProduct?.Qty ?? 0 ; 
        return this._productQty ;
    }
    _productQty:number = 0 ; 

    /**
     * 必要セット数
     */
    get TotalNumOfSet():number { 
        this._totalNumOfSet = NumberUtil.ceil(this.ProductQty / this.NumOfProducts) ; 
        return this._totalNumOfSet ; 
    }
    _totalNumOfSet:number = 0 ; 

    

    /**
     * 合計コスト/製品(数量関係あり)
     */
    get TotalCostPerQty():number { 
        // console.log("  TotalCostPerQty "  + this.ProductQty) ; 
        if ( this.Layouter.IsSingle){
            this._totalCostPerQty = NumberUtil.invalid2zr(this.TotalCost / this.ProductQty ) ;
        }
        else { 
            this._totalCostPerQty = NumberUtil.invalid2zr((this.TotalCost * this.TotalNumOfSet) / this.ProductQty) ;
        }
        return this._totalCostPerQty ; 
    }
    _totalCostPerQty:number = 0 ; 
    
    _mMaterialDetail:MMaterialDetail|undefined = undefined ; 
    get MMaterialDetail():MMaterialDetail|undefined{
        return this._mMaterialDetail ; 
    }

    get IsMaterialBoardLayoutAutoResult():boolean { return true ; }


    public static createFromBoardAutoLayoutResult(container:BoardLayoutContainerRefMasterAuto ,mMateialDetailId:number , v:BoardAutoLayoutResult){

        let mMaterialDetail:MMaterialDetail|undefined = undefined ; 
        
        if ( container._manager.MMaterialDetails !== undefined ){
            mMaterialDetail = container._manager.MMaterialDetails.find(x => x.id === mMateialDetailId ) ;  
            
        }
        // console.log("mMateialDetailId : " + mMateialDetailId ) ; 
        // console.log(container._manager.MMaterialDetails) ; 
        const parsed = v.Sheets.map(x => {
            // console.log("---") ; 
            // console.log(x) ; 
            const rtn = TProjectProductBoardLayoutEx4Container.createFromBoardAutoLayoutResult(
                container , 
                x) ; 

            // console.log(rtn) ; 
            rtn.m_material_detail_id = mMateialDetailId ; 
            rtn.m_material_detail = mMaterialDetail ; 
            return rtn ; 
        }) ; 
        
        const rtn = new MaterialBoardLayoutAutoResult(            
                        container             ,
                        v.Layouter , 
                        v.NumOfProductCols , 
                        v.NumOfProductRows ,
                        v.IsSuccess , 
                        parsed , 
                        ) ;

        
        rtn._mMaterialDetail = mMaterialDetail ; 
        // if ( container._manager.MMaterialDetails !== undefined ){
        //     rtn._mMaterialDetail = container._manager.MMaterialDetails.find(x => x.id === mMateialDetailId ) ; 
        // }
    
        return rtn ; 
        
    }

    public static is(arg:any):arg is MaterialBoardLayoutAutoResult { 
        if ( arg?.IsMaterialBoardLayoutAutoResult === undefined) return false ; 
        return arg.IsMaterialBoardLayoutAutoResult ; 
    } 


}