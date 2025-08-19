import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class TProjectConstructionResultCost extends DbRowAbstract  { 
 
    t_project_construction_result_id :number|null = null 
    cost_name :string|null = null
    value :number|null = null

    public static parse(obj:Partial<TProjectConstructionResultCost> ){
        const row = new TProjectConstructionResultCost(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        return row ; 
    }

    public static is(arg:any):arg is TProjectConstructionResultCost { 
        if ( arg?.TProjectConstructionResultCost === undefined) return false ; 
        return arg.TProjectConstructionResultCost ; 
    } 

}



