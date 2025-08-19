import _ from "lodash";
import MKvsConst from "../../../../consts/MKvsConst";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import DayJsEx from "../../../../frameworks/DayJsEx";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { TProjectProductProcess } from "../../../tProjects/class/models/TProjectProductProcess";
import { TProjectProductProcessPredicted } from "../../../tProjects/class/models/tsMixins/TProjectProductProcessPredicted";
import { TProductionAbstract, TProductionGroupAbstract } from "./TProductionAbstract";
import { TProductionDay } from "./TProductionDay";
import {ITProductionGroup, TProductionDayGroup } from "./TProductionDayGroup";
import { TProductionResultStop } from "./TProductionResultStop";
import { TProductionResultUser } from "./TProductionResultUser";

/**
 * 生産
 */
export interface ITProductionResult {  

    //list:Array<object> ;
    
}



export class TProductionResult extends DbRowAbstract implements ITProductionResult {     
    public tmp_id?:number ; 

    public m_production_id?:number ; 
    public t_production_day_group_id?:number  ;
    public result_type_flg?:number ; 
    public input_type_m_kv_id?:number ; 
    public started_at?:Date ; 
    public ended_at?:Date ; 
    public minutes:number ; 
    public qty:number ; 
    public loss_qty:number ; 
    public memo?:string ; 

    public deleted_at?:Date ; 

    public t_production_result_stops:Array<TProductionResultStop> 
    public t_production_result_users:Array<TProductionResultUser>

    public target_t_project_product_processes:TProjectProductProcess[] = [] ; 


    constructor (createdMUserId:number) { 
        super(createdMUserId) ; 

        this.minutes = 0 ; 
        this.qty = 0 ; 
        this.loss_qty = 0 ; 

        this.updated_m_user_id = createdMUserId ; 
        this.deleted_at = undefined ; 

        this.t_production_result_stops = [] ; 
        this.t_production_result_users = [] ; 
    }

    get IsTProductionResult():boolean{
        return true ; 
    }

    get StopMinutes():number { 
        const res = _.sumBy(this.t_production_result_stops , "minutes") ; 
        // console.log(res) ; 
        return res ; 
    }

    get TotalSqm():number { 
        
        return _.sumBy( this.target_t_project_product_processes , (x) => {
                        return x.total_custom_sqm === 0 
                            ? NumberUtil.invalid2zr( x.t_project_product?.total_sqm ) 
                            : NumberUtil.invalid2zr( x.total_custom_sqm)
                    }); 
    }

    get WorkHours():number { 
        const workMinutes = this.minutes - this.StopMinutes ; 
        return NumberUtil.round(workMinutes / 60 , 3) ; 
    }
    
    toJSON () {
        
        return {
            //m_production_id: this.m_production_id,
            id : this.id , 
            deleted_at:this.deleted_at , 
            m_production_id : this.m_production_id , 
            t_production_day_group_id : this.t_production_day_group_id , 
            //t_production_process_plans_id : this.t_production_process_plans_id , 
            result_type_flg : this.result_type_flg , 
            input_type_m_kv_id : this.input_type_m_kv_id , 
            started_at : DayJsEx.formatDateTime(this.started_at) ,  
            ended_at :  DayJsEx.formatDateTime(this.ended_at) , 
            minutes : NumberUtil.round(this.minutes , 2)  , 
            qty : this.qty , 
            loss_qty : this.loss_qty , 
            memo : this.memo , 
            tmp_id : this.tmp_id ,
            created_m_user_id : this.created_m_user_id , 
            updated_m_user_id : this.updated_m_user_id , 
            t_production_result_stops : this.t_production_result_stops , 
            t_production_result_users : this.t_production_result_users , 
            
        }
      }

    
    /**
     * CreatedUserをユーザーに足す
     */
    public addMuserByCreatedMUser()  { 
        const user = new TProductionResultUser( this.created_m_user_id , this.created_m_user_id) ; 
        // console.log(user) ; 
        this.t_production_result_users.push(user) ; 
    }
    

    public static createAsOnlyFInished(createdMUserId:number ,mProductionId:number ,resDay:any = DayJsEx.today() ):TProductionResult { 
        const result = new TProductionResult(createdMUserId) ; 
        result.m_production_id = mProductionId ; 
        result.result_type_flg = 0 ;         
        result.input_type_m_kv_id = MKvsConst.TProductions.Results.InputTypes.ONLY_IS_FINISHED ; 
        result.started_at = resDay ;  
        result.ended_at = resDay  ; 

        return result ; 
        
    }

    /**
     * グループから新規実績作成
     * @param createdMUserId 
     * @param g 
     * @returns 
     */
    public static createAsOnlyFinishedFromGroup(createdMUserId:number , g:TProductionDayGroup):TProductionResult{
        const result = this.createAsOnlyFInished(createdMUserId ,g.m_production_id ,g.planed_production_at ) ; 
        result.minutes = g.hour * 60 ; 
        result.addMuserByCreatedMUser() ;         
        return result ; 
    }


    
    /**
     * 工程から新規実績作成
     * @param createdMUserId 
     * @param p 
     * @returns 
     */
    public static createAsOnlyFinishedFromProcess(
        createdMUserId:number , 
        p:TProjectProductProcess ,
        mProductionId:number , 
        resDay:any 
        ):TProductionResult{

        
        const result = this.createAsOnlyFInished(createdMUserId  ,mProductionId ,resDay) ; 
        // result.input_type_m_kv_id = MKvsConst.TProductions.Results.InputTypes.ONLY_IS_FINISHED ; 
        // result.started_at = DayJsEx.today() , 
        // result.ended_at = DayJsEx.today() , 
        const dayGroupId = p.t_production_process_plan?.t_production_day_group_id ; 
        result.t_production_day_group_id = dayGroupId ; 
        if ( TProjectProductProcessPredicted.is(p)){
            result.minutes = (p.predicted_work_hour ?? 0) * 60 ; 
        }
        
        result.addMuserByCreatedMUser() ;         
        return result ; 
    }



    
    public static is(arg:any):arg is TProductionResult { 
        if ( arg?.IsTProductionResult === undefined) return false ; 
        return arg.IsTProductionResult ; 
    } 
    

    public static parse( obj:Partial<TProductionResult>){        
        const row = new TProductionResult(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);

        // stopをParse
        const parsedStops = row.t_production_result_stops.map(x => TProductionResultStop.parse(x)) ; 
        ArrayUtil.resetInsert(row.t_production_result_stops , parsedStops) ; 
        
        // userをParse
        const parsedUsers = row.t_production_result_users.map(x => TProductionResultUser.parse(x)) ; 
        ArrayUtil.resetInsert(row.t_production_result_users , parsedUsers) ; 
        
        // target_t_project_product_processesをParse
        // @ts-ignore
        const parsedProcesses = row.target_t_project_product_processes.map(x => TProjectProductProcess.parse(x , x.t_project_product ,undefined)) ; 
        ArrayUtil.resetInsert(row.target_t_project_product_processes , parsedProcesses) ; 
        




        return row ; 

    }


}



