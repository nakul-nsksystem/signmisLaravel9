import _ from "lodash";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { TIvtMaterialComplete } from "./TIvtMaterialComplete";
export class TIvtMaterial extends DbRowAbstract  { 

    m_branch_id?:number|null = null 
    m_material_detail_id:number|null = null 
    supplier_m_customer_id:number|null = null 
    t_p_invoice_detail_id?:number|null = null 
    t_p_order_detail_id?:number|null = null 
    lot_no?:string
    ivt_m_kv_id:number|null = null 
    conducted_at:Date|string = ""
    qty:number = 0  
    price:number = 0  
    total_price:number = 0  
    memo?:string|null = null

    ivt_material_name?:string = ""
    supplier_m_customer_name?:string = ""
    t_ivt_material_complete?:TIvtMaterialComplete

    deleted_at:string|null = null
    
    material_ivt_div_m_kv_id?:number
    po_unit_m_kv_id?:number
    
    constructor (createdMUserId:number ) { 
        super(createdMUserId) ; 
    } 
    
    public static parse(obj:Partial<TIvtMaterial>){
        const row = new TIvtMaterial(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        if( !_.isEmpty(row.t_ivt_material_complete) ) {
            //@ts-ignore
            row.t_ivt_material_complete = TIvtMaterialComplete.parse(row.t_ivt_material_complete)
        }

        return row ; 
    }

    public static is(arg:any):arg is TIvtMaterial { 
        if ( arg?.TIvtMaterial === undefined) return false ; 
        return arg.TIvtMaterial ; 
    } 


    

}



