import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class TProjectConstructionResultPicture extends DbRowAbstract  { 

    t_project_construction_result_id :number|null = null 
    filename :string|null = null 
    filepath :string|null = null 
    base64_preview :string|null = null 
    memo :string|null = null

    public static parse(obj:Partial<TProjectConstructionResultPicture>){
        const row = new TProjectConstructionResultPicture(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        return row ; 
    }

    public static is(arg:any):arg is TProjectConstructionResultPicture { 
        if ( arg?.TProjectConstructionResultPicture === undefined) return false ; 
        return arg.TProjectConstructionResultPicture ; 
    } 

}



