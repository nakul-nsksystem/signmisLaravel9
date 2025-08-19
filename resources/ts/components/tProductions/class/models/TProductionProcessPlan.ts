import _ from "lodash";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { TProductionDayGroup } from "./TProductionDayGroup";
import { TProductionResult } from "./TProductionResult";

/**
 * 生産予定
 */
export interface ITProductionProcessPlan {  

    //list:Array<object> ;
    
}



export class TProductionProcessPlan extends DbRowAbstract implements ITProductionProcessPlan{ 
    public t_project_product_process_id?:number ; 
    public t_production_day_group_id?:number ; 
    public order_no?:number ; 
    public qty:number ; 
    public results:Array<TProductionResult> = [] ; 
    public t_production_day_group?:TProductionDayGroup ; 

    constructor (createdMUserId:number ) { 
        super(createdMUserId) ; 
        this.qty = 0 ; 
    }


    toJSON () {
        
        return {
            //m_production_id: this.m_production_id,
            // id : this.id , 
            //t_project_product_process_id : this.t_project_product_process_id , 
            //t_production_day_group_id : this.t_production_day_group_id , 
            order_no : this.order_no , 
            qty : this.qty , 
        }
    }    
    
    

    public static parse( obj:Partial<TProductionProcessPlan>){        
        const row = new TProductionProcessPlan(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        
        // resultをParse
        const parsedResults = row.results.map(x => TProductionResult.parse(x)) ;         
        ArrayUtil.resetInsert(row.results , parsedResults) ; 

        return row ; 

    }

}



