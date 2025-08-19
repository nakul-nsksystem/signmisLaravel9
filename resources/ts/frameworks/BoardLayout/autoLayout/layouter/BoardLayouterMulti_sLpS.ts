import _ from "lodash";
import { BoardAutoLayoutService } from "../BoardAutoLayoutService";
import { BoardLayouterAbstract } from "./BoardLayouterAbstract";
import { BoardAutoLayoutTypes } from "../models/TypeBoardAutoLayout"
import { BoardAutoLayoutResult } from "../models/BoardAutoLayoutResult";
import { BoardAutoLayoutResultSheet } from "../models/BoardAutoLayoutResultSheet";
import NumberUtil from "../../../NumberUtil";

/**
 * 複数シート必要
 * シートの長辺に製品の長辺が入らない
 * 材料の長辺に製品の短辺をあてる
 * */
export class BoardLayouterMulti_sLpS extends BoardLayouterAbstract {


    constructor (service:BoardAutoLayoutService) {
        super(service) ;
    }

    // 型判別用
    get IsBoardLayouterMulti_sLpS():boolean { return true ; }

    get Name():BoardAutoLayoutTypes { return BoardAutoLayoutTypes.MULTI_SH_LONGER_PD_SHORTER ; }

    get IsProductRotate():boolean { return false ; }

    get IsSingle():boolean { return false ; }

    /**
     * 結果
     * @param sheetLonger
     * @param sheetShorter
     * @returns
     */
    public getResult(sheetLonger:number ,sheetShorter:number):BoardAutoLayoutResult{

        // 必要枚数
        const numOfSheets = NumberUtil.ceil(this.Service.ProductLonger / sheetShorter) ;

        // 製品短辺がシート長辺に何個入るか
        const numOfRows = NumberUtil.trunc(sheetLonger / this.Service.ProductShorter, 0 ) ;

        // 製品短辺の長さ * 列数
        const rowLen = this.Service.ProductShorter * numOfRows ;
        const numOfCut = numOfRows - (rowLen == sheetLonger ? 1 : 0) ;

        let sheets:BoardAutoLayoutResultSheet[] = [] ;
        // console.log("numOfCut " + numOfCut ) ;

        const sheet:BoardAutoLayoutResultSheet = new BoardAutoLayoutResultSheet(
            sheetShorter ,
            rowLen ,
            numOfSheets - 1 ,
            numOfCut
        ) ;
        sheets.push(sheet) ;

        // 最後の余り寸法
        let wasteLen = this.Service.ProductLonger % sheetShorter;
        if (wasteLen == 0) wasteLen = sheetShorter ;

        // 端材
        const sheetWaste = new BoardAutoLayoutResultSheet(
            wasteLen ,
            rowLen ,
            1 ,
            numOfCut + (wasteLen == sheetShorter ? 0 : 1)
        )

        sheets.push(sheetWaste) ;

        const result:BoardAutoLayoutResult = new BoardAutoLayoutResult(1, numOfRows, sheets, this) ;
        result._isSuccess = true ;

        return result ;
    }

    public static is(arg:any):arg is BoardLayouterMulti_sLpS {
        if (arg?.IsBoardLayouterMulti_sLpS === undefined) return false ;
        return arg.IsBoardLayouterMulti_sLpS ;
    }
}



