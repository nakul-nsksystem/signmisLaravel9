import _ from "lodash";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MCalendar extends DbRowAbstract{
    public m_branch_id?:number  ;     
    public m_customer_id?:number  ;     
    public day?:Date  ;     
    public start_time?:any  ;     
    public end_time?:any  ;     
    public category_m_kv_id?:number  ;     

    public calendar_note?:string; 

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMCalendar():boolean{
        return true ; 
    }
    
    public static is(arg:any):arg is MCalendar { 
        if ( arg?.IsMCalendar === undefined) return false ; 
        return arg.IsMCalendar ; 
    } 

    public static parse(obj:Partial<MCalendar>):MCalendar{
        const row = new MCalendar(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);

        return row ; 
    }

}