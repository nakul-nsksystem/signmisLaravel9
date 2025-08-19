import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MTag } from "./MTag";


export class MTagCategory extends DbRowAbstract{
    order_no?:number 
    tag_category_key?:string 
    tag_category_name?:string 
    tag_short_name?:string 
    is_user_editable:boolean = false     
    m_tags:MTag[] = []

    public get IsMTag():boolean{
        return true ; 
    }


    public static parse(obj:Partial<MTagCategory>):MTagCategory{
        const row = new MTagCategory(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is MTagCategory { 
        if ( arg?.IsMTag === undefined) return false ; 
        return arg.IsMTag ; 
    } 

}