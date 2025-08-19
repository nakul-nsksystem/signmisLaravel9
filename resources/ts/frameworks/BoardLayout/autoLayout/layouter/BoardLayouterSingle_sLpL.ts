import _ from "lodash";
import { BoardAutoLayoutService } from "../BoardAutoLayoutService";
import { BoardLayouterSingleAbstract } from "./BoardLayouterAbstract";
import { BoardAutoLayoutTypes } from "../models/TypeBoardAutoLayout"
import { BoardAutoLayoutResult } from "../models/BoardAutoLayoutResult";

/**
 * シート1枚に複数製品
 * 材料の長辺に製品の短辺をあてる
 * */
export class BoardLayouterSingle_sLpL extends BoardLayouterSingleAbstract {

    constructor (service:BoardAutoLayoutService) {
        super(service) ;
    }

    // 型判別用
    get IsBoardLayouterSingle_sLpL():boolean { return true ; }

    get Name():BoardAutoLayoutTypes { return BoardAutoLayoutTypes.SINGLE_SH_LONGER_PD_LONGER ; }

    get IsProductRotate():boolean { return false ; }

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
            this.Service.ProductLonger ,
            this.Service.ProductShorter ) ;
    }

    public static is(arg:any):arg is BoardLayouterSingle_sLpL {
        if (arg?.IsBoardLayouterSingle_sLpL === undefined) return false ;
        return arg.IsBoardLayouterSingle_sLpL ;
    }
}
