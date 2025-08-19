import {IDbRow} from "../../../../models/DbRowAbstract";
import { MKv } from "./MKv";

export class SmUserOption implements IDbRow{
    id?:number ; 

    key_m_kv_id?:number ; 
    key_m_kv?:MKv ; 
    
    order_no?:number ; 
    name?:string ; 
    application?:string ; 
    option_01?:string ; 
    option_02?:string ; 
    option_03?:string ; 
    option_04?:string ; 
    option_05?:string ; 
    default_value?:string ;
    target_sm_user_option_id:number|null = null;

    public get IsPersonalOption():boolean{
        return true ; 
    }

    public static parse(obj:Partial<SmUserOption>):SmUserOption{
        const row = new SmUserOption() ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is SmUserOption { 
        if ( arg?.IsPersonalOption === undefined) return false ; 
        return arg.IsPersonalOption ; 
    } 

}