import {IDbRow} from "../../../../models/DbRowAbstract";

export class MTax implements IDbRow {
    id?:number ; 
    start_day?:Date|null ;
    tax_rate:number = 0 ;
    reduced_tax_rate:number = 0 ;

    constructor() {
    }

    public get IsMTax():boolean {
        return true ;
    }

    public static parse(obj:Partial<MTax>):MTax {
        const row = new MTax() ;
        Object.assign(row, obj) ;

        return row ;
    }

    public static is(arg:any):arg is MTax {
        if ( arg?.IsMTax === undefined) return false ;
        return arg.IsMTax ;
    }

}