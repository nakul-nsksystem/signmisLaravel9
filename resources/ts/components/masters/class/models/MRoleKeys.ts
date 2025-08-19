import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MRoleKey extends DbRowAbstract{
    m_role_key_category_id?:number 
    order_no?:number 
    name?:string 
    explanation?:string 
    system_flg?:boolean 
    memo?:string     

    get IsMRoleKey():boolean{
        return true ; 
    }
    
    public static parse(obj:Partial<MRoleKey>):MRoleKey{
        const row = new MRoleKey(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MRoleKey { 
        if ( arg?.IsMRoleKey === undefined) return false ; 
        return arg.IsMRoleKey ; 
    } 

}