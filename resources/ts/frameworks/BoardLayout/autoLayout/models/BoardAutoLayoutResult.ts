import _ from "lodash";
import ObjectUtil from "../../../ObjectUtil";
import { BoardLayouterAbstract } from "../layouter/BoardLayouterAbstract";
import { BoardAutoLayoutResultSheet } from "./BoardAutoLayoutResultSheet";

/**
 * レイアウターの結果
 */
export class BoardAutoLayoutResult {

    //配置可能な製品の列数
    get NumOfProductCols():number { return this._num_of_product_cols ; }
    _num_of_product_cols:number ;

    /**
     * 配置可能な製品の行数
     */
    get NumOfProductRows():number { return this._num_of_product_rows ; }
    _num_of_product_rows:number ;

    /**
     * false:商品を横長 true:商品を縦長
     */
    get Layouter():BoardLayouterAbstract { return this._layouter; }
    _layouter:BoardLayouterAbstract ;

    /**
     * シート
     */
    _sheets:BoardAutoLayoutResultSheet[] ;
    get Sheets():BoardAutoLayoutResultSheet[] { return this._sheets ; }

    _isSuccess:boolean = false ;
    get IsSuccess():boolean { return this._isSuccess ; }

    /**
     *
     * @param numOfProductCols 配置可能な商品の列数
     * @param numOfProductRows 配置可能な商品の行数
     * @param sheets           シートリスト
     * @param layouter         レイアウター
     */
    constructor(
        numOfProductCols:number ,
        numOfProductRows:number ,
        sheets:BoardAutoLayoutResultSheet[] ,
        layouter:BoardLayouterAbstract ) {

        this._num_of_product_cols = numOfProductCols ;
        this._num_of_product_rows = numOfProductRows ;
        this._sheets = sheets;
        this._layouter = layouter ;
    }

    get IsBoardAutoLayoutResult():boolean { return true ; }

    toJSON () {
        const row = {} ;

        // プロパティ値を取り直し(getter の中に値をセットしているものがあるため)
        const _this = this ;
        ObjectUtil.getGetters(this).forEach(x => {
            // @ts-ignore
            _this[x] ;
        });

        Object.assign(row , this) ;
        // @ts-ignore
        delete row._layouter ;
        return row ;
      }

    public static is(arg:any):arg is BoardAutoLayoutResult {
        if (arg?.IsBoardAutoLayoutResult === undefined) return false ;
        return arg.IsBoardAutoLayoutResult ;
    }
}