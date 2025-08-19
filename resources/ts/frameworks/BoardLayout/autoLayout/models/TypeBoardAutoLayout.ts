import { BoardAutoLayoutResult } from "./BoardAutoLayoutResult";

/**
 * 材料のシートサイズ
 */
export type TypeBoardSheet = {
    id?:number ;
    w:number ;
    h:number ;
}

/**
 * シートに対する結果
 */
export type TypeBoardSheetResult = {
    [BoardAutoLayoutTypes.SINGLE_SH_LONGER_PD_SHORTER]:BoardAutoLayoutResult ,
    [BoardAutoLayoutTypes.SINGLE_SH_LONGER_PD_LONGER]:BoardAutoLayoutResult ,
    [BoardAutoLayoutTypes.MULTI_SH_LONGER_PD_SHORTER]:BoardAutoLayoutResult ,
    [BoardAutoLayoutTypes.MULTI_SH_LONGER_PD_LONGER]:BoardAutoLayoutResult ,
    [BoardAutoLayoutTypes.MULTI_SH_LONGER_PD_LONGER_OVER_S_SHORTER]:BoardAutoLayoutResult ,
    fail_reason?:string ,
}

/**
 * 自動レイアウトモード
 */
enum BoardAutoLayoutTypes {

    /**
     * シートの短辺に製品の長辺が入る
     **/
    SINGLE_SH_LONGER_PD_SHORTER = 'Single_sLpS' ,

    /**
     * シートの長辺に製品の長辺が入る
     */
    SINGLE_SH_LONGER_PD_LONGER = 'Single_sLpL' ,

    /**
     * 複数シート必要
     * シートの長辺に製品の長辺が入らない
     * 材料の長辺に製品の短辺をあてる
     **/
    MULTI_SH_LONGER_PD_SHORTER = 'Multi_sLpS' ,

    /**
     * 複数シート必要
     * シートの長辺に製品の長辺が入らない
     * 材料の短辺に製品の短辺をあてる
     **/
    MULTI_SH_LONGER_PD_LONGER = 'Multi_sLpL' ,

    /**
     * 複数シート必要
     * シートの長辺に製品の長辺は入るが
     * 材料の短辺に製品の短辺が入らない
     * 材料短辺方向に継ぐ
     **/
    MULTI_SH_LONGER_PD_LONGER_OVER_S_SHORTER = 'Multi_sLpL_overSS' ,
}

/**
 * 優先モード
 */
enum BoardAutoLayoutPriorityModes {
    // 継ぎ枚数重視
    JOINED_QTY = "qty" ,
    // コスト重視
    COST = "cost",
}

export {
    BoardAutoLayoutTypes ,BoardAutoLayoutPriorityModes
} ;