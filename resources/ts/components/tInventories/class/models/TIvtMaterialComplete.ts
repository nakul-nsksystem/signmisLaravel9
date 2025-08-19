import _ from "lodash";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";

export class TIvtMaterialComplete extends DbRowAbstract  { 

    
    constructor (createdMUserId:number ) { 
        super(createdMUserId) ; 
    } 
    
    m_material_detail_id:number|null = null 
    t_ivt_material_id:number|null = null 
    completed_at:Date|string|null = null 
    qty:number = 0  
    total_price:number = 0 
    deleted_at?:string|null = null

    public static parse(obj:Partial<TIvtMaterialComplete>){
        const row = new TIvtMaterialComplete(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        return row ; 
    }

    public static is(arg:any):arg is TIvtMaterialComplete { 
        if ( arg?.TIvtMaterialComplete === undefined) return false ; 
        return arg.TIvtMaterialComplete ; 
    } 


    

}



