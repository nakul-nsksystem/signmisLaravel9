import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { TProjectConstructionResultUser } from "./TProjectConstructionResultUser";
import { TProjectConstructionResultPicture } from "./TProjectConstructionResultPicture";
import { TProjectConstructionResultCost } from "./TProjectConstructionResultCost";


export class TProjectConstructionResult extends DbRowAbstract  { 
    t_project_delivery_id :number|null = null 
    // t_project_construction_id :number|null = null  
    result_start_time :any = null 
    result_end_time :any = null 
    cost :number|null = null 
    memo :string|null = null 
    public t_project_construction_result_users:Array<TProjectConstructionResultUser> = [] ;     
    public t_project_construction_result_pictures:Array<TProjectConstructionResultPicture> = [] ;     
    public t_project_construction_result_costs:Array<TProjectConstructionResultCost> = [] ;     
    // t_project_construction_result_users? : TProjectConstructionResultUser  ;
    // t_project_construction_result_pictures? : TProjectConstructionResultPicture  ;
    // t_project_construction_result_costs? : TProjectConstructionResultCost  ;


    public static parse(obj:Partial<TProjectConstructionResult>){
        const row = new TProjectConstructionResult(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        return row ; 
    }

    public static is(arg:any):arg is TProjectConstructionResult { 
        if ( arg?.TProjectConstructionUser === undefined) return false ; 
        return arg.TProjectConstructionUser ; 
    } 

}



