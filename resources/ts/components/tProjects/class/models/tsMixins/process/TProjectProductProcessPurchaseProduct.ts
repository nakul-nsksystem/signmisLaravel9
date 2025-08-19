import _ from "lodash";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessPurchaseProduct {

    // 型判別用
    get IsTProjectProductProcessPurchaseProduct():boolean{
        return true ; 
    }

    public static Init(p:TProjectProductProcessPurchaseProduct){        
        if (TProjectProductProcess.is(p)){
            p.is_order_needed = true  ; 
            p.is_outsource = true ; 
            p.is_outsource_cost_input = true ;         
        }
    }
    
    public static is(arg:any):arg is TProjectProductProcessPurchaseProduct { 
        if ( arg?.IsTProjectProductProcessPurchaseProduct === undefined) return false ; 
        return arg.IsTProjectProductProcessPurchaseProduct ; 
    } 
    

}


