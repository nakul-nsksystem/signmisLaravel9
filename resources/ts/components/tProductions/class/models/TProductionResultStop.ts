import _, { NumericDictionaryIteratee } from "lodash";
import DayJsEx from "../../../../frameworks/DayJsEx";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { IDbSoftDelete } from "../../../../models/IDbSoftDelete";

/**
 * 生産
 */
export interface ITProductionResultStop {  

    //list:Array<object> ;
    
}



export class TProductionResultStop extends DbRowAbstract implements ITProductionResultStop ,IDbSoftDelete { 
    public t_production_result_id?:number ; 
    public input_type_m_kv_id:number ; 
    public reason_m_kv_id:number ; 
    public started_at?:Date ; 
    public ended_at?:Date ; 
    public minutes:number ; 
    public memo?:string ; 

    

    public deleted_at:Date|null ; 


    constructor (createdUserId:number) { 
        super(createdUserId) ; 
        this.input_type_m_kv_id = 0 ; 
        this.reason_m_kv_id = 0 ; 
        this.deleted_at = null ; 

        this.minutes = 0 ; 
    }
    
    
    toJSON () {
        // console.log("started_at") ; 
        // console.log(this.started_at) ; 
        // console.log(DayJsEx.formatDateTime(this.started_at) ) ; 
        // console.log("outputJson") 
        return {
            //m_production_id: this.m_production_id,
            id : this.id , 
            deleted_at : this.deleted_at ,
            //t_production_process_plans_id : this.t_production_process_plans_id , 
            input_type_m_kv_id : this.input_type_m_kv_id , 
            reason_m_kv_id : this.reason_m_kv_id , 
            started_at : DayJsEx.formatDateTime(this.started_at) ,  
            ended_at :  DayJsEx.formatDateTime(this.ended_at) , 
            minutes : NumberUtil.round(this.minutes , 2)  , 
            memo : this.memo , 
            created_m_user_id : this.created_m_user_id , 
            updated_m_user_id : this.updated_m_user_id , 
            
            //list: JSON.stringify(this.list),
            //groups : JSON.stringify(this.groups) 
        }
    }


    get IsTProductionResultStop():boolean{
        return true ; 
    }


    
    public static is(arg:any):arg is TProductionResultStop { 
        if ( arg?.IsTProductionResultStop === undefined) return false ; 
        return arg.IsTProductionResultStop ; 
    } 



    public static parse( obj:Partial<TProductionResultStop>){        
        const row = new TProductionResultStop(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);

        return row ; 

    }      


}



