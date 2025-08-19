import { DbRowAbstract } from "../../../../models/DbRowAbstract";

export class MKv extends DbRowAbstract{
    public kv_cd?:string  ;     
    public kv_name?:string  ;   
    public kv_short_name?:string ;   
    public target_m_kv_category_id?:number ;   
    public g_01?:string ;   
    public g_02?:string ;   
    public g_03?:string ;   
    public g_04?:string ;   
    public g_05?:string ;   
    public g_06?:string ;   
    public g_07?:string ;   
    public g_08?:string ;   
    public g_09?:string ;   
    public g_10?:string ;   

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMKv():boolean{
        return true ; 
    }


    
    public static is(arg:any):arg is MKv { 
        if ( arg?.IsMKv === undefined) return false ; 
        return arg.IsMKv ; 
    } 


    public static parse(obj:Partial<MKv>):MKv{
        const row = new MKv(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

}