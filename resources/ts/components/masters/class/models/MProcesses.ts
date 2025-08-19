import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MProcesses extends DbRowAbstract{
    name?:string ; 
    enabled_is_column?:string ; 
    is_use_prepare_per_job:boolean = false ; 
    is_use_prepare_per_qty:boolean = false ;
    is_use_operation:boolean = false ; 

    prepare_per_job_target_m_production_no?:number ; 
    prepare_per_job_speed_ref_type?:number   ; 
    prepare_per_job_speed_m_matrix_id?:number ;
    prepare_per_job_speed_matrix_key_01_column?:string ;  
    prepare_per_job_speed_matrix_key_02_column?:string ;  
    prepare_per_job_speed_ref_value?:string ; 
    prepare_per_job_speed_difficulty_column?:string ; 
    prepare_per_job_rate_type_m_kv_id?:number ; 
    prepare_per_job_rate_value?:string ; 
    prepare_per_job_price_column?:string ; 

    prepare_per_qty_target_m_production_no?:number ; 
    prepare_per_qty_speed_ref_type?:number   ; 
    prepare_per_qty_speed_m_matrix_id?:number ;
    prepare_per_qty_speed_matrix_key_01_column?:string ;  
    prepare_per_qty_speed_matrix_key_02_column?:string ;  
    prepare_per_qty_speed_ref_value?:string ; 
    prepare_per_qty_speed_difficulty_column?:string ; 
    prepare_per_qty_rate_type_m_kv_id?:number ; 
    prepare_per_qty_rate_value?:string ; 
    prepare_per_qty_price_column?:string ; 

    operation_target_m_production_no?:number ; 
    operation_speed_ref_type?:number   ; 
    operation_speed_m_matrix_id?:number ;
    operation_speed_matrix_key_01_column?:string ;  
    operation_speed_matrix_key_02_column?:string ;  
    operation_speed_ref_value?:string ; 
    operation_speed_difficulty_column?:string ; 
    operation_rate_type_m_kv_id?:number ; 
    operation_rate_value?:string ; 
    operation_price_column?:string ; 
    operation_speed_ref_unit_name?:string ; 
    
    get IsMProcesses():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProcesses>):MProcesses{
        const row = new MProcesses(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MProcesses { 
        if ( arg?.IsMProcesses === undefined) return false ; 
        return arg.IsMProcesses ; 
    } 

}