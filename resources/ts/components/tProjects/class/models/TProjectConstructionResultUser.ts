import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class TProjectConstructionResultUser extends DbRowAbstract  { 

    t_project_construction_result_id:number|null = null 
    m_user_id :number|null = null 
    out_source_m_customer_id :number|null = null 
    out_source_person_name :string|null = null
    out_source_m_branch_id :number|null = null 
    num_of_out_source_people :number|null = null 
    out_source_price :number|null = null 
    out_source_total_price :number|null = null

    public static parse(obj:Partial<TProjectConstructionResultUser>){
        const row = new TProjectConstructionResultUser(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        return row ; 
    }

    public static is(arg:any):arg is TProjectConstructionResultUser { 
        if ( arg?.TProjectConstructionResultUser === undefined) return false ; 
        return arg.TProjectConstructionResultUser ; 
    } 

}



