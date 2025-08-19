import _ from "lodash";
import { BoardAutoLayoutService } from "../BoardAutoLayoutService";
import { BoardLayouterAbstract } from "./BoardLayouterAbstract";
import { BoardAutoLayoutTypes } from "../models/TypeBoardAutoLayout"
import { BoardAutoLayoutResult } from "../models/BoardAutoLayoutResult";
import { BoardAutoLayoutResultSheet } from "../models/BoardAutoLayoutResultSheet";
import NumberUtil from "../../../NumberUtil";

/**
 * 複数シート必要
 * 材料の長辺に製品の長辺が入るが
 * 材料の短辺に製品の短辺が入らない
 * 材料の短辺方向に継ぐ
 * */
export class BoardLayouterMulti_sLpL_over_sS extends BoardLayouterAbstract {

    constructor (service:BoardAutoLayoutService) {
        super(service) ;
    }

    // 型判別用
    get IsBoardLayouterMulti_sLpL_over_sS():boolean { return true ; }

    get Name():BoardAutoLayoutTypes { return BoardAutoLayoutTypes.MULTI_SH_LONGER_PD_LONGER_OVER_S_SHORTER ; }

    get IsProductRotate():boolean { return true ; }

    get IsSingle():boolean { return false ; }

    /**
     * 結果
     * @param sheetLonger
     * @param sheetShorter
     * @returns
     */
    public getResult(sheetLonger:number ,sheetShorter:number):BoardAutoLayoutResult{

        // 必要枚数
        const numOfSheets = NumberUtil.ceil(this.Service.ProductShorter / sheetShorter) ;

        // 製品長辺がシート長辺に何個入るか
        const numOfRows = NumberUtil.trunc(sheetLonger / this.Service.ProductLonger , 0 ) ;

        // 製品短辺の長さ * 列数
        const rowLen = this.Service.ProductLonger * numOfRows ;

        let sheets:BoardAutoLayoutResultSheet[] = [] ;

        const sheet = new BoardAutoLayoutResultSheet(
            rowLen ,
            sheetShorter ,
            numOfSheets - 1 ,
            numOfRows - (rowLen == sheetLonger ? 1 : 0 ) ,
        ) ;
        sheets.push(sheet) ;

        // 最後の余り寸法
        const wasteLen = this.Service.ProductShorter % sheetShorter ;

        // 端材
        const sheetWaste = new BoardAutoLayoutResultSheet(
            rowLen ,
            wasteLen ,
            1 ,
            numOfRows + (wasteLen == sheetShorter ? 0 : 1)
        ) ;
        sheets.push(sheetWaste) ;

        // １しかないとおもう
        const result:BoardAutoLayoutResult = new BoardAutoLayoutResult(1, 1, sheets, this) ;
        result._isSuccess = true ;

        return result ;
    }

    public static is(arg:any):arg is BoardLayouterMulti_sLpL_over_sS {
        if (arg?.IsBoardLayouterMulti_sLpL_over_sS === undefined) return false ;
        return arg.IsBoardLayouterMulti_sLpL_over_sS ;
    }
}
