import _ from "lodash";
import { BoardAutoLayoutService } from "../BoardAutoLayoutService";
import { BoardLayouterSingleAbstract } from "./BoardLayouterAbstract";
import { BoardAutoLayoutTypes } from "../models/TypeBoardAutoLayout"
import { BoardAutoLayoutResult } from "../models/BoardAutoLayoutResult";

/**
 * シート1枚に複数製品
 * 材料の長辺に製品の短辺をあてる
 * */
export class BoardLayouterSingle_sLpS extends BoardLayouterSingleAbstract {

    constructor (service:BoardAutoLayoutService) {
        super(service) ;
    }

    // 型判別用
    get IsBoardLayouterSingle_sLpS():boolean { return true ; }

    get Name():BoardAutoLayoutTypes { return BoardAutoLayoutTypes.SINGLE_SH_LONGER_PD_SHORTER ; }

    get IsProductRotate():boolean { return true ; }

    /**
     * 結果
     * @param sheetLonger
     * @param sheetShorter
     * @returns
     */
    public getResult(sheetLonger:number ,sheetShorter:number):BoardAutoLayoutResult{
        return this.getSingleResult(
            sheetLonger ,
            sheetShorter ,
            this.Service.ProductShorter ,
            this.Service.ProductLonger ) ;
    }

    public static is(arg:any):arg is BoardLayouterSingle_sLpS {
        if (arg?.IsBoardLayouterSingle_sLpS === undefined) return false ;
        return arg.IsBoardLayouterSingle_sLpS ;
    }
}
