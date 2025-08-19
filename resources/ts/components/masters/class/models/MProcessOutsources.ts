import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MProcessOutsources extends DbRowAbstract{
    enabled_is_column?:string ; 
    name?:string ; 
    rate_value?:string ;
    rate_type_m_kv_id?:number ; 
    price_column?:string ; 
    
    is_ignore_qty:boolean = false ; 
    is_price_ref_from_m_production:boolean = false ; 

    get IsMProcessOutsources():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProcessOutsources>):MProcessOutsources{
        const row = new MProcessOutsources(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MProcessOutsources { 
        if ( arg?.IsMProcessOutsources === undefined) return false ; 
        return arg.IsMProcessOutsources ; 
    }

}