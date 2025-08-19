import {IDbRow} from "../../../../models/DbRowAbstract";
import { SmUserOption } from "./SmUserOption";


export class MUserOption implements IDbRow{
    id?:number ; 
    order_no?:number ; 
    m_user_id ?:number ; 
    sm_user_option_id ?:number ; 
    sm_user_option ?:SmUserOption ; 
    
    name ?:string ; 
    value?:string ;
    target_value?:string ;

    is_apply?:boolean = false ;
    is__target_apply?:boolean  ;


    public static parse(obj:Partial<MUserOption>):MUserOption{
        const row = new MUserOption() ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is MUserOption { 
        if ( arg?.MUserOption === undefined) return false ; 
        return arg.MUserOption ; 
    } 

}