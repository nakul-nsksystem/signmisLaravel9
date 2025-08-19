import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MProductionOption extends DbRowAbstract{
    public name?:string  ; 

    speed_rate:number = 1 ; 

    num_of_colors_for_cost:number = 0 ; 
    num_of_white_for_cost:number = 0 ; 
    num_of_varnish_for_cost:number = 0 ; 
    
    get IsMProductionOption():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProductionOption>):MProductionOption{
        const row = new MProductionOption(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is MProductionOption { 
        if ( arg?.IsMProductionOption === undefined) return false ; 
        return arg.IsMProductionOption ; 
    } 

}