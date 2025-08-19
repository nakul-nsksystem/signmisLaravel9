import _ from "lodash";
import ArrayUtil from "../../ArrayUtil";
import ObjectUtil from "../../ObjectUtil";
import { BoardLayouterAbstract } from "./layouter/BoardLayouterAbstract";
import { BoardLayouterMulti_sLpL } from "./layouter/BoardLayouterMulti_sLpL";
import { BoardLayouterMulti_sLpL_over_sS } from "./layouter/BoardLayouterMulti_sLpL_over_sS";
import { BoardLayouterMulti_sLpS } from "./layouter/BoardLayouterMulti_sLpS";
import { BoardLayouterSingle_sLpL } from "./layouter/BoardLayouterSingle_sLpL";
import { BoardLayouterSingle_sLpS } from "./layouter/BoardLayouterSingle_sLpS";
import { BoardAutoLayoutResult } from "./models/BoardAutoLayoutResult";
import { BoardSheetWithResult } from "./models/BoardSheetWithResult";
import { TypeBoardSheet, TypeBoardSheetResult } from "./models/TypeBoardAutoLayout";

/**
 * BoardLayoutAutoLayouterを管理する
 */
export class BoardAutoLayoutService {

    // protected _store:object ;
    // public get Store():object { return this._store ; }

    _layouters:BoardLayouterAbstract[] = [];

    _layouterSingle_sLpS:BoardLayouterSingle_sLpS ;
    _layouterSingle_sLpL:BoardLayouterSingle_sLpL ;

    _layouterMulti_sLpS:BoardLayouterMulti_sLpS ;
    _layouterMulti_sLpL:BoardLayouterMulti_sLpL ;
    _layouterMulti_sLpL_over_sS:BoardLayouterMulti_sLpL_over_sS ;

    // constructor (store:object) {
    constructor () {
        // this._store = store ;

        this._layouterSingle_sLpS = new BoardLayouterSingle_sLpS(this) ;
        this._layouterSingle_sLpL = new BoardLayouterSingle_sLpL(this) ;

        this._layouterMulti_sLpS = new BoardLayouterMulti_sLpS(this) ;
        this._layouterMulti_sLpL = new BoardLayouterMulti_sLpL(this) ;
        this._layouterMulti_sLpL_over_sS = new BoardLayouterMulti_sLpL_over_sS(this) ;

        this._layouters.push(this._layouterMulti_sLpS) ;
        this._layouters.push(this._layouterMulti_sLpL) ;
        this._layouters.push(this._layouterMulti_sLpL_over_sS) ;
    }

    /**
     * 材料資材サイズの配列
     */
    _materialSheets:TypeBoardSheet[] = [] ;
    get MaterialSheets():TypeBoardSheet[]{ return this._materialSheets ; }
    set MaterialSheets(v:TypeBoardSheet[]){
        ArrayUtil.resetInsert(this._materialSheets, v) ;
    }

    /**
     * 商品長手
     */
    ProductLonger:number = 0 ;
    // get ProductLonger():number { return this._productLonger ; }
    // set ProductLonger(v:number) { this._productLonger = v ; }

    /**
     * 商品短手
     */
    ProductShorter:number = 0 ;
    // get ProductShorter():number { return this._productShorter ; }
    // set ProductShorter(v:number) { this._productShorter = v ; }

    /**
     * 数量
     */
    Qty:number = 0 ;

    _lastMateralSheets:string = "" ;
    /**
     * 結果
     */
    public getResults():BoardSheetWithResult[]{
        const rtn:BoardSheetWithResult[] = [] ;

        // 材料サイズ
        for ( const s of this._materialSheets) {
            const layoutRes:TypeBoardSheetResult = {
                Single_sLpL       :new BoardAutoLayoutResult(0, 0, [], this._layouterSingle_sLpL),
                Single_sLpS       :new BoardAutoLayoutResult(0, 0, [], this._layouterSingle_sLpS),
                Multi_sLpL        :new BoardAutoLayoutResult(0, 0, [], this._layouterMulti_sLpL),
                Multi_sLpS        :new BoardAutoLayoutResult(0, 0, [], this._layouterMulti_sLpS),
                Multi_sLpL_overSS :new BoardAutoLayoutResult(0, 0, [], this._layouterMulti_sLpL_over_sS),
            } ;

            if (this.ProductShorter !== 0) {
                const sheetLonger  = Math.max(s.w, s.h) ;
                const sheetShorter = Math.min(s.w, s.h) ;

                if (this.ProductLonger > sheetLonger) {
                    // 製品の長辺がシートの長辺よりの大きい

                    if (this.ProductShorter > sheetLonger) {
                        // 製品の短辺もシートの長辺よりの大きい（４分割以上になる為不可)
                        layoutRes.fail_reason = "長辺も短辺も入らない" ;
                    } else {
                        // 製品の短辺をシートの長辺にあてる ( Multi_sLpS )
                        // layoutRes.Multi_sLpS = this._layouterMulti_sLpS.Result ;
                        layoutRes.Multi_sLpS = this._layouterMulti_sLpS.getResult(sheetLonger, sheetShorter) ;

                        if (this.ProductShorter <= sheetShorter) {
                            // 製品の短辺がシート短辺に入る
                            // 製品の短辺をシートの短辺にあてる ( Multi_sLpL )
                            // layoutRes[this.dMulti_sLpL] = this.getResultMulti_sLpL(sheetLonger, sheetShorter) ;
                            layoutRes.Multi_sLpL = this._layouterMulti_sLpL.getResult(sheetLonger, sheetShorter) ;
                        }
                    }
                } else {
                    // 製品の長辺がシートの長辺に入る
                    if (this.ProductShorter > sheetShorter) {
                        // 製品の短辺がシートの短辺よりの大きい ( Multi_sLpL_over_sS )
                        // @@
                        layoutRes.Multi_sLpL_overSS = this._layouterMulti_sLpL_over_sS.getResult(sheetLonger, sheetShorter) ;
                        // layoutRes[this.dMulti_sLpL_over_sS] = this.getResultMulti_sLpL_over_sS(sheetLonger, sheetShorter) ;

                    } else {
                        if (sheetShorter >= this.ProductLonger) {
                            // 製品の長辺が、シート短辺にあてる (Single_sLpS)
                            // @@ _layouterSingle_sLpS
                            layoutRes.Single_sLpS = this._layouterSingle_sLpS.getResult(sheetLonger, sheetShorter) ;
                            // layoutRes[this.dSingle_sLpS] = this.getResultSingle_sLpS(sheetLonger, sheetShorter) ;
                        }

                        // 製品の長辺を、シート長辺にあてる (Single_sLpL)
                        // // @@
                        layoutRes.Single_sLpL = this._layouterSingle_sLpL.getResult(sheetLonger, sheetShorter) ;
                        // layoutRes[this.dSingle_sLpL] = this.getResultSingle_sLpL(sheetLonger, sheetShorter) ;
                    }
                }
            }

            // シートに対する結果作成
            const sRes:BoardSheetWithResult = new BoardSheetWithResult(
                s.w,
                s.h,
                layoutRes,
                s.id,
            ) ;

            rtn.push(sRes) ;
        }
        this._results = rtn ;
        return rtn ;
    }

    _results:BoardSheetWithResult[] = []
}
