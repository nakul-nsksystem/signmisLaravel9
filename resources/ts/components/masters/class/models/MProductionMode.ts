import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MKv } from "./MKv";


export class MProductionMode extends DbRowAbstract{
    public name?:string  ; 

    speed_unit_m_kv_id?:number ; 
    speed_unit_m_kv?:MKv ; 
    

    prepare_sec_per_job:number = 0 ;     
    prepare_sec_per_qty:number = 0 ; 
    speed_per_hour:number = 0 ; 


    n_01?:number ; 

    get IsMProductionMode():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProductionMode>):MProductionMode{
        const row = new MProductionMode(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is MProductionMode { 
        if ( arg?.IsMProductionMode === undefined) return false ; 
        return arg.IsMProductionMode ; 
    } 


}