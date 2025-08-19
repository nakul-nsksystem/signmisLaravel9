import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MProductCategory extends DbRowAbstract{
    cd?:string ; 
    is_board?:boolean = false ; 
    material_category_m_kv_id?:number  ; 
    is_able_media_separate_both_side:boolean = false  ; 
    
    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }
    
    get IsMProductCategory():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProductCategory>):MProductCategory{
        const row = new MProductCategory(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MProductCategory { 
        if ( arg?.IsMProductCategory === undefined) return false ; 
        return arg.IsMProductCategory ; 
    } 

}