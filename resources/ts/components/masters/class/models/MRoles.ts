import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MRole extends DbRowAbstract{
    public name?:string  ;   
    m_role_details:Array<object> = [] ;  

    get IsMRole():boolean{
        return true ; 
    }
    
    public static parse(obj:Partial<MRole>):MRole{
        const row = new MRole(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MRole { 
        if ( arg?.IsMRole === undefined) return false ; 
        return arg.IsMRole ; 
    } 

}