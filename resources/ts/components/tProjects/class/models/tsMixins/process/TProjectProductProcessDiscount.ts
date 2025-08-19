import _ from "lodash";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { TProjectProduct } from "../../TProjectProduct";


export class TProjectProductProcessDiscount {

    // 型判別用
    get IsTProjectProductProcessDiscount():boolean{
        return true ; 
    }

    /**
     * 値引き額
     */
    //@ts-ignore
    get DiscountAmount ():number { return this.TProjectProduct.SellPrice; }
    //@ts-ignore
    set DiscountAmount (v:number ){ this.TProjectProduct.SellPrice = v ; }

    /**
     * 合計値引き額
     */
    get TotalDiscount ():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this) && !_.isNil(this.TProjectProduct)){            
            val = NumberUtil.invalid2zr(this.DiscountAmount) * NumberUtil.invalid2zr(this.TProjectProduct.Qty) ;
            this.TProjectProduct.SellPrice = NumberUtil.invalid2zr(this.DiscountAmount) ;
            // this.TProjectProduct.SellTotalPrice = val ;
        }
        return val ;
    }


    public static Init(p:TProjectProductProcessDiscount){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
            }
        }
    }
    
    public static is(arg:any):arg is TProjectProductProcessDiscount { 
        if ( arg?.IsTProjectProductProcessDiscount === undefined) return false ; 
        return arg.IsTProjectProductProcessDiscount ; 
    } 
    

}


