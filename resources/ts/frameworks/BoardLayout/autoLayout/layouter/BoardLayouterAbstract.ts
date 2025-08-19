import _ from "lodash";
import NumberUtil from "../../../NumberUtil";
import { BoardAutoLayoutService } from "../BoardAutoLayoutService";
import { BoardAutoLayoutResult } from "../models/BoardAutoLayoutResult";
import { BoardAutoLayoutResultSheet } from "../models/BoardAutoLayoutResultSheet";
import { BoardAutoLayoutTypes } from "../models/TypeBoardAutoLayout";

export interface IBoardLayouter {
    /**
     * レイアウト種類名
     */
     get Name():BoardAutoLayoutTypes ;

    /**
     * 1枚のシートで構成
     */
     get IsSingle():boolean ;

    /**
     * false:商品を横長 true:商品を縦長
     */
    get IsProductRotate():boolean ;

    /**
     * 結果の取得
     * @param sheetLonger
     * @param sheetShorter
     */
    getResult(sheetLonger:number ,sheetShorter:number):BoardAutoLayoutResult|boolean ;
}

/**
 * 板割り方法で使用する仮想クラス
 */
export abstract class BoardLayouterAbstract implements IBoardLayouter {

    _service:BoardAutoLayoutService ;
    get Service():BoardAutoLayoutService{ return this._service ; }

    constructor (service:BoardAutoLayoutService) {
        this._service = service ;
    }

    /**
     * レイアウト種類名
     */
    abstract get Name():BoardAutoLayoutTypes ;

    /**
     * 1枚のシートで構成
     */
    abstract get IsSingle():boolean ;

    /**
     * false:商品を横長 true:商品を縦長
     */
    abstract get IsProductRotate():boolean ;

    /**
     * 結果の取得
     * @param sheetLonger
     * @param sheetShorter
     */
    abstract getResult(sheetLonger:number ,sheetShorter:number):BoardAutoLayoutResult|boolean ;
    // abstract get Result():TypeBoardAutoLayoutResult|boolean ;
}

/**
 * 1枚のシート内に収まる板割り方法で使用する仮想クラス
 */
 export abstract class BoardLayouterSingleAbstract extends BoardLayouterAbstract {

    constructor (service:BoardAutoLayoutService) {
        super(service) ;
    }

    get IsSingle():boolean { return true ; }

    /**
     * シート1枚に複数製品のレイアウトを取得
     * @param sheetLonger       シートの長辺
     * @param sheetShorter      シートの短辺
     * @param lenForSlonger     シートの長辺にあてる長さ
     * @param lenForSshorter    シートの短辺にあてる長さ
     * @param isProductRotate   シートが横長に対して　true : 商品が縦長 false :商品が横長
     */
    public getSingleResult (
        sheetLonger:number ,
        sheetShorter:number  ,
        lenForSlonger:number  ,
        lenForSshorter:number
    ):BoardAutoLayoutResult {

        // 製品がシート短い辺に最大何個入るか
        const numOfRows = NumberUtil.trunc(sheetShorter / lenForSshorter , 0 ) ;
        // 製品がシート長辺に最大何個入るか
        const numOfCols = NumberUtil.trunc(sheetLonger / lenForSlonger , 0 ) ;
        // 最大製品数/シート
        const numOfProducts = numOfRows * numOfCols ;
        if ( numOfProducts === 0 ){

        } else {

        }

        //console.log(`row:${numOfRows} col:${numOfCols} total:${numOfProducts}`)

        // 必要枚数
        const numOfSheets = NumberUtil.ceil( this.Service.Qty / numOfProducts) ;

        // 製品の長さ * 列数
        const colLen = lenForSlonger  * numOfCols ;
        // 製品の長さ * 行数
        const rowLen = lenForSshorter * numOfRows ;

        // 最後以外のシートを追加
        let sheets:BoardAutoLayoutResultSheet[] = [] ;

        // カット数
        let numOfCut = numOfRows + numOfCols ;
        // 列側がちょっきり
        numOfCut -= colLen == sheetLonger  ? 1 : 0 ;
        // 行側がちょっきり
        numOfCut -= rowLen == sheetShorter ? 1 : 0 ;

        const pdCols = [] ;
        for (let i = 0 ; i < numOfCols ; i++) {
            pdCols.push(numOfRows) ;
        }

        // 余り数
        let remainQty = this.Service.Qty % numOfProducts ;

        const sheet = new BoardAutoLayoutResultSheet(
            colLen ,
            rowLen ,
            numOfSheets - (remainQty == 0 && numOfSheets == 1 ? 0 : 1 ),
            numOfCut ,
        ) ;

        // ちょうど１枚に収まる
        // console.log(` Qty:${this.Service.Qty} numOfCols:${numOfCols} numOfRows:${numOfRows}`)
        // console.log(` remainQty:${remainQty} numOfSheets:${numOfSheets} sheetQty:${sheet.Qty}`)
        if (sheet.Qty > 0) sheets.push(sheet)

        // 最後の余り寸法
        if (remainQty != 0) {
            // 余りで使用する列数
            let useNumOfCols = NumberUtil.ceil(remainQty / numOfRows) ;
            // 使用する列幅
            let useColLen = useNumOfCols * lenForSlonger ;
            // カット数
            let useNumOfCut = useNumOfCols + numOfRows ;
            useNumOfCut -= rowLen == sheetShorter ? 1 : 0 ;

            // 最終列の行数
            let numOfRowsOfLastCol = remainQty % numOfRows ;

            const usePdCols = [] ;
            for (let j = 0 ; j < useNumOfCols ; j++) {
                usePdCols.push(j == useNumOfCols ? numOfRowsOfLastCol : numOfRows) ;
            }

            // 端材
            const sheet = new BoardAutoLayoutResultSheet(
                useColLen ,
                rowLen ,
                1 ,
                useNumOfCut
            );

            sheets.push(sheet) ;
        }

        // 結果
        const result:BoardAutoLayoutResult = new BoardAutoLayoutResult(numOfCols, numOfRows, sheets, this) ;
        result._isSuccess = true ;

        return result ;
    }
}




