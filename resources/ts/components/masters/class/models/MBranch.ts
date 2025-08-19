import {IDbRow} from "../../../../models/DbRowAbstract";
import _ from "lodash"
import NumberUtil from "../../../../frameworks/NumberUtil";

export class MBranch implements IDbRow{
    id?:number ; 

    cd?:string ; 
    order_no?:number ;
    name?:string; 
    short_name?:string; 
    symbol?:string; 
    zip?:string; 
    address1?:string; 
    address2?:string; 
    tel?:string; 
    fax?:string; 
    t_p_order_email?:string; 
    production_start_at?:Date; 
    production_end_at?:Date; 
    account_info?:string; 
    memo?:string; 
    color_m_kv_id?:number;
    payment_date?:number;
    closing_date?:number;

    /**
     * 支払日（日付のみ）
     */
    get ShortPaymentDate () :number {
        const num = NumberUtil.invalid2zr(this.payment_date) ;
        return num == 0 ? 0 : num % 100  ;
    }

    get IsMBranch():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MBranch>):MBranch{
        const row = new MBranch() ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    

    public static is(arg:any):arg is MBranch { 
        if ( arg?.IsMBranch === undefined) return false ; 
        return arg.IsMBranch ; 
    } 

}