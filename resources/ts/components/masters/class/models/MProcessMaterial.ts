import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MProcessMaterial extends DbRowAbstract{
    enabled_is_column?:string ; 
    name?:string ; 
    rate_value?:string ;
    rate_type_m_kv_id?:number ; 
    price_type?:number ; 
    m_matrix_id?:number ; 
    matrix_key_01_column?:string ; 
    matrix_key_02_column?:string ; 
    price_column?:string ; 
    
    get IsMProcessMaterial():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProcessMaterial>):MProcessMaterial{
        const row = new MProcessMaterial(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MProcessMaterial { 
        if ( arg?.IsMProcessMaterial === undefined) return false ; 
        return arg.IsMProcessMaterial ; 
    } 

}