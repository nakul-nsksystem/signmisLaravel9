import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MCustomer } from "../../../masters/class/models/MCustomer";
import { MBranch } from "../../../masters/class/models/MBranch";

export class TProjectConstructionUser extends DbRowAbstract  { 
    t_project_delivery_id :number|null = null 
    t_project_delivery_uid :number|null = null 
    // t_project_construction_id :number|null = null 
    m_user_id :number|null = null 
    out_source_m_customer_id :number|null = null 
    out_source_m_customer :MCustomer|null = null 
    out_source_person_name :string|null = null 

    out_source_m_branch_id :number|null = null 
    // get OutSourceMBranchId ():number|null { 
    //     const branchId = this.out_source_m_customer?.m_branch_id ?? null ;
    //     this.out_source_m_branch_id = branchId
    //     return branchId ;
    // }

    out_source_m_branch :MBranch|null = null 

    num_of_out_source_people :number|null = null 
    out_source_price :number|null = null
    out_source_total_price :number|null = null
    
    t_p_order_detail :any = {}
    
    public static parse(obj:Partial<TProjectConstructionUser>){
        const row = new TProjectConstructionUser(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        // row.OutSourceMBranchId;
        return row ; 
    }

    public static is(arg:any):arg is TProjectConstructionUser { 
        if ( arg?.TProjectConstructionUser === undefined) return false ; 
        return arg.TProjectConstructionUser ; 
    } 

}



