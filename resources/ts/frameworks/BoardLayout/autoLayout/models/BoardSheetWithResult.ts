import _ from "lodash";
import { TypeBoardSheet, TypeBoardSheetResult } from "./TypeBoardAutoLayout";

/**
 * 材料のシートサイズ＆結果
 */
export class BoardSheetWithResult implements TypeBoardSheet {

    /**
     * id
     **/
    id?:number ;

    /**
     * W
     **/
    w:number = 0 ;

    /**
     * H
     **/
    h:number = 0 ;

    /**
     * シミュレーション結果
     */
    layout_result:TypeBoardSheetResult ;

    /**
     * Constructor
     * @param w W
     * @param h H
     * @param layoutResult 結果
     * @param id ID
     */
    constructor(
        w:number ,
        h:number ,
        layoutResult:TypeBoardSheetResult ,
        id:number|undefined = undefined
    ){
        this.w = w ;
        this.h = h ;
        this.layout_result = layoutResult ;
        this.id = id ;
    }

    get IsBoardSheetWithResult():boolean { return true ; }

    /**
     * 面積
     */
    get Sqm():number {
        return this.w * this.h * 0.001 * 0.001 ;
    }

    public static is(arg:any):arg is BoardSheetWithResult {
        if (arg?.IsBoardSheetWithResult === undefined) return false ;
        return arg.IsBoardSheetWithResult ;
    }
}