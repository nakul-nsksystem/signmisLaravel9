import _ from "lodash";
import NumberUtil from "../../../NumberUtil";
import { BoardAutoLayoutService } from "../BoardAutoLayoutService";
import { BoardLayouterAbstract } from "./BoardLayouterAbstract";
import { BoardAutoLayoutTypes } from "../models/TypeBoardAutoLayout"
import { BoardAutoLayoutResult } from "../models/BoardAutoLayoutResult";
import { BoardAutoLayoutResultSheet } from "../models/BoardAutoLayoutResultSheet";

/**
 * 複数シート必要
 * シートの長辺に製品の長辺が入らない
 * 材料の短辺に製品の短辺をあてる
 * */
export class BoardLayouterMulti_sLpL extends BoardLayouterAbstract {

    constructor (service:BoardAutoLayoutService) {
        super(service) ;
    }

    // 型判別用
    get IsBoardLayouterMulti_sLpL():boolean { return true ; }

    get Name():BoardAutoLayoutTypes { return BoardAutoLayoutTypes.MULTI_SH_LONGER_PD_LONGER ; }

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
        const numOfSheets = NumberUtil.ceil(this.Service.ProductLonger / sheetLonger) ;

        // 製品短辺がシート長辺に何個入るか
        const numOfRows = NumberUtil.trunc(sheetShorter / this.Service.ProductShorter , 0 ) ;

        // 製品短辺の長さ * 列数
        const rowLen = this.Service.ProductShorter * numOfRows ;

        const numOfCut = numOfRows - ( rowLen == sheetShorter ? 1 : 0 ) ;
        let sheets:BoardAutoLayoutResultSheet[] = [] ;

        const sheet = new BoardAutoLayoutResultSheet(
            sheetLonger ,
            rowLen ,
            numOfSheets - 1 ,
            numOfCut
        ) ;
        sheets.push(sheet) ;

        // 最後の余り寸法
        let wasteLen = this.Service.ProductLonger % sheetLonger ;
        if (wasteLen == 0) wasteLen = sheetLonger

        // 端材
        const sheetWaste = new BoardAutoLayoutResultSheet(
            wasteLen ,
            rowLen ,
            1 ,
            numOfCut + (wasteLen == sheetShorter ? 0 : 1) ,
        ) ;
        sheets.push(sheetWaste) ;

        const result:BoardAutoLayoutResult = new BoardAutoLayoutResult(1, numOfRows, sheets, this) ;
        result._isSuccess = true ;

        return result ;
    }

    public static is(arg:any):arg is BoardLayouterMulti_sLpL {
        if (arg?.IsBoardLayouterMulti_sLpL === undefined) return false ;
        return arg.IsBoardLayouterMulti_sLpL ;
    }
}
