import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MProcessLabel extends DbRowAbstract{
    enabled_is_column?:string ; 
    

    
    get IsMProcessLabel():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProcessLabel>):MProcessLabel{
        const row = new MProcessLabel(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MProcessLabel { 
        if ( arg?.IsMProcessLabel === undefined) return false ; 
        return arg.IsMProcessLabel ; 
    } 

}