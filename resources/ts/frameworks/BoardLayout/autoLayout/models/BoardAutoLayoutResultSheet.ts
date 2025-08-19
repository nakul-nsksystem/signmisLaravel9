import _ from "lodash";

/**
 * レイアウターの結果内のシート内訳
 */
export class BoardAutoLayoutResultSheet {

    /**
     * W
     **/
    get W():number { return this._w ; }
    _w:number ;

    /**
     * H
     **/
    get H():number { return this._h ; }
    _h:number ;

    /**
     * 数量
     */
    get Qty():number { return this._qty ; }
    _qty:number ;

    /**
     * カット数
     */
    get NumOfCut():number { return this._num_of_cut ; }
    _num_of_cut:number ;

    /**
     * Constructor
     * @param w W
     * @param h H
     * @param qty 枚数
     * @param numOfCut カット数
     */
    constructor(
        w:number ,
        h:number ,
        qty:number ,
        numOfCut:number ) {

        this._w = w ;
        this._h = h ;
        this._qty = qty ;
        this._num_of_cut = numOfCut ;
    }

    get IsBoardAutoLayoutResultSheet():boolean { return true ; }

    /**
     * 面積
     */
    get Sqm():number {
        return this._w * this._h * 0.001 * 0.001 ;
    }

    public static is(arg:any):arg is BoardAutoLayoutResultSheet {
        if (arg?.IsBoardAutoLayoutResultSheet === undefined) return false ;
        return arg.IsBoardAutoLayoutResultSheet ;
    }
}